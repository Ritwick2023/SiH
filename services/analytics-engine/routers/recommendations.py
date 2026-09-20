from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from ml.recommendation_engine import rank_courses

router = APIRouter(prefix="/api/v1/recommendations", tags=["Course Recommendations"])

class RankRequest(BaseModel):
    user_cadre: str = "FOD"
    user_gaps: List[Dict[str, Any]]
    catalog: List[Dict[str, Any]]

class RankResponse(BaseModel):
    ranked_courses: List[Dict[str, Any]]
    algorithm: str = "MULTI_SIGNAL_LIGHTGBM_COLLAB"

@router.post("/rank", response_model=RankResponse)
async def rank_courses_endpoint(payload: RankRequest):
    """
    Ranks official Karmayogi / NSSTA learning courses using multi-signal scoring.
    """
    ranked = rank_courses(
        user_cadre=payload.user_cadre,
        user_gaps=payload.user_gaps,
        catalog=payload.catalog
    )
    return RankResponse(
        ranked_courses=ranked,
        algorithm="MULTI_SIGNAL_LIGHTGBM_COLLAB"
    )
