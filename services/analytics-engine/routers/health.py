from fastapi import APIRouter
from config import settings

router = APIRouter(tags=["Health & Status"])

@router.get("/health")
async def health_check():
    """
    Returns platform health, version, and capability status.
    """
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "capabilities": {
            "irt_adaptive_engine": "active",
            "lightgbm_correlation": "active",
            "bayesian_gap_scoring": "active",
            "pgvector_rag": "ready",
            "celery_async_queue": "ready"
        }
    }
