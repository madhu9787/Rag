# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
from app.models import IngestRequest, IngestResponse, IngestStatusResponse, PageInfo
from app.services.crawler import WebCrawler
from app.services.chunker import chunker
from app.services.vector_store import vector_store
from app.utils.task_manager import task_manager
from app.config import MAX_CRAWL_DEPTH, MAX_PAGES
import uuid
import asyncio
from datetime import datetime

router = APIRouter(prefix="/api/ingest", tags=["ingest"])


@router.post("", response_model=IngestResponse)
async def start_ingest(request: IngestRequest):
    """Start a background crawl+index job. Returns immediately."""
    source_id = str(uuid.uuid4())[:8]
    job_id = task_manager.create_job(source_id=source_id)

    async def index_page_background(page, now: str):
        """
        Chunk + embed + store a single page.
        Runs as a fire-and-forget asyncio task so it NEVER blocks the crawl loop.
        Uses add_documents_async to offload ONNX to a thread pool.
        """
        try:
            chunks = chunker.chunk_text(
                page.content,
                metadata={
                    "source_id": source_id,
                    "source_url": request.url,
                    "source_title": page.title,
                    "page_url": page.url,
                    "page_title": page.title,
                    "created_at": now,
                },
            )

            if chunks:
                ids = [str(uuid.uuid4()) for _ in chunks]
                docs = [c["content"] for c in chunks]
                metas = [c["metadata"] for c in chunks]
                # Non-blocking: runs ChromaDB ONNX in thread pool
                await vector_store.add_documents_async(ids, docs, metas)

            # Flip is_ready on the first successfully indexed page
            task_manager.mark_page_indexed(job_id)

        except Exception as e:
            # Log but don't crash the whole crawl
            print(f"[ingest] Failed to index {page.url}: {e}")

    async def ingest_pipeline():
        """
        Streaming pipeline:
        - Crawler fetches pages in parallel batches (concurrency=20)
        - Each page is immediately dispatched to index_page_background as a
          fire-and-forget asyncio.Task — the crawl loop never waits for it
        """
        crawler = WebCrawler(
            max_depth=min(request.max_depth, MAX_CRAWL_DEPTH),
            max_pages=min(request.max_pages, MAX_PAGES),
        )
        now = datetime.now().isoformat()

        async def on_progress(pages_crawled, pages_total, page_info):
            task_manager.update_progress(job_id, pages_crawled, pages_total, page_info)

        async def on_page_ready(page):
            # Fire-and-forget: crawl loop continues immediately, index happens in background
            asyncio.create_task(index_page_background(page, now))

        pages = await crawler.crawl(
            request.url,
            on_progress=on_progress,
            on_page_ready=on_page_ready,
        )

        if not pages:
            task_manager.set_status(
                job_id, "failed", error="No pages could be crawled from this URL"
            )
            return

        # Wait for all background indexing tasks to finish before marking complete
        # Give them up to 60s after crawl finishes
        await asyncio.sleep(2)

        # Poll until all crawled pages are indexed (or timeout after 60s)
        for _ in range(30):
            job = task_manager.get_status(job_id)
            if job and job.get("indexed_count", 0) >= len(pages):
                break
            await asyncio.sleep(2)

        task_manager.set_status(job_id, "completed")

    task_manager.start_task(job_id, ingest_pipeline())

    return IngestResponse(
        job_id=job_id,
        source_id=source_id,
        status="crawling",
        message=f"Started crawling {request.url}",
    )


@router.get("/{job_id}", response_model=IngestStatusResponse)
async def get_ingest_status(job_id: str):
    """Get the current status of a crawl+index job."""
    status = task_manager.get_status(job_id)
    if not status:
        raise HTTPException(status_code=404, detail="Job not found")

    return IngestStatusResponse(
        job_id=job_id,
        source_id=status.get("source_id"),
        status=status["status"],
        pages_crawled=status["pages_crawled"],
        pages_total=status["pages_total"],
        indexed_count=status.get("indexed_count", 0),
        is_ready=status.get("is_ready", False),
        pages=[PageInfo(**p) for p in status["pages"]],
        error=status.get("error"),
    )
