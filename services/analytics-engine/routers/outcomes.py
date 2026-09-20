from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from ml.outcome_attributor import outcome_attributor

router = APIRouter(prefix="/api/v1/outcomes", tags=["Outcome Attribution"])

class LogEventRequest(BaseModel):
    official_id: str
    event_type: str  # "assessment_completed", "course_completed", etc.
    course_id: Optional[str] = None
    competency_id: Optional[str] = None
    theta_before: Optional[float] = None
    theta_after: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None

class AttributionItem(BaseModel):
    course_id: str
    avg_delta_theta: float
    sample_size: int
    avg_days_to_improvement: float
    confidence: str

@router.post("/log-event")
async def log_outcome_event(payload: LogEventRequest):
    """
    Logs an assessment completion or course completion outcome event.
    """
    event = outcome_attributor.log_event(
        official_id=payload.official_id,
        event_type=payload.event_type,
        course_id=payload.course_id,
        competency_id=payload.competency_id,
        theta_before=payload.theta_before,
        theta_after=payload.theta_after,
        metadata=payload.metadata
    )
    return {"status": "logged", "event": event}

@router.get("/attribution", response_model=List[AttributionItem])
async def get_attribution_leaderboard():
    """
    Returns course effectiveness leaderboard based on average delta_theta gains.
    """
    return outcome_attributor.get_attribution_leaderboard()
