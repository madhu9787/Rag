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

    # Rewrite query if we have chat history
    search_query = request.question
    if request.chat_history:
        search_query = await llm_service.rewrite_query(request.question, request.chat_history)
        print(f"[chat] Original: {request.question} -> Rewritten: {search_query}")

    # Retrieve relevant chunks — non-blocking (ONNX runs in thread pool)
    source_id = request.source_ids[0] if request.source_ids else None
    chunks = await retriever.retrieve_async(question=search_query, source_id=source_id)

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No relevant content found for your question.",
        )

    # Build context and extract source metadata
    context = retriever.build_context(chunks)

    sources = []
    seen_urls: set[str] = set()
    total_score = 0
    for chunk in chunks:
        total_score += chunk.get("score", 0)
        url = chunk["metadata"].get("page_url", "")
        title = chunk["metadata"].get("page_title", "")
        if url and url not in seen_urls:
            seen_urls.add(url)
            sources.append({"url": url, "title": title})
            
    # Calculate average confidence based on flashrank scores
    # FlashRank scores are typically raw logits, but higher is better.
    # We will normalize this loosely to a percentage for UI.
    avg_score = (total_score / len(chunks)) if chunks else 0
    # A crude mapping: assume scores > 0.9 are very high confidence, 
    # adjust as needed for the specific model. We'll bound it between 50-99%
    confidence_pct = min(99, max(50, int(avg_score * 100)))

    async def event_generator():
        try:
            # Send sources and confidence first so frontend can display them immediately
            yield {
                "event": "sources",
                "data": json.dumps(sources),
            }
            yield {
                "event": "confidence",
                "data": json.dumps({"score": confidence_pct}),
            }

            # Stream LLM response token by token
            async for token in llm_service.generate_stream(request.question, context, request.chat_history):
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
