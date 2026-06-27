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

    chunk_buffer = {"ids": [], "docs": [], "metas": []}
    buffer_lock = asyncio.Lock()
    pending_tasks = set()

    async def flush_buffer(force=False):
        async with buffer_lock:
            if not chunk_buffer["ids"]:
                return
            if not force and len(chunk_buffer["ids"]) < 200:
                return

            ids = chunk_buffer["ids"][:]
            docs = chunk_buffer["docs"][:]
            metas = chunk_buffer["metas"][:]
            
            chunk_buffer["ids"].clear()
            chunk_buffer["docs"].clear()
            chunk_buffer["metas"].clear()
            
        if ids:
            try:
                await vector_store.add_documents_async(ids, docs, metas)
            except Exception as e:
                print(f"[ingest] Failed to flush buffer: {e}")

    async def index_page_background(page, now: str):
        """
        Chunk a single page and add to buffer.
        If buffer is large enough, flushes to ChromaDB.
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
                
                async with buffer_lock:
                    chunk_buffer["ids"].extend(ids)
                    chunk_buffer["docs"].extend(docs)
                    chunk_buffer["metas"].extend(metas)
                    
                await flush_buffer(force=False)

            # Flip is_ready on the first successfully indexed page
            task_manager.mark_page_indexed(job_id)

        except Exception as e:
            # Log but don't crash the whole crawl
            print(f"[ingest] Failed to index {page.url}: {e}")
        finally:
            pending_tasks.discard(asyncio.current_task())

    async def ingest_pipeline():
        """
        Streaming pipeline with chunk buffering:
        - Crawler fetches pages in parallel batches
        - Each page is chunked and buffered
        - Buffer is flushed to vector store in large batches
        """
        crawler = WebCrawler(
            max_depth=min(request.max_depth, MAX_CRAWL_DEPTH),
            max_pages=min(request.max_pages, MAX_PAGES),
        )
        now = datetime.now().isoformat()

        async def on_progress(pages_crawled, pages_total, page_info):
            task_manager.update_progress(job_id, pages_crawled, pages_total, page_info)

        async def on_page_ready(page):
            task = asyncio.create_task(index_page_background(page, now))
            pending_tasks.add(task)

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

        # Wait for all background chunking tasks to complete
        if pending_tasks:
            await asyncio.gather(*pending_tasks, return_exceptions=True)

        # Flush any remaining chunks in the buffer
        await flush_buffer(force=True)

        # Ensure UI knows all pages are indexed
        job = task_manager.get_status(job_id)
        if job and job.get("indexed_count", 0) < len(pages):
            for _ in range(len(pages) - job.get("indexed_count", 0)):
                task_manager.mark_page_indexed(job_id)

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
