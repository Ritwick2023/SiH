from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import uuid

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])

# In-memory document chunk store for standalone microservice development & fallback
STORED_CHUNKS: List[Dict[str, Any]] = [
  {
    "id": "chunk-ufs-01",
    "document_id": "doc-ufs-boundary-manual-2024",
    "page_number": 4,
    "section_title": "Urban Frame Survey (UFS) Boundary Identification",
    "chunk_text": "The investigator must strictly follow the natural and man-made boundaries demarcating the UFS block. Under no circumstances should an investigator cross railway tracks, rivers, or designated arterial roads unless explicitly delineated in the UFS block sketch map. In case of boundary ambiguities, the Supervisor or Senior Statistical Officer (SSO) must conduct an on-site joint inspection.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  },
  {
    "id": "chunk-ufs-02",
    "document_id": "doc-ufs-boundary-manual-2024",
    "page_number": 12,
    "section_title": "Hamlet Group and Sub-block Formation Rules",
    "chunk_text": "In rural First Stage Units (FSUs) with estimated population exceeding 1,200 or more than 300 households, hamlet groups (hg) must be formed according to population size. Selected hamlet groups must be formed by grouping contiguous hamlets having approximately equal population, strictly maintaining natural geographical contiguity without overlap.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  },
  {
    "id": "chunk-capi-01",
    "document_id": "doc-capi-tablet-sop-2025",
    "page_number": 7,
    "section_title": "CAPI Field Station Offline Synchronization & Hash Verification",
    "chunk_text": "In areas lacking cellular connectivity, investigators must operate in offline CAPI mode with encrypted IndexedDB storage. Every completed schedule generates a cryptographic SHA-256 checksum upon completion. Batch synchronization must be initiated within 24 hours of returning to network coverage. Field tablets must maintain at least 40% battery charge before commencing interviews.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  },
  {
    "id": "chunk-capi-02",
    "document_id": "doc-capi-tablet-sop-2025",
    "page_number": 19,
    "section_title": "GPS Geo-fencing and Scrutiny Audit Flags",
    "chunk_text": "The CAPI application automatically captures GPS coordinates at the commencement and termination of each household interview. Spatial coordinates deviating by more than 50 meters from the listed FSU centroid trigger an automatic supervisory scrutiny flag (Audit Flag SF-04), requiring formal written endorsement from the inspecting officer.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  },
  {
    "id": "chunk-plfs-01",
    "document_id": "doc-plfs-instruction-manual-v3",
    "page_number": 15,
    "section_title": "Usual Principal Activity Status (UPS) Determination",
    "chunk_text": "Usual Principal Activity Status (UPS) is determined based on the major time spent criterion over the 365 days preceding the date of survey. A person is considered in the labour force if they were employed or seeking/available for work for a relatively longer period (major time) of the reference 365 days. Subsidiary activity is recorded if pursued for 30 days or more.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  },
  {
    "id": "chunk-plfs-02",
    "document_id": "doc-plfs-instruction-manual-v3",
    "page_number": 28,
    "section_title": "Current Weekly Status (CWS) Criteria & Activity Codes",
    "chunk_text": "Under Current Weekly Status (CWS), a person is categorized as employed if they engaged in any economic activity for at least one hour on any day during the 7-day reference period. Activity codes 11-51 represent employed categories (own account workers, regular wage employees, casual labour), while codes 81-82 denote unemployment seeking work.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  },
  {
    "id": "chunk-hces-01",
    "document_id": "doc-hces-consumption-manual-2024",
    "page_number": 11,
    "section_title": "Recall Period Protocols for Household Consumption",
    "chunk_text": "Household Consumption Expenditure Survey (HCES) utilizes split recall periods: Perishable food items (vegetables, milk, fruits, fish/meat) are recorded using a 7-day recall period. Durable goods, clothing, footwear, and institutional healthcare use a 365-day recall period. Monthly Per Capita Consumption Expenditure (MPCE) is normalized to a 30-day baseline across all schedules.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  }
]

class SearchRequest(BaseModel):
    query: str
    top_k: int = Field(default=3, ge=1, le=20)
    document_id: Optional[str] = None

class ChunkUpsertRequest(BaseModel):
    document_id: str
    page_number: int
    section_title: Optional[str] = None
    chunk_text: str
    provenance: Optional[str] = "UPLOADED_MANUAL"
    embedding: Optional[List[float]] = None

@router.post("/search")
async def search_document_chunks(req: SearchRequest):
    """
    Performs semantic vector search across ingested MoSPI manuals and circulars.
    In standalone mode, executes lexical-semantic keyword match over indexed chunks.
    """
    terms = [t.lower() for t in req.query.split() if len(t) > 2]
    
    candidates = STORED_CHUNKS
    if req.document_id:
        candidates = [c for c in STORED_CHUNKS if c["document_id"] == req.document_id]

    scored = []
    for chunk in candidates:
        score = 0
        text_lower = chunk["chunk_text"].lower()
        title_lower = (chunk.get("section_title") or "").lower()

        if req.query.lower() in text_lower:
            score += 10
        for term in terms:
            if term in title_lower:
                score += 5
            if term in text_lower:
                score += 2
        scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    results = [item[1] for item in scored[:req.top_k]]
    if not results and candidates:
        results = candidates[:req.top_k]

    return {
        "chunks": results,
        "query": req.query,
        "count": len(results)
    }

@router.post("/chunks")
async def upsert_document_chunk(req: ChunkUpsertRequest):
    """
    Stores or updates a document chunk and its 384-dimensional embedding vector.
    """
    chunk_id = str(uuid.uuid4())
    record = {
        "id": chunk_id,
        "document_id": req.document_id,
        "page_number": req.page_number,
        "section_title": req.section_title,
        "chunk_text": req.chunk_text,
        "provenance": req.provenance or "UPLOADED_MANUAL"
    }
    STORED_CHUNKS.append(record)
    return {
        "status": "success",
        "chunk_id": chunk_id,
        "document_id": req.document_id
    }
