import math
from typing import List, Dict, Any, Optional, Tuple

D = 1.7  # Scaling constant to approximate normal ogive

def item_response_probability(theta: float, a: float, b: float) -> float:
    """
    Computes 2-Parameter Logistic (2PL) item response probability.
    P(correct | theta) = 1 / (1 + exp(-D * a * (theta - b)))
    """
    z = -D * a * (theta - b)
    # Clip z to prevent numerical overflow in exp
    z = max(min(z, 30.0), -30.0)
    return 1.0 / (1.0 + math.exp(z))

def fisher_information(theta: float, a: float, b: float) -> float:
    """
    Computes Fisher Information for an item at ability level theta.
    I(theta) = D^2 * a^2 * P(theta) * (1 - P(theta))
    """
    p = item_response_probability(theta, a, b)
    q = 1.0 - p
    return (D ** 2) * (a ** 2) * p * q

def estimate_theta_mle(
    responses: List[Dict[str, Any]], 
    initial_theta: float = 0.0,
    max_iter: int = 25, 
    tolerance: float = 1e-4
) -> Tuple[float, float]:
    """
    Estimates theta using Newton-Raphson Maximum Likelihood Estimation.
    responses: list of dicts with {'irt_a': float, 'irt_b': float, 'is_correct': bool}
    Returns (theta_estimate, standard_error).
    """
    if not responses:
        return initial_theta, 1.0

    # If all correct or all incorrect, estimate relative to hardest/easiest item answered
    all_correct = all(r['is_correct'] for r in responses)
    all_incorrect = all(not r['is_correct'] for r in responses)
    
    if all_correct:
        max_b = max(float(r.get('irt_b', 0.0)) for r in responses)
        est = min(max_b + 0.8, 3.5)
        return round(est, 3), 0.45
    if all_incorrect:
        min_b = min(float(r.get('irt_b', 0.0)) for r in responses)
        est = max(min_b - 0.8, -3.5)
        return round(est, 3), 0.45

    theta = initial_theta
    for _ in range(max_iter):
        score = 0.0
        info = 0.0
        for r in responses:
            a = float(r.get('irt_a', 1.0))
            b = float(r.get('irt_b', 0.0))
            u = 1.0 if r.get('is_correct', False) else 0.0
            
            p = item_response_probability(theta, a, b)
            score += D * a * (u - p)
            info += (D ** 2) * (a ** 2) * p * (1.0 - p)

        if info < 1e-6:
            break

        delta = score / info
        # Dampen large step sizes
        delta = max(min(delta, 1.0), -1.0)
        theta += delta

        # Clamp theta to realistic bounds [-3.5, +3.5]
        theta = max(min(theta, 3.5), -3.5)

        if abs(delta) < tolerance:
            break

    # Calculate total information and standard error at final theta
    total_info = sum(fisher_information(theta, float(r.get('irt_a', 1.0)), float(r.get('irt_b', 0.0))) for r in responses)
    se = 1.0 / math.sqrt(total_info) if total_info > 1e-4 else 1.0

    return round(theta, 3), round(se, 3)

def select_next_item(
    candidate_items: List[Dict[str, Any]], 
    administered_ids: List[str], 
    current_theta: float
) -> Optional[Dict[str, Any]]:
    """
    Selects the candidate item that maximizes Fisher Information at current_theta.
    """
    available = [item for item in candidate_items if item['id'] not in administered_ids]
    if not available:
        return None

    best_item = None
    max_info = -1.0

    for item in available:
        a = float(item.get('irt_a', 1.0))
        b = float(item.get('irt_b', 0.0))
        info = fisher_information(current_theta, a, b)
        if info > max_info:
            max_info = info
            best_item = item

    return best_item

def theta_to_level(theta: float) -> str:
    """
    Maps continuous theta ability score to Mission Karmayogi L1-L5 levels.
    """
    if theta < -1.8:
        return "L1"
    elif theta < -0.4:
        return "L2"
    elif theta < 0.9:
        return "L3"
    elif theta < 2.2:
        return "L4"
    else:
        return "L5"
