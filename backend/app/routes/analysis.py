from fastapi import APIRouter, HTTPException
import json
from app.models import WebsiteAnalysisResponse
from app.services.vector_store import vector_store
from app.services.llm import GROQ_MODEL, GROQ_API_KEY
from groq import AsyncGroq
import random

router = APIRouter(prefix="/api/analyze", tags=["analysis"])
client = AsyncGroq(api_key=GROQ_API_KEY)

ANALYSIS_PROMPT = """You are an expert AI Website Intelligence Analyst.
Analyze the provided text chunks (which represent a sampled subset of a website) and generate a comprehensive website intelligence report.

Return ONLY a valid JSON object matching this schema exactly, with NO markdown formatting, NO backticks, and NO other text:
{
    "executive_summary": "A 2-3 sentence overview of what this website is and its primary purpose.",
    "main_topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
    "missing_information": ["Gap 1", "Gap 2", "Gap 3"],
    "target_audience": "Who this website is for (e.g., 'Beginner Developers', 'Enterprise Customers')",
    "suggested_questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
    "coverage_score": 92
}

- missing_information should list what topics are poorly covered or entirely missing that one would expect to find on this type of site.
- coverage_score should be an integer between 1 and 100 representing how comprehensive the content seems for its domain.
- suggested_questions must be exactly 5 questions that a user might want to ask the chatbot about this website.

CONTEXT:
"""

@router.get("/{source_id}", response_model=WebsiteAnalysisResponse)
async def analyze_website(source_id: str):
    # Fetch all chunks for this source
    results = vector_store._collection.get(
        where={"source_id": source_id},
        include=["documents"]
    )
    
    if not results or not results["documents"]:
        raise HTTPException(status_code=404, detail="No content found for this source.")
        
    docs = results["documents"]
    
    # We can't send the entire website to the LLM (context limit).
    # We will sample up to 10 random chunks to get a representative feel of the site.
    sample_size = min(10, len(docs))
    sampled_docs = random.sample(docs, sample_size)
    context = "\n\n---\n\n".join(sampled_docs)
    
    try:
        response = await client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": ANALYSIS_PROMPT},
                {"role": "user", "content": context}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1024,
        )
        
        content = response.choices[0].message.content
        if not content:
             raise ValueError("Empty response from LLM")
             
        data = json.loads(content)
        return WebsiteAnalysisResponse(**data)
        
    except Exception as e:
        print(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze website.")
