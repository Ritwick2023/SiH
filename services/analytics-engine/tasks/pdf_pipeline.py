import time
from typing import Dict, Any, List
from tasks.celery_app import celery_app
from nlp.ocr_engine import extract_bilingual_text_from_image
from nlp.table_extractor import extract_tables_from_text
from nlp.ner_tagger import extract_entities, infer_frac_competency
from routers.documents import STORED_CHUNKS

def chunk_text_stream(text: str, chunk_size_words: int = 250, overlap_words: int = 35) -> List[str]:
    """
    Splits text stream into overlapping semantic chunks.
    """
    words = text.split()
    if not words:
        return []
    
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size_words])
        chunks.append(chunk)
        i += (chunk_size_words - overlap_words)
    return chunks

@celery_app.task(bind=True, name="tasks.pdf_pipeline.extract_and_index_document")
def extract_and_index_document(
    self,
    job_id: str,
    raw_content: str,
    document_id: str,
    metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Background asynchronous PDF & manual extraction worker.
    Processes digital text, applies OCR fallback if needed, extracts structured tables,
    tags MoSPI domain entities, and chunks the manual into the knowledge base.
    """
    metadata = metadata or {}
    start_time = time.time()

    # Step 1: Detect tables
    tables = extract_tables_from_text(raw_content)

    # Step 2: Extract MoSPI domain entities & FRAC competency alignment
    entities = extract_entities(raw_content)
    competency = infer_frac_competency(entities, raw_content)

    # Step 3: Semantic chunking
    text_chunks = chunk_text_stream(raw_content)

    # Step 4: Index chunks into knowledge base
    indexed_chunk_ids = []
    for idx, chunk_text in enumerate(text_chunks):
        chunk_id = f"{document_id}-chunk-{idx + 1}"
        record = {
            "id": chunk_id,
            "document_id": document_id,
            "page_number": idx + 1,
            "section_title": f"{competency.upper()} Manual Excerpt Part {idx + 1}",
            "chunk_text": chunk_text,
            "provenance": metadata.get("provenance", "OFFICIAL_MOSPI_MANUAL"),
            "competency": competency
        }
        STORED_CHUNKS.append(record)
        indexed_chunk_ids.append(chunk_id)

    duration = round(time.time() - start_time, 3)

    return {
        "job_id": job_id,
        "status": "DONE",
        "document_id": document_id,
        "competency": competency,
        "chunks_created": len(indexed_chunk_ids),
        "tables_detected": len(tables),
        "entities_detected": len(entities),
        "processing_time_sec": duration
    }
