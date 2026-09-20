from typing import List, Dict, Any, Optional
import time

class OutcomeAttributor:
    """
    Tracks and aggregates competency progression (delta_theta) attributed to courses.
    """
    def __init__(self):
        # In-memory storage of outcome events (backed by PostgreSQL in full cluster)
        self.events: List[Dict[str, Any]] = [
            # Seed empirical baseline events for initial demonstration
            {"official_id": "off-01", "course_id": "course-capi-101", "delta_theta": 1.2, "days": 28, "created_at": time.time() - 86400 * 10},
            {"official_id": "off-02", "course_id": "course-capi-101", "delta_theta": 0.9, "days": 35, "created_at": time.time() - 86400 * 8},
            {"official_id": "off-03", "course_id": "course-nsso-plfs", "delta_theta": 1.4, "days": 30, "created_at": time.time() - 86400 * 12},
            {"official_id": "off-04", "course_id": "course-sampling-design", "delta_theta": 1.1, "days": 42, "created_at": time.time() - 86400 * 15},
            {"official_id": "off-05", "course_id": "course-data-scrutiny", "delta_theta": 1.5, "days": 21, "created_at": time.time() - 86400 * 5},
        ]

    def log_event(
        self,
        official_id: str,
        event_type: str,
        course_id: Optional[str],
        competency_id: Optional[str],
        theta_before: Optional[float],
        theta_after: Optional[float],
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        delta = None
        if theta_before is not None and theta_after is not None:
            delta = round(theta_after - theta_before, 3)

        event = {
            "id": f"evt-{len(self.events) + 1}",
            "official_id": official_id,
            "event_type": event_type,
            "course_id": course_id,
            "competency_id": competency_id,
            "theta_before": theta_before,
            "theta_after": theta_after,
            "delta_theta": delta,
            "days": metadata.get("days", 30) if metadata else 30,
            "metadata": metadata or {},
            "created_at": time.time()
        }
        self.events.append(event)
        return event

    def get_attribution_leaderboard(self) -> List[Dict[str, Any]]:
        # Group by course_id
        grouped: Dict[str, List[Dict[str, Any]]] = {}
        for ev in self.events:
            c_id = ev.get("course_id")
            if c_id and ev.get("delta_theta") is not None:
                if c_id not in grouped:
                    grouped[c_id] = []
                grouped[c_id].append(ev)

        leaderboard = []
        for course_id, ev_list in grouped.items():
            deltas = [e["delta_theta"] for e in ev_list]
            days = [e.get("days", 30) for e in ev_list]
            avg_delta = round(sum(deltas) / len(deltas), 2)
            avg_days = round(sum(days) / len(days), 1)

            leaderboard.append({
                "course_id": course_id,
                "avg_delta_theta": avg_delta,
                "sample_size": len(ev_list),
                "avg_days_to_improvement": avg_days,
                "confidence": "HIGH" if len(ev_list) >= 5 else "PRELIMINARY"
            })

        leaderboard.sort(key=lambda x: x["avg_delta_theta"], reverse=True)
        return leaderboard

outcome_attributor = OutcomeAttributor()
