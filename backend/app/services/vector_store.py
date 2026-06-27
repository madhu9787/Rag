import chromadb
from chromadb.config import Settings as ChromaSettings
from app.config import CHROMA_PERSIST_DIR, CHROMA_COLLECTION_NAME
from typing import Optional, Any
import asyncio
import concurrent.futures

# Thread pool dedicated to blocking ChromaDB / ONNX embedding calls
_EMBED_EXECUTOR = concurrent.futures.ThreadPoolExecutor(max_workers=2)


class VectorStore:
    """ChromaDB wrapper using built-in ONNX embeddings (all-MiniLM-L6-v2).

    No external embedding API required — ChromaDB auto-embeds documents and
    queries using its default embedding function (384 dimensions, ONNX runtime).

    IMPORTANT: all ChromaDB calls are CPU/IO bound (ONNX inference).
    Always call add_documents_async / query_async from async code to avoid
    blocking the FastAPI event loop.
    """

    def __init__(self):
        self._client = chromadb.PersistentClient(
            path=CHROMA_PERSIST_DIR,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self._collection = self._client.get_or_create_collection(
            name=CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )

    # ------------------------------------------------------------------
    # Sync helpers (run inside the thread-pool executor)
    # ------------------------------------------------------------------

    def _add_documents_sync(
        self,
        ids: list[str],
        documents: list[str],
        metadatas: list[Any],
    ) -> None:
        """Blocking add — called from the thread pool, never the event loop."""
        import time
        batch_size = 100
        for i in range(0, len(ids), batch_size):
            end = i + batch_size
            for attempt in range(3):
                try:
                    self._collection.add(
                        ids=ids[i:end],
                        documents=documents[i:end],
                        metadatas=metadatas[i:end],
                    )
                    break
                except Exception as e:
                    if attempt == 2:
                        raise e
                    time.sleep(1)

    def _query_sync(
        self,
        query_text: str,
        n_results: int,
        where: Optional[dict],
    ) -> Any:
        """Blocking query — called from the thread pool."""
        kwargs: dict = {
            "query_texts": [query_text],
            "n_results": n_results,
            "include": ["documents", "metadatas", "distances"],
        }
        if where:
            kwargs["where"] = where
        return self._collection.query(**kwargs)

    # ------------------------------------------------------------------
    # Async wrappers — safe to await from async FastAPI endpoints
    # ------------------------------------------------------------------

    async def add_documents_async(
        self,
        ids: list[str],
        documents: list[str],
        metadatas: list[Any],
    ) -> None:
        """Non-blocking add: offloads ONNX embedding to thread pool."""
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            _EMBED_EXECUTOR,
            self._add_documents_sync,
            ids,
            documents,
            metadatas,
        )

    async def query_async(
        self,
        query_text: str,
        n_results: int = 5,
        where: Optional[dict[str, Any]] = None,
    ) -> Any:
        """Non-blocking query: offloads ONNX embedding to thread pool."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            _EMBED_EXECUTOR,
            self._query_sync,
            query_text,
            n_results,
            where,
        )

    # ------------------------------------------------------------------
    # Sync legacy wrappers (kept for compatibility)
    # ------------------------------------------------------------------

    def add_documents(
        self,
        ids: list[str],
        documents: list[str],
        metadatas: list[Any],
    ) -> None:
        """Sync add — only use from non-async contexts."""
        self._add_documents_sync(ids, documents, metadatas)

    def query(
        self,
        query_text: str,
        n_results: int = 5,
        where: Optional[dict[str, Any]] = None,
    ) -> Any:
        """Sync query — only use from non-async contexts."""
        return self._query_sync(query_text, n_results, where)

    def delete_by_source(self, source_id: str) -> None:
        """Remove all chunks belonging to a source."""
        try:
            self._collection.delete(where={"source_id": source_id})
        except Exception:
            pass

    def get_sources(self) -> list[dict[str, Any]]:
        """Aggregate chunk metadata into source-level summaries."""
        results = self._collection.get(include=["metadatas"])
        sources: dict[str, dict[str, Any]] = {}

        metadatas = results.get("metadatas")
        if not metadatas:
            return []

        for meta in metadatas:
            if meta is None:
                continue
            sid = str(meta.get("source_id", ""))
            if not sid:
                continue

            if sid not in sources:
                sources[sid] = {
                    "id": sid,
                    "url": str(meta.get("source_url", "")),
                    "title": str(meta.get("source_title", "")),
                    "chunk_count": 0,
                    "page_urls": set(),
                    "created_at": str(meta.get("created_at", "")),
                }
            sources[sid]["chunk_count"] += 1
            page_url = str(meta.get("page_url", ""))
            if page_url:
                sources[sid]["page_urls"].add(page_url)

        return [
            {
                "id": str(s["id"]),
                "url": str(s["url"]),
                "title": str(s["title"]),
                "page_count": len(s["page_urls"]),
                "chunk_count": int(s["chunk_count"]),
                "created_at": str(s["created_at"]),
            }
            for s in sources.values()
        ]

    def count(self) -> int:
        """Total number of chunks stored."""
        return self._collection.count()


# Singleton instance
vector_store = VectorStore()
