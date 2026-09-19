import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

@pytest.mark.asyncio
async def test_gap_score_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "current_level": 2.0,
            "target_level": 4.0,
            "priority": "critical",
            "evidence_type": "IRT_VERIFIED",
            "days_since_assessment": 5
        }
        response = await client.post("/api/v1/analytics/gap-score", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["raw_gap"] == 2.0
        assert data["priority_multiplier"] == 3
        assert data["evidence_weight"] > 0.95
        assert data["severity_bucket"] == "HIGH"

@pytest.mark.asyncio
async def test_correlate_scrutiny_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Default bootstrap test
        resp = await client.post("/api/v1/analytics/correlate-scrutiny", json={})
        assert resp.status_code == 200
        data = resp.json()
        assert data["provenance"] == "EMPIRICAL_NSS78_BOOTSTRAP"
        assert data["slope"] < 0
        assert data["r_squared"] > 0.8
        assert data["statistically_significant"] is True

        # Live records test (10 records)
        records = [
            {"competency_level": i * 0.4, "error_rate_percent": 25.0 - i * 1.8}
            for i in range(1, 11)
        ]
        live_resp = await client.post("/api/v1/analytics/correlate-scrutiny", json={"records": records})
        assert live_resp.status_code == 200
        live_data = live_resp.json()
        assert live_data["provenance"] == "LIVE_OLS_REGRESSION"
        assert live_data["slope"] < 0
        assert live_data["sample_size"] == 10
