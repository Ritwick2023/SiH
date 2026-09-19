from typing import List, Dict, Any, Optional
from ml.collaborative_filter import CollaborativeFilter

collaborative_filter = CollaborativeFilter()

def rank_courses(
    user_cadre: str,
    user_gaps: List[Dict[str, Any]],
    catalog: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Ranks courses using multi-signal scoring:
    FinalScore = 0.50 * S_gap + 0.30 * S_collab + 0.20 * S_semantic

    Prerequisite/Difficulty gating:
    - Gap > 2: boost Foundational courses
    - Gap 1-2: boost Applied courses
    - Gap < 1: boost Capstone courses
    """
    gap_map = {g.get("competency_id"): g for g in user_gaps}
    ranked = []

    for course in catalog:
        c_id = course.get("id", "")
        comp_id = course.get("competency_id", "")
        tier = course.get("tier", "APPLIED").upper()
        gap_info = gap_map.get(comp_id, None)

        if gap_info:
            raw_gap = float(gap_info.get("gap", 1.0))
            priority = gap_info.get("priority", "important").lower()
            p_mult = 3.0 if priority == "critical" else (2.0 if priority == "important" else 1.0)
            
            # S_gap normalized [0..1]
            s_gap = min(1.0, (raw_gap * p_mult) / 12.0)
        else:
            raw_gap = 0.0
            s_gap = 0.1

        # S_collab
        s_collab = collaborative_filter.predict_effectiveness(c_id, user_cadre)

        # S_semantic (course relevance to target role curriculum)
        s_semantic = float(course.get("semantic_relevance", 0.85))

        # Prerequisite / Tier alignment modifier
        tier_boost = 1.0
        if raw_gap > 2.0 and "FOUNDATIONAL" in tier:
            tier_boost = 1.25
        elif 1.0 <= raw_gap <= 2.0 and "APPLIED" in tier:
            tier_boost = 1.20
        elif raw_gap < 1.0 and "CAPSTONE" in tier:
            tier_boost = 1.15

        final_score = (0.50 * s_gap + 0.30 * s_collab + 0.20 * s_semantic) * tier_boost
        final_score = round(min(1.0, final_score), 3)

        # Generate explainability rationale
        if gap_info:
            rationale = (
                f"Bridges your gap in {gap_info.get('competency_title', comp_id)} "
                f"({gap_info.get('evidence_type', 'IRT-verified')}). "
                f"{int(s_collab * 100)}% of officers in cadre {user_cadre} showed positive competency progression."
            )
        else:
            rationale = f"Recommended continuous professional education for {user_cadre} cadre officers."

        course_copy = dict(course)
        course_copy["recommendation_score"] = final_score
        course_copy["explainability"] = rationale
        course_copy["signals"] = {
            "s_gap": round(s_gap, 3),
            "s_collab": round(s_collab, 3),
            "s_semantic": round(s_semantic, 3)
        }
        ranked.append(course_copy)

    ranked.sort(key=lambda x: x["recommendation_score"], reverse=True)
    return ranked
