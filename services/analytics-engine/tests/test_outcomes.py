import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

@pytest.mark.asyncio
async def test_outcome_logging_and_attribution():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Log an event
        payload = {
            "official_id": "user-test-1",
            "event_type": "assessment_completed",
            "course_id": "course-capi-101",
            "competency_id": "comp-capi",
            "theta_before": 0.5,
            "theta_after": 1.8,
            "metadata": {"days": 25}
        }
        res = await client.post("/api/v1/outcomes/log-event", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "logged"
        assert data["event"]["delta_theta"] == 1.3

        # 2. Query leaderboard
        lead_res = await client.get("/api/v1/outcomes/attribution")
        assert lead_res.status_code == 200
        leaderboard = lead_res.json()
        assert len(leaderboard) > 0
        assert any(item["course_id"] == "course-capi-101" for item in leaderboard)
