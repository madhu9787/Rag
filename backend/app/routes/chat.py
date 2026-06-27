import json
from fastapi import APIRouter, HTTPException
from sse_starlette.sse import EventSourceResponse
from app.models import ChatRequest
from app.services.retriever import retriever
from app.services.llm import llm_service
from app.services.vector_store import vector_store
from app.services.analytics import analytics_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("")
async def chat(request: ChatRequest):
    """Stream a RAG-powered answer via Server-Sent Events.

    Events:
        - "sources": List of source URLs used for context
        - "token": Individual text token from LLM
        - "done": Stream complete
        - "error": Error occurred
    """
    # Guard: ensure we have ingested content
    if vector_store.count() == 0:
        raise HTTPException(
            status_code=400,
            detail="No documents ingested yet. Please ingest a URL first.",
        )

    # Log the query for analytics
    analytics_service.log_query()

    # Retrieve relevant chunks — non-blocking (ONNX runs in thread pool)
    source_id = request.source_ids[0] if request.source_ids else None
    chunks = await retriever.retrieve_async(question=request.question, source_id=source_id)

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No relevant content found for your question.",
        )

    # Build context and extract source metadata
    context = retriever.build_context(chunks)

    sources = []
    seen_urls: set[str] = set()
    for chunk in chunks:
        url = chunk["metadata"].get("page_url", "")
        title = chunk["metadata"].get("page_title", "")
        if url and url not in seen_urls:
            seen_urls.add(url)
            sources.append({"url": url, "title": title})

    async def event_generator():
        try:
            # Send sources first so frontend can display them immediately
            yield {
                "event": "sources",
                "data": json.dumps(sources),
            }

            # Stream LLM response token by token
            async for token in llm_service.generate_stream(request.question, context):
                yield {
                    "event": "token",
                    "data": json.dumps({"content": token}),
                }

            yield {
                "event": "done",
                "data": json.dumps({"status": "complete"}),
            }
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)}),
            }

    return EventSourceResponse(event_generator())
