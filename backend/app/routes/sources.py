from fastapi import APIRouter
from app.models import SourceResponse, SourcesListResponse
from app.services.vector_store import vector_store

router = APIRouter(prefix="/api/sources", tags=["sources"])


@router.get("", response_model=SourcesListResponse)
async def list_sources():
    """List all ingested sources with page/chunk counts."""
    sources = vector_store.get_sources()
    return SourcesListResponse(
        sources=[SourceResponse(**s) for s in sources]
    )


@router.delete("/{source_id}")
async def delete_source(source_id: str):
    """Delete a source and all its chunks from the vector store."""
    vector_store.delete_by_source(source_id)
    return {"message": f"Source {source_id} deleted successfully"}
