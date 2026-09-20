from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import math

router = APIRouter(prefix="/api/v1/analytics", tags=["Statistical Analytics & Gap Scoring"])

class GapScoreRequest(BaseModel):
    current_level: float
    target_level: float
    priority: str = Field(default="important")  # "critical", "important", "desirable"
    evidence_type: str = Field(default="SELF_REPORTED")  # "IRT_VERIFIED", "SELF_REPORTED", "NEVER_ASSESSED"
    days_since_assessment: int = Field(default=0, ge=0)

class GapScoreResponse(BaseModel):
    raw_gap: float
    weighted_gap_score: float
    evidence_weight: float
    decay_factor: float
    priority_multiplier: int
    severity_bucket: str

PRIORITY_WEIGHTS = {
    "critical": 3,
    "important": 2,
    "desirable": 1
}

def calculate_evidence_weight(evidence_type: str, days_since: int) -> float:
    ev = evidence_type.upper()
    if "IRT" in ev or "VERIFIED" in ev:
        if days_since < 30:
            base = 1.00
        elif days_since <= 90:
            base = 0.85
        else:
            base = 0.65
    elif "SELF" in ev:
        base = 0.50
    else:
        base = 0.30

    lambda_decay = 0.35
    decay = math.exp(-lambda_decay * (days_since / 180.0))
    return round(base * decay, 4), round(decay, 4)

@router.post("/gap-score", response_model=GapScoreResponse)
async def compute_bayesian_gap_score(payload: GapScoreRequest):
    """
    Computes Bayesian Evidence-Weighted Competency Gap Score with Half-Life Time Decay.
    WeightedGapScore = max(0, target - theta) * W_priority * W_evidence * delta_decay
    """
    raw_gap = max(0.0, payload.target_level - payload.current_level)
    p_mult = PRIORITY_WEIGHTS.get(payload.priority.lower(), 2)
    ev_weight, decay = calculate_evidence_weight(payload.evidence_type, payload.days_since_assessment)

    weighted_score = round(raw_gap * p_mult * ev_weight, 3)

    if weighted_score >= 3.5:
        bucket = "HIGH"
    elif weighted_score >= 1.5:
        bucket = "MODERATE"
    else:
        bucket = "PROFICIENT"

    return GapScoreResponse(
        raw_gap=round(raw_gap, 2),
        weighted_gap_score=weighted_score,
        evidence_weight=ev_weight,
        decay_factor=decay,
        priority_multiplier=p_mult,
        severity_bucket=bucket
    )

from ml.regression import compute_scrutiny_correlation

class ScrutinyRecord(BaseModel):
    competency_level: float
    error_rate_percent: float

class CorrelateRequest(BaseModel):
    records: Optional[List[ScrutinyRecord]] = None

@router.post("/correlate-scrutiny")
async def correlate_scrutiny_endpoint(payload: CorrelateRequest):
    """
    Computes live linear regression between officer competency levels and field scrutiny error rates.
    """
    record_dicts = [r.model_dump() for r in payload.records] if payload.records else None
    return compute_scrutiny_correlation(record_dicts)
