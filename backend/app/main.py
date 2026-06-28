from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.routes import ingest, chat, sources, analytics, analysis
import asyncio


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    On startup: pre-warm the ChromaDB ONNX embedding model in a background thread.
    This downloads the model (first run) and initializes the ONNX runtime so the
    first user request is instant instead of hanging for minutes.
    """
    asyncio.create_task(_warmup_embeddings())
    yield


async def _warmup_embeddings():
    """Run a dummy ChromaDB query to fully initialize the ONNX runtime."""
    try:
        from app.services.vector_store import vector_store, _EMBED_EXECUTOR
        import concurrent.futures

        loop = asyncio.get_event_loop()

        def _do_warmup():
            try:
                print("[startup] Warming up ONNX embedding model...")
                # query_texts triggers model download + ONNX init
                vector_store._collection.query(
                    query_texts=["initialization warmup"],
                    n_results=1,
                )
                print("[startup] ONNX embedding model ready ✓")
            except Exception as e:
                # Collection might be empty — that's fine, model is still warmed up
                print(f"[startup] Warmup note (expected if empty): {e}")

        await loop.run_in_executor(_EMBED_EXECUTOR, _do_warmup)
    except Exception as e:
        print(f"[startup] Warmup failed (non-critical): {e}")


app = FastAPI(
    title="RAG Chatbot API",
    description="URL-based RAG chatbot with recursive web crawling and Groq LLM",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(chat.router)
app.include_router(sources.router)
app.include_router(analytics.router)
app.include_router(analysis.router)


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}
