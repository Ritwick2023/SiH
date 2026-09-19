import pytest
from nlp.table_extractor import extract_tables_from_text, parse_table_lines
from nlp.ner_tagger import extract_entities, infer_frac_competency
from nlp.ocr_engine import extract_bilingual_text_from_image
from tasks.pdf_pipeline import extract_and_index_document, chunk_text_stream

def test_table_extractor_pipe_format():
    sample_text = """
    Schedule 0.0 Listing of Households:
    | FSU ID | Household Head | Family Members | Multiplier |
    |--------|----------------|----------------|------------|
    | 1045   | Ram Prasad     | 5              | 12.4       |
    | 1046   | Sita Devi      | 4              | 12.4       |
    """
    tables = extract_tables_from_text(sample_text)
    assert len(tables) >= 1
    table = tables[0]
    assert "FSU ID" in table["headers"]
    assert len(table["rows"]) == 2
    assert table["rows"][0][1] == "Ram Prasad"

def test_ner_tagger_mospi_entities():
    text = "The Junior Statistical Officer inspected the FSU and UFS Block boundary for Schedule 0.0 using CAPI tablet."
    entities = extract_entities(text)
    labels = [e["label"] for e in entities]
    assert "CADRE_ROLE" in labels or "SURVEY_UNIT" in labels
    
    competency = infer_frac_competency(entities, text)
    assert competency in ["comp-demarcation", "comp-capi"]

def test_chunk_text_stream():
    sample_words = " ".join([f"word{i}" for i in range(100)])
    chunks = chunk_text_stream(sample_words, chunk_size_words=30, overlap_words=5)
    assert len(chunks) >= 3

def test_extract_and_index_pipeline():
    doc_text = """
    Periodic Labour Force Survey (PLFS) Guidelines:
    The First Stage Unit (FSU) is selected via circular systematic sampling.
    Usual Principal Activity Status (UPS) is determined based on major time spent in the preceding 365 days.
    | Activity Code | Description | Category |
    | 11 | Own account worker | Employed |
    | 81 | Seeking work | Unemployed |
    """
    result = extract_and_index_document.apply(
        args=["job-test-1", doc_text, "doc-test-plfs", {"provenance": "OFFICIAL_TEST"}]
    ).get()

    assert result["status"] == "DONE"
    assert result["document_id"] == "doc-test-plfs"
    assert result["chunks_created"] >= 1
    assert result["tables_detected"] >= 1
    assert result["competency"] in ["comp-survey", "comp-demarcation"]
