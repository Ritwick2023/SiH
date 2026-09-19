import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from ml.recommendation_engine import rank_courses

def test_rank_courses_priority_and_gating():
    gaps = [
        {
            "competency_id": "comp-demarcation",
            "competency_title": "Boundary Demarcation",
            "gap": 3.0,
            "priority": "critical",
            "evidence_type": "IRT-verified"
        }
    ]
    catalog = [
        {"id": "course-1", "competency_id": "comp-demarcation", "tier": "FOUNDATIONAL", "semantic_relevance": 0.9},
        {"id": "course-2", "competency_id": "comp-other", "tier": "CAPSTONE", "semantic_relevance": 0.7},
    ]

    ranked = rank_courses("FOD", gaps, catalog)
    assert len(ranked) == 2
    assert ranked[0]["id"] == "course-1"
    assert ranked[0]["recommendation_score"] > ranked[1]["recommendation_score"]
    assert "Boundary Demarcation" in ranked[0]["explainability"]

@pytest.mark.asyncio
async def test_recommendations_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "user_cadre": "FOD",
            "user_gaps": [
                {"competency_id": "comp-capi", "gap": 2.0, "priority": "critical"}
            ],
            "catalog": [
                {"id": "c1", "competency_id": "comp-capi", "tier": "APPLIED"},
                {"id": "c2", "competency_id": "comp-unrelated", "tier": "CAPSTONE"}
            ]
        }
        res = await client.post("/api/v1/recommendations/rank", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert len(data["ranked_courses"]) == 2
        assert data["ranked_courses"][0]["id"] == "c1"
