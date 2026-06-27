from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import CHUNK_SIZE, CHUNK_OVERLAP
from typing import Optional


class TextChunker:
    """Splits text into semantically coherent chunks with overlap.
    
    Uses LangChain's RecursiveCharacterTextSplitter which respects
    paragraph → sentence → word boundaries (in that priority order).
    """

    def __init__(self, chunk_size: Optional[int] = None, chunk_overlap: Optional[int] = None):
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size or CHUNK_SIZE,
            chunk_overlap=chunk_overlap or CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", ", ", " ", ""],
            length_function=len,
        )

    def chunk_text(self, text: str, metadata: Optional[dict] = None) -> list[dict]:
        """Split text into chunks, each with attached metadata.

        Returns list of {"content": str, "metadata": dict}.
        """
        chunks = self._splitter.split_text(text)
        result = []
        for i, chunk in enumerate(chunks):
            chunk_meta = {
                **(metadata or {}),
                "chunk_index": i,
                "chunk_total": len(chunks),
            }
            result.append({
                "content": chunk,
                "metadata": chunk_meta,
            })
        return result


# Singleton instance
chunker = TextChunker()
