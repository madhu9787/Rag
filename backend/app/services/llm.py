from groq import AsyncGroq
from typing import AsyncGenerator
from app.config import GROQ_API_KEY, GROQ_MODEL


SYSTEM_PROMPT = """You are a helpful assistant that answers questions based ONLY on the provided context from crawled web pages.

Rules:
1. Only use information from the CONTEXT below to answer the user's question.
2. If the context doesn't contain enough information to answer, say: "I don't have enough information from the crawled pages to answer this question."
3. Always cite your sources using [Source: URL] format at the end of relevant statements.
4. Be EXTREMELY concise and direct. Do not use filler words, conversational filler, or long introductions. Get straight to the point to minimize response time.
5. If the question is ambiguous, provide the best answer from context and mention what might need clarification.
6. Use markdown formatting (bold, lists, code blocks) when appropriate for readability.
7. ALWAYS conclude your response with a "### You might also ask:" section containing exactly 3 suggested follow-up questions that the user could ask based on the context."""


class LLMService:
    """Groq-powered LLM service with streaming support.
    
    Uses Groq's ultra-fast inference (Llama 3.3 70B) for low-latency
    streaming responses. Groq typically delivers <200ms time-to-first-token.
    """

    def __init__(self):
        self._client = AsyncGroq(api_key=GROQ_API_KEY)

    async def rewrite_query(self, question: str, history: list[dict]) -> str:
        """Rewrite ambiguous queries based on chat history to be standalone."""
        if not history:
            return question
            
        system_msg = (
            "Given a chat history and the latest user question which might reference context "
            "in the chat history, formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, just reformulate it if needed "
            "and otherwise return it as is. Reply ONLY with the standalone question."
        )
        
        # Format history into a readable string to avoid deep nested message objects
        # We just send a simple prompt with the last few turns
        history_text = ""
        for msg in history[-4:]: # Only care about recent context
            role = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role}: {msg['content']}\n"
            
        prompt = f"Chat History:\n{history_text}\nLatest Question: {question}\n\nStandalone Question:"
        
        try:
            response = await self._client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=128,
            )
            content = response.choices[0].message.content
            return content.strip() if content else question
        except Exception as e:
            print(f"Error rewriting query: {e}")
            return question

    async def generate_stream(
        self,
        question: str,
        context: str,
        history: list[dict] | None = None,
    ) -> AsyncGenerator[str, None]:
        """Stream LLM response tokens. Yields individual text chunks."""
        from typing import Any
        messages: list[Any] = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        if history:
            # Add recent history (up to 4 messages to prevent context overflow)
            for msg in history[-4:]:
                messages.append({"role": msg["role"], "content": msg["content"]})
                
        messages.append({
            "role": "user",
            "content": f"CONTEXT:\n{context}\n\n---\n\nQUESTION: {question}",
        })

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
