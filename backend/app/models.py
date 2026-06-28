from pydantic import BaseModel
from typing import Optional


class IngestRequest(BaseModel):
    url: str
    max_depth: int = 2
    max_pages: int = 50


class IngestResponse(BaseModel):
    job_id: str
    source_id: str      # Available immediately — use to filter chat before job completes
    status: str
    message: str


class PageInfo(BaseModel):
    url: str
    title: str
    status: str  # "success", "failed"


class IngestStatusResponse(BaseModel):
    job_id: str
    source_id: Optional[str] = None
    status: str             # "crawling", "ready", "processing", "completed", "failed"
    pages_crawled: int
    pages_total: int
    indexed_count: int = 0  # Pages actually searchable in vector DB
    is_ready: bool = False  # True once first page is indexed (chat enabled)
    pages: list[PageInfo]
    error: Optional[str] = None


class ChatRequest(BaseModel):
    question: str
    source_ids: Optional[list[str]] = None
    chat_history: Optional[list[dict]] = None


class SourceResponse(BaseModel):
    id: str
    url: str
    title: str
    page_count: int
    chunk_count: int
    created_at: str


class SourcesListResponse(BaseModel):
    sources: list[SourceResponse]


class WebsiteAnalysisResponse(BaseModel):
    executive_summary: str
    main_topics: list[str]
    missing_information: list[str]
    target_audience: str
    suggested_questions: list[str]
    coverage_score: int
