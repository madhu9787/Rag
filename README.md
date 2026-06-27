# RAGBot — URL-Based RAG Chatbot

A scalable, full-stack chatbot that recursively scrapes websites and uses Retrieval-Augmented Generation (RAG) to answer questions based on the ingested content.

Built with:
- **Frontend**: React, Tailwind CSS v3, Vite
- **Backend**: FastAPI, Python 3.11+
- **LLM**: Groq (Llama-3.3-70b-versatile)
- **Vector Store**: ChromaDB (with built-in ONNX embeddings)
- **Crawler**: Async httpx + BeautifulSoup (headless browser-free for easy deployment)

## Features
- **Async Recursive Crawling**: Follows links on the same domain up to a configured depth.
- **Real-time Progress**: View ingestion status and pages crawled in real-time.
- **Streaming Responses**: Ultra-fast LLM responses streamed token-by-token via Server-Sent Events (SSE).
- **Source Citations**: Answers include clickable chips linking back to the exact source pages.
- **Source Management**: Filter chat by specific sources, or delete sources you no longer need.
- **Dark Premium UI**: Glassmorphism and modern gradient design.

## Quickstart

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Ensure your `.env` file has your Groq API key:
```env
GROQ_API_KEY=gsk_...
```

Run the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

This architecture is designed to be easily deployable on platforms like Render or Vercel:
- **Backend**: Can be deployed as a standard web service on Render (no Docker required since we removed the Playwright dependency).
- **Frontend**: Can be deployed on Vercel as a standard Vite React app.
- **Storage**: ChromaDB creates a local SQLite/Parquet directory (`./chroma_data`). If deploying to a serverless environment, consider using Qdrant Cloud or Pinecone, or attach a persistent disk.
