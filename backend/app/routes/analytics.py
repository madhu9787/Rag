from fastapi import APIRouter
from app.services.analytics import analytics_service

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/usage")
async def get_usage():
    """Get aggregated query counts for the last 7 days."""
    data = analytics_service.get_last_7_days()
    return {"usage": data}
