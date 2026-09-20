import spacy
from spacy.pipeline import EntityRuler
from typing import List, Dict, Any, Optional

_nlp_instance = None

def get_mospi_nlp():
    """
    Initializes and caches the spaCy language model with official MoSPI domain entity patterns.
    """
    global _nlp_instance
    if _nlp_instance is not None:
        return _nlp_instance

    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        nlp = spacy.blank("en")

    # Add EntityRuler for high-precision statutory statistical terms
    ruler = nlp.add_pipe("entity_ruler", before="ner" if "ner" in nlp.pipe_names else None)

    patterns = [
        # SURVEY_UNIT
        {"label": "SURVEY_UNIT", "pattern": [{"LOWER": "fsu"}]},
        {"label": "SURVEY_UNIT", "pattern": [{"LOWER": "first"}, {"LOWER": "stage"}, {"LOWER": "unit"}]},
        {"label": "SURVEY_UNIT", "pattern": [{"LOWER": "ssu"}]},
        {"label": "SURVEY_UNIT", "pattern": [{"LOWER": "ufs"}, {"LOWER": "block"}]},
        {"label": "SURVEY_UNIT", "pattern": [{"LOWER": "hamlet"}, {"LOWER": "group"}]},
        {"label": "SURVEY_UNIT", "pattern": [{"LOWER": "stratum"}]},
        {"label": "SURVEY_UNIT", "pattern": [{"LOWER": "sub-stratum"}]},

        # SCHEDULE_REF
        {"label": "SCHEDULE_REF", "pattern": [{"LOWER": "schedule"}, {"LOWER": "0.0"}]},
        {"label": "SCHEDULE_REF", "pattern": [{"LOWER": "schedule"}, {"LOWER": "1.0"}]},
        {"label": "SCHEDULE_REF", "pattern": [{"LOWER": "schedule"}, {"LOWER": "2.1"}]},
        {"label": "SCHEDULE_REF", "pattern": [{"LOWER": "schedule"}, {"LOWER": "10.0"}]},
        {"label": "SCHEDULE_REF", "pattern": [{"LOWER": "plfs"}]},
        {"label": "SCHEDULE_REF", "pattern": [{"LOWER": "hces"}]},
        {"label": "SCHEDULE_REF", "pattern": [{"LOWER": "asuse"}]},

        # STAT_CONCEPT
        {"label": "STAT_CONCEPT", "pattern": [{"LOWER": "multiplier"}]},
        {"label": "STAT_CONCEPT", "pattern": [{"LOWER": "substitution"}]},
        {"label": "STAT_CONCEPT", "pattern": [{"LOWER": "non-response"}]},
        {"label": "STAT_CONCEPT", "pattern": [{"LOWER": "sampling"}, {"LOWER": "weight"}]},
        {"label": "STAT_CONCEPT", "pattern": [{"LOWER": "scrutiny"}, {"LOWER": "flag"}]},
        {"label": "STAT_CONCEPT", "pattern": [{"LOWER": "usual"}, {"LOWER": "principal"}, {"LOWER": "status"}]},
        {"label": "STAT_CONCEPT", "pattern": [{"LOWER": "current"}, {"LOWER": "weekly"}, {"LOWER": "status"}]},
        {"label": "STAT_CONCEPT", "pattern": [{"LOWER": "mpce"}]},

        # CADRE_ROLE
        {"label": "CADRE_ROLE", "pattern": [{"LOWER": "jso"}]},
        {"label": "CADRE_ROLE", "pattern": [{"LOWER": "junior"}, {"LOWER": "statistical"}, {"LOWER": "officer"}]},
        {"label": "CADRE_ROLE", "pattern": [{"LOWER": "sso"}]},
        {"label": "CADRE_ROLE", "pattern": [{"LOWER": "senior"}, {"LOWER": "statistical"}, {"LOWER": "officer"}]},
        {"label": "CADRE_ROLE", "pattern": [{"LOWER": "field"}, {"LOWER": "investigator"}]},
        {"label": "CADRE_ROLE", "pattern": [{"LOWER": "superintendent"}]},
        {"label": "CADRE_ROLE", "pattern": [{"LOWER": "regional"}, {"LOWER": "director"}]},
    ]

    ruler.add_patterns(patterns)
    _nlp_instance = nlp
    return _nlp_instance

def extract_entities(text: str) -> List[Dict[str, Any]]:
    """
    Extracts recognized entities from MoSPI documents.
    """
    nlp = get_mospi_nlp()
    doc = nlp(text)

    results = []
    for ent in doc.ents:
        if ent.label_ in ["SURVEY_UNIT", "SCHEDULE_REF", "STAT_CONCEPT", "CADRE_ROLE"]:
            results.append({
                "text": ent.text,
                "label": ent.label_,
                "start": ent.start_char,
                "end": ent.end_char
            })
    return results

def infer_frac_competency(entities: List[Dict[str, Any]], text: str) -> str:
    """
    Infers the primary Mission Karmayogi FRAC competency ID from extracted entities.
    """
    text_lower = text.lower()

    if any(e["label"] == "SURVEY_UNIT" for e in entities) or "boundary" in text_lower or "demarcation" in text_lower:
        return "comp-demarcation"
    
    if "capi" in text_lower or "tablet" in text_lower or "gps" in text_lower or "offline sync" in text_lower:
        return "comp-capi"

    if any(e["text"].lower() == "plfs" for e in entities) or "labour force" in text_lower or "cws" in text_lower:
        return "comp-survey"

    if any(e["label"] == "STAT_CONCEPT" for e in entities) or "scrutiny" in text_lower or "multiplier" in text_lower:
        return "comp-scrutiny"

    return "comp-general"
