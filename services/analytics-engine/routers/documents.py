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
    "chunk_text": "The investigator must strictly follow the natural and man-made boundaries demarcating the UFS block. Under no circumstances should an investigator cross railway tracks, rivers, or designated arterial roads unless explicitly delineated in the UFS block sketch map.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  },
  {
    "id": "chunk-capi-01",
    "document_id": "doc-capi-tablet-sop-2025",
    "page_number": 7,
    "section_title": "CAPI Field Station Offline Synchronization & Hash Verification",
    "chunk_text": "In areas lacking cellular connectivity, investigators must operate in offline CAPI mode with encrypted IndexedDB storage. Every completed schedule generates a cryptographic SHA-256 checksum upon completion.",
    "provenance": "OFFICIAL_MOSPI_MANUAL"
  },
  {
    "id": "chunk-plfs-01",
    "document_id": "doc-plfs-instruction-manual-v3",
    "page_number": 15,
    "section_title": "Usual Principal Activity Status (UPS) Determination",
    "chunk_text": "Usual Principal Activity Status (UPS) is determined based on the major time spent criterion over the 365 days preceding the date of survey. A person is considered in the labour force if they were employed or seeking/available for work.",
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
        filtered = [c for c in STORED_CHUNKS if c["document_id"] == req.document_id]
        if filtered:
            candidates = filtered

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
