from app.services.vector_store import vector_store, _EMBED_EXECUTOR
from app.config import TOP_K
from typing import Optional
import asyncio
from rank_bm25 import BM25Okapi
from flashrank import Ranker, RerankRequest

# Initialize FlashRank model (downloads to cache on first run)
# 'ms-marco-TinyBERT-L-2-v2' is extremely fast and lightweight
ranker = Ranker(model_name="ms-marco-TinyBERT-L-2-v2")

class Retriever:
    """Semantic search over stored chunks with context building for LLM."""

    def _hybrid_search_sync(self, question: str, top_k: int, where: Optional[dict]) -> list[dict]:
        """Runs Dense + Sparse search, combines, and reranks."""
        # 1. Dense Search (ChromaDB ONNX)
        dense_results = vector_store._collection.query(
            query_texts=[question],
            n_results=top_k * 2, # Get more for reranking
            where=where,
            include=["documents", "metadatas", "distances"]
        )

        dense_chunks = self._parse_results(dense_results)
        
        # 2. Sparse Search (BM25)
        sparse_chunks = []
        try:
            # Get all candidate documents to build BM25 index
            all_docs_results = vector_store._collection.get(
                where=where,
                include=["documents", "metadatas"]
            )
            
            if all_docs_results and all_docs_results["documents"]:
                docs = all_docs_results["documents"]
                metas = all_docs_results["metadatas"]
                
                # Tokenize for BM25
                tokenized_docs = [doc.lower().split() for doc in docs]
                bm25 = BM25Okapi(tokenized_docs)
                
                # Query BM25
                tokenized_query = question.lower().split()
                bm25_scores = bm25.get_scores(tokenized_query)
                
                # Get top K indices
                top_n_idx = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)[:top_k * 2]
                
                for idx in top_n_idx:
                    if bm25_scores[idx] > 0:
                        sparse_chunks.append({
                            "content": docs[idx],
                            "metadata": metas[idx] if metas else {},
                            "score": float(bm25_scores[idx])
                        })
        except Exception as e:
            print(f"[retriever] BM25 sparse search failed: {e}")

        # Combine unique chunks (deduplicate by content)
        combined_chunks = {}
        for chunk in dense_chunks + sparse_chunks:
            # Use content snippet as a crude deduplication key
            key = chunk["content"][:200]
            if key not in combined_chunks:
                combined_chunks[key] = chunk
                
        candidates = list(combined_chunks.values())
        
        # 3. Rerank using FlashRank
        if not candidates:
            return []

        # FlashRank expects a list of dicts with 'id' and 'text'
        passages = [
            {"id": i, "text": c["content"], "meta": c["metadata"]}
            for i, c in enumerate(candidates)
        ]
        
        rerank_request = RerankRequest(query=question, passages=passages)
        reranked_results = ranker.rerank(rerank_request)
        
        # Format back to our expected chunk structure and take top_k
        final_chunks = []
        for res in reranked_results[:top_k]:
            final_chunks.append({
                "content": res["text"],
                "metadata": res["meta"],
                "score": float(res["score"])
            })
            
        return final_chunks

    async def retrieve_async(
        self,
        question: str,
        top_k: Optional[int] = None,
        source_id: Optional[str] = None,
    ) -> list[dict]:
        """
        Find the most relevant chunks for a question (async, non-blocking).
        Uses thread-pool offloading for BM25 and FlashRank.
        Returns list of {"content", "metadata", "score"} dicts.
        """
        where = None
        if source_id:
            where = {"source_id": source_id}

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            _EMBED_EXECUTOR,
            self._hybrid_search_sync,
            question,
            top_k or TOP_K,
            where
        )

    def retrieve(
        self,
        question: str,
        top_k: Optional[int] = None,
        source_id: Optional[str] = None,
    ) -> list[dict]:
        """Sync fallback (only for non-async contexts)."""
        where = None
        if source_id:
            where = {"source_id": source_id}

        return self._hybrid_search_sync(question, top_k or TOP_K, where)

    def _parse_results(self, results) -> list[dict]:
        chunks = []
        if results and results.get("documents") and results["documents"] and results["documents"][0]:
            for i, doc in enumerate(results["documents"][0]):
                meta = results["metadatas"][0][i] if results.get("metadatas") and results["metadatas"] else {}
                distance = results["distances"][0][i] if results.get("distances") and results["distances"] else 0
                chunks.append({
                    "content": doc,
                    "metadata": meta,
                    "score": round(1 - distance, 4),  # cosine distance → similarity
                })
        return chunks

    def build_context(self, chunks: list[dict]) -> str:
        """Format retrieved chunks into a structured context string for the LLM."""
        context_parts = []
        for i, chunk in enumerate(chunks, 1):
            source_url = chunk["metadata"].get("page_url", "Unknown")
            page_title = chunk["metadata"].get("page_title", "Unknown")
            context_parts.append(
                f"[Source {i}: {page_title}]\n"
                f"URL: {source_url}\n"
                f"{chunk['content']}"
            )
        return "\n\n---\n\n".join(context_parts)


# Singleton instance
retriever = Retriever()
