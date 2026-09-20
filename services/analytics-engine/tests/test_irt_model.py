import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from ml.irt_model import (
    item_response_probability,
    fisher_information,
    estimate_theta_mle,
    select_next_item,
    theta_to_level
)

def test_irt_probability_monotonicity():
    """Higher ability should monotonically increase probability of correct response."""
    p_low = item_response_probability(theta=-1.0, a=1.2, b=0.0)
    p_med = item_response_probability(theta=0.0, a=1.2, b=0.0)
    p_high = item_response_probability(theta=1.0, a=1.2, b=0.0)

    assert p_low < p_med < p_high
    assert abs(p_med - 0.5) < 1e-4  # At theta = b, P = 0.5

def test_fisher_information_peak():
    """Fisher information peaks at theta = b for 2PL model."""
    info_at_b = fisher_information(theta=0.0, a=1.5, b=0.0)
    info_below = fisher_information(theta=-1.0, a=1.5, b=0.0)
    info_above = fisher_information(theta=1.0, a=1.5, b=0.0)

    assert info_at_b > info_below
    assert info_at_b > info_above

def test_theta_to_level_mapping():
    assert theta_to_level(-2.5) == "L1"
    assert theta_to_level(-1.0) == "L2"
    assert theta_to_level(0.2) == "L3"
    assert theta_to_level(1.5) == "L4"
    assert theta_to_level(2.8) == "L5"

def test_mle_estimation():
    responses = [
        {"item_id": "q1", "is_correct": True, "irt_a": 1.2, "irt_b": -0.5},
        {"item_id": "q2", "is_correct": True, "irt_a": 1.4, "irt_b": 0.2},
        {"item_id": "q3", "is_correct": False, "irt_a": 1.5, "irt_b": 1.5},
    ]
    theta, se = estimate_theta_mle(responses, initial_theta=0.0)
    # Learner got -0.5 and 0.2 right, but failed 1.5. Theta should be between ~0.2 and ~1.5
    assert -0.5 < theta < 1.5
    assert se > 0

@pytest.mark.asyncio
async def test_api_next_question_and_finalize():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Next question request
        payload = {
            "candidate_items": [
                {"id": "q1", "competency_id": "comp-demarcation", "irt_a": 1.2, "irt_b": -1.0},
                {"id": "q2", "competency_id": "comp-demarcation", "irt_a": 1.5, "irt_b": 0.0},
                {"id": "q3", "competency_id": "comp-demarcation", "irt_a": 1.8, "irt_b": 1.0}
            ],
            "administered_items": [
                {"item_id": "q1", "is_correct": True, "irt_a": 1.2, "irt_b": -1.0}
            ],
            "current_theta": -1.0
        }
        resp = await client.post("/api/v1/assessment/next-question", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "next_item_id" in data
        assert data["next_item_id"] in ["q2", "q3"]
        assert "current_theta" in data

        # 2. Finalize request
        finalize_payload = {
            "administered_items": [
                {"item_id": "q1", "is_correct": True, "irt_a": 1.2, "irt_b": -1.0},
                {"item_id": "q2", "is_correct": True, "irt_a": 1.5, "irt_b": 0.0},
                {"item_id": "q3", "is_correct": True, "irt_a": 1.8, "irt_b": 1.0}
            ]
        }
        fin_resp = await client.post("/api/v1/assessment/finalize", json=finalize_payload)
        assert fin_resp.status_code == 200
        fin_data = fin_resp.json()
        assert fin_data["accuracy_percent"] == 100.0
        assert fin_data["level"] in ["L4", "L5"]
