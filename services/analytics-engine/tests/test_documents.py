import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_search_document_chunks():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/documents/search", json={
            "query": "UFS boundary demarcating",
            "top_k": 2
        })
    assert response.status_code == 200
    data = response.json()
    assert "chunks" in data
    assert len(data["chunks"]) >= 1
    chunk_text_lower = data["chunks"][0]["chunk_text"].lower()
    assert "ufs" in chunk_text_lower and "boundar" in chunk_text_lower

@pytest.mark.asyncio
async def test_upsert_document_chunk():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/v1/documents/chunks", json={
            "document_id": "doc-py-test",
            "page_number": 3,
            "section_title": "Automated Testing Section",
            "chunk_text": "Validation text for automated unit test in Python.",
            "provenance": "TEST_PIPELINE"
        })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "chunk_id" in data
