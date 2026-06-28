# 1. Project Title
Nexus AI — RAG Intelligence System

## 2. Description
Nexus AI is a highly scalable, full-stack chatbot application that leverages Retrieval-Augmented Generation (RAG) to provide hyper-accurate answers based on web content. It recursively scrapes any provided website, processes the text into vector embeddings, and uses a powerful Large Language Model to converse with the user while citing exact sources.

## 3. Features
- **AI-Powered Website Ingestion**: Autonomously crawls, parses, and indexes any documentation, data source, or website into an intelligent vector knowledge base.
- **Deep AI Website Analysis**: Generates comprehensive executive summaries, knowledge gaps, and dynamically extracts suggested questions directly from indexed data.
- **Factual RAG with Source Citations**: Eliminates LLM hallucinations by restricting answers strictly to retrieved context, providing exact reference chips for user verification.
- **Real-Time Streaming Architecture**: Uses Server-Sent Events (SSE) to stream tokens back to the client with zero perceived latency, delivering a ChatGPT-like experience.
- **Confidence Scoring Metrics**: Each generated answer and retrieved chunk is evaluated for contextual confidence, ensuring transparency in the AI's reasoning.
- **High-Performance Asynchronous Backend**: Built on FastAPI and `lxml` for extreme I/O concurrency, allowing rapid parsing of hundreds of URLs simultaneously.
- **Premium Glassmorphism UI**: A fully responsive, meticulously crafted React frontend featuring subtle micro-animations (Framer Motion) and dynamic data visualizations.

## 4. Solution and Approach (Engineering Report)
*Architectural Analysis and System Design Justification*

**The Problem Statement:**
Modern enterprises struggle to extract actionable insights from their own unstructured data (websites, docs, wikis). Off-the-shelf LLMs hallucinate frequently and lack access to proprietary, real-time organizational knowledge. 

**Our Solution & Approach:**
To solve this, I designed a production-grade **Retrieval-Augmented Generation (RAG)** pipeline that dynamically grounds a foundational LLM (Llama-3.3-70b) in verifiable, user-provided context. 

As a Senior AI/ML Engineer, I approached this by decoupling the ingestion engine from the retrieval/inference engine to maximize throughput and scalability:
1. **Asynchronous I/O Scraping (httpx + lxml):** Rather than relying on heavy, blocking browser automation (like Selenium/Puppeteer), I implemented an async headless crawler. Using `lxml`—a highly optimized C-parser—drastically reduced parsing latency, allowing the system to ingest vast documentation trees in seconds rather than minutes.
2. **Deterministic Semantic Chunking:** I engineered the text-splitting logic to use sliding windows (1000 tokens, 200 overlap). This ensures semantic boundaries are preserved, preventing the loss of critical context that often plagues naive chunking algorithms. 
3. **Local Vectorization (ChromaDB + ONNX):** I opted for ChromaDB running locally with an ONNX-optimized embedding model. This eliminates network latency during the critical vectorization phase and significantly reduces API costs, making the architecture highly cost-effective and secure. 
4. **Context-Restricted LLM Inference:** During retrieval, a strict system prompt forces the LLM to synthesize answers *only* from the top-K retrieved vectors. If the answer isn't in the context, it gracefully degrades rather than hallucinating. 

**Why this is the perfect architecture:** 
This approach strikes the optimal balance between latency, accuracy, and operational cost. By pushing the heavy lifting to asynchronous background tasks and local vector indexing, the frontend remains buttery smooth. Furthermore, utilizing Server-Sent Events (SSE) ensures a real-time conversational UX, completely masking the inherent latency of large language model generation.

## 5. Detailed Tech Stack
- **React**: Used to build a dynamic, component-based user interface.
- **Vite**: Used as the lightning-fast build tool and development server for the frontend.
- **Framer Motion**: Used to create smooth, professional micro-interactions and page transitions.
- **Lucide React**: Used for beautiful, consistent iconography across the application.
- **FastAPI**: Used to build a robust, high-performance asynchronous backend API.
- **Uvicorn**: Used as the lightning-fast ASGI server to run the FastAPI backend.
- **Python (3.11+)**: Used as the core backend programming language for its rich AI ecosystem.
- **Groq (Llama-3.3-70b-versatile)**: Used as the core LLM engine for ultra-fast, high-quality text generation and website analysis.
- **ChromaDB**: Used as the local vector database to store and query text embeddings efficiently.
- **Sentence-Transformers (ONNX)**: Used built-in with ChromaDB to convert raw text chunks into mathematical vectors.
- **httpx, BeautifulSoup4 & lxml**: Used for ultra-fast, asynchronous, headless web scraping and high-performance HTML parsing without heavy browser overhead.

## 6. Links
- **Live Deployment:** [https://rag-woad.vercel.app/](https://rag-woad.vercel.app/)
- **Demo Video:** *(Link will be added here)*

## 7. Setup / Usage Instructions

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` folder with your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
CHROMA_PERSIST_DIR=./chroma_data
MAX_CRAWL_DEPTH=2
MAX_PAGES=50
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K=5
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://rag-woad.vercel.app
```
Start the backend server:
```bash
uvicorn app.main:app --port 8000
```

### Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

## 8. Dependencies and Prerequisites
- **Node.js**: v18 or higher (for the frontend environment)
- **Python**: v3.11 or higher (for backend and AI operations)
- **Git**: For version control
- **Groq API Key**: Required for the LLM text generation

## 9. Step-by-Step Usage
1. Open the deployed application (or `http://localhost:5173` locally).
2. Click **"Open Dashboard"** from the landing page.
3. Navigate to the **"Knowledge Base"** tab.
4. Enter the URL of any website you wish to index and click ingest.
5. Wait a few moments as the system recursively crawls the site and generates embeddings.
6. Once completed, type your question into the chat interface.
7. Read the AI's response and click on the generated citation chips to verify the exact source page.

## 10. Architecture Diagram
```mermaid
flowchart TB
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    classDef data fill:#8b5cf6,stroke:#5b21b6,stroke-width:2px,color:#fff
    classDef ai fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff

    subgraph Client [Client Tier (React)]
        A[React UI Component]:::frontend
        B[SSE Event Listener]:::frontend
    end

    subgraph API [API Tier (FastAPI)]
        C[Ingestion Router]:::backend
        D[Chat Router / Context Builder]:::backend
    end

    subgraph Workers [Async Worker Tier]
        E[Web Crawler & Scraper]:::backend
        F[Text Chunker & Cleaner]:::backend
    end

    subgraph Data [Data Tier]
        G[(ChromaDB Vector Store)]:::data
        H[ONNX Embedding Model]:::data
    end

    subgraph External [External AI Services]
        I{Groq Llama-3 API}:::ai
    end

    A -->|Submit URL| C
    C -->|Dispatch Task| E
    E -->|Raw HTML| F
    F -->|Chunks| H
    H -->|Vectors| G
    
    A -->|User Query| D
    D -->|Query Vector| G
    G -->|Top-K Context| D
    D -->|Strict Prompt + Context| I
    I -->|Streamed Tokens| D
    D -->|SSE Stream| B
```

## 11. Explanation of Architecture
The platform implements a modern, decoupled **Model-View-Controller (MVC)** and **Micro-services** inspired architecture:
- **Client Tier (View):** Built entirely in React, it handles complex state management and renders the UI. It uses unidirectional data flow to capture user queries and relies on an SSE (Server-Sent Events) listener to parse and render real-time markdown streams from the LLM.
- **API Tier (Controller):** FastAPI serves as the high-throughput ingress point. It routes incoming requests either to the asynchronous ingestion pipeline or the retrieval-augmented chat logic.
- **Worker Tier (Business Logic):** Highly concurrent Python routines handle the I/O-bound web scraping (`httpx` + `lxml`) and CPU-bound text chunking/normalization algorithms. 
- **Data Tier (Model):** A localized ChromaDB vector store coupled with an ONNX embedding pipeline ensures lightning-fast semantic similarity search (Cosine Distance) without the overhead of external database calls.
- **External AI Tier:** Groq's specialized inference hardware executes the foundational Llama-3 model, generating the final synthesis based on our injected context.

## 12. Output Images / Screenshots

### Landing Page
![Landing Page](output/home.png)

### About Page
![About Page](output/about.png)

### Real Usage
![Real Usage](output/realusage.png)

### How and Features
![How and Features](output/howandfeatures.png)

### Timeline
![Timeline](output/timeline.png)

### Dashboard
![Dashboard](output/dashboard.png)

### Working
![Working](output/working.png)

### AI Analysis Report
![AI Analysis Report](output/Analyzereport.png)

### Analytics
![Analytics](output/analytics.png)

## 13. Future Enhancements
- **Multi-modal Support:** Allow users to upload PDFs, Word documents, and images directly into the knowledge base, alongside URLs.
- **Advanced Authentication:** Implement user accounts and OAuth to allow multiple users to maintain their own isolated vector databases and chat histories.
- **Cloud Vector Database:** Migrate from local ChromaDB to a managed cloud database like Pinecone or Weaviate to enable stateless backend deployments on platforms like Vercel or AWS Lambda.

## 14. Conclusion
Nexus AI successfully demonstrates how modern AI models and vector databases can be integrated into a sleek, performant web application. By utilizing an asynchronous Python backend, a blazingly fast LLM via Groq, and a responsive React frontend, this project delivers a highly functional RAG system capable of turning any unstructured website into an interactive, trustworthy knowledge source.
