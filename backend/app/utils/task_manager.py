import asyncio
import uuid
from datetime import datetime
from typing import Optional


class TaskManager:
    """In-memory async task tracker. Tracks crawl jobs with progress updates."""

    def __init__(self):
        self._tasks: dict[str, dict] = {}

    def create_job(self, source_id: str) -> str:
        """Register a new job and return its ID."""
        job_id = str(uuid.uuid4())[:8]
        self._tasks[job_id] = {
            "status": "pending",
            "pages_crawled": 0,
            "pages_total": 0,
            "indexed_count": 0,     # Pages actually stored in vector DB
            "is_ready": False,      # True once first page is indexed
            "pages": [],
            "error": None,
            "source_id": source_id,
            "created_at": datetime.now().isoformat(),
        }
        return job_id

    def start_task(self, job_id: str, coroutine):
        """Launch a background asyncio task for the given job."""
        async def _run():
            try:
                self._tasks[job_id]["status"] = "crawling"
                await coroutine
                # Only set completed if not already set to failed/completed by the coroutine
                if self._tasks[job_id]["status"] not in ("failed", "completed"):
                    self._tasks[job_id]["status"] = "completed"
            except Exception as e:
                self._tasks[job_id]["status"] = "failed"
                self._tasks[job_id]["error"] = str(e)

        asyncio.create_task(_run())

    def update_progress(
        self,
        job_id: str,
        pages_crawled: int,
        pages_total: int,
        page_info: Optional[dict] = None,
    ):
        """Update crawl progress for a job."""
        if job_id in self._tasks:
            self._tasks[job_id]["pages_crawled"] = pages_crawled
            self._tasks[job_id]["pages_total"] = pages_total
            if page_info:
                self._tasks[job_id]["pages"].append(page_info)

    def mark_page_indexed(self, job_id: str):
        """Increment indexed_count and flip is_ready on first indexed page."""
        if job_id in self._tasks:
            self._tasks[job_id]["indexed_count"] += 1
            if not self._tasks[job_id]["is_ready"]:
                self._tasks[job_id]["is_ready"] = True
                # Upgrade status from 'crawling' → 'ready'
                if self._tasks[job_id]["status"] == "crawling":
                    self._tasks[job_id]["status"] = "ready"

    def set_status(self, job_id: str, status: str, **kwargs):
        """Set job status and any additional metadata."""
        if job_id in self._tasks:
            self._tasks[job_id]["status"] = status
            self._tasks[job_id].update(kwargs)

    def get_status(self, job_id: str) -> dict | None:
        """Get current status of a job."""
        return self._tasks.get(job_id)


# Singleton instance
task_manager = TaskManager()
