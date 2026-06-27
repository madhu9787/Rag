from groq import AsyncGroq
from typing import AsyncGenerator
from app.config import GROQ_API_KEY, GROQ_MODEL


SYSTEM_PROMPT = """You are a helpful assistant that answers questions based ONLY on the provided context from crawled web pages.

Rules:
1. Only use information from the CONTEXT below to answer the user's question.
2. If the context doesn't contain enough information to answer, say: "I don't have enough information from the crawled pages to answer this question."
3. Always cite your sources using [Source: URL] format at the end of relevant statements.
4. Be concise, specific, and well-structured in your responses.
5. If the question is ambiguous, provide the best answer from context and mention what might need clarification.
6. Use markdown formatting (bold, lists, code blocks) when appropriate for readability."""


class LLMService:
    """Groq-powered LLM service with streaming support.
    
    Uses Groq's ultra-fast inference (Llama 3.3 70B) for low-latency
    streaming responses. Groq typically delivers <200ms time-to-first-token.
    """

    def __init__(self):
        self._client = AsyncGroq(api_key=GROQ_API_KEY)

    async def generate_stream(
        self,
        question: str,
        context: str,
    ) -> AsyncGenerator[str, None]:
        """Stream LLM response tokens. Yields individual text chunks."""
        from typing import Any
        messages: list[Any] = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"CONTEXT:\n{context}\n\n---\n\nQUESTION: {question}",
            },
        ]

        stream = await self._client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            stream=True,
            temperature=0.1,
            max_tokens=2048,
        )

        async for chunk in stream:
            delta = chunk.choices[0].delta
            if delta.content:
                yield delta.content


# Singleton instance
llm_service = LLMService()
