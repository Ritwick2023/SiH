from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from ml.irt_model import estimate_theta_mle, select_next_item, theta_to_level

router = APIRouter(prefix="/api/v1/assessment", tags=["Adaptive IRT Assessment"])

class AdministeredItem(BaseModel):
    item_id: str
    is_correct: bool
    irt_a: float = Field(default=1.0, ge=0.1, le=4.0)
    irt_b: float = Field(default=0.0, ge=-4.0, le=4.0)

class CandidateItem(BaseModel):
    id: str
    competency_id: str
    irt_a: float = Field(default=1.0, ge=0.1, le=4.0)
    irt_b: float = Field(default=0.0, ge=-4.0, le=4.0)

class NextQuestionRequest(BaseModel):
    candidate_items: List[CandidateItem]
    administered_items: List[AdministeredItem]
    current_theta: float = 0.0

class NextQuestionResponse(BaseModel):
    next_item_id: Optional[str]
    current_theta: float
    standard_error: float
    is_converged: bool
    estimated_level: str
    items_administered_count: int

class FinalizeRequest(BaseModel):
    administered_items: List[AdministeredItem]

class FinalizeResponse(BaseModel):
    theta: float
    standard_error: float
    level: str
    confidence_interval_95: List[float]
    accuracy_percent: float

@router.post("/next-question", response_model=NextQuestionResponse)
async def get_next_adaptive_question(payload: NextQuestionRequest):
    """
    Computes updated theta via 2PL MLE and selects the next item maximizing Fisher Information.
    """
    # 1. Prepare responses for theta estimation
    responses = [
        {
            "item_id": item.item_id,
            "is_correct": item.is_correct,
            "irt_a": item.irt_a,
            "irt_b": item.irt_b
        }
        for item in payload.administered_items
    ]

    theta, se = estimate_theta_mle(responses, initial_theta=payload.current_theta)
    level = theta_to_level(theta)

    # 2. Check stopping criteria: SE < 0.30 or >= 15 questions
    administered_ids = [item.item_id for item in payload.administered_items]
    is_converged = se < 0.30 or len(administered_ids) >= 15

    # 3. Select next best item
    candidate_dicts = [item.model_dump() for item in payload.candidate_items]
    next_item = select_next_item(candidate_dicts, administered_ids, theta)

    if next_item is None:
        is_converged = True

    return NextQuestionResponse(
        next_item_id=next_item["id"] if next_item and not is_converged else None,
        current_theta=theta,
        standard_error=se,
        is_converged=is_converged,
        estimated_level=level,
        items_administered_count=len(administered_ids)
    )

@router.post("/finalize", response_model=FinalizeResponse)
async def finalize_assessment(payload: FinalizeRequest):
    """
    Computes final ability score theta, standard error, 95% CI, and Karmayogi level.
    """
    responses = [
        {
            "item_id": item.item_id,
            "is_correct": item.is_correct,
            "irt_a": item.irt_a,
            "irt_b": item.irt_b
        }
        for item in payload.administered_items
    ]

    theta, se = estimate_theta_mle(responses)
    level = theta_to_level(theta)

    correct_count = sum(1 for r in responses if r["is_correct"])
    total_count = max(len(responses), 1)
    accuracy = round((correct_count / total_count) * 100.0, 1)

    ci_lower = round(theta - 1.96 * se, 3)
    ci_upper = round(theta + 1.96 * se, 3)

    return FinalizeResponse(
        theta=theta,
        standard_error=se,
        level=level,
        confidence_interval_95=[ci_lower, ci_upper],
        accuracy_percent=accuracy
    )
