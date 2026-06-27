import os
from dotenv import load_dotenv

load_dotenv()

# Groq API
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# ChromaDB
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "rag_chunks")

# Crawler
MAX_CRAWL_DEPTH = int(os.getenv("MAX_CRAWL_DEPTH", "2"))
MAX_PAGES = int(os.getenv("MAX_PAGES", "100"))
CRAWL_CONCURRENCY = int(os.getenv("CRAWL_CONCURRENCY", "50"))
CRAWL_TIMEOUT = int(os.getenv("CRAWL_TIMEOUT", "15"))

# Chunking
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "2000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# Retrieval
TOP_K = int(os.getenv("TOP_K", "5"))

# Server
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
