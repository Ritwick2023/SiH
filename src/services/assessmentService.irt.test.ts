import { describe, it, expect } from 'vitest';
import {
  fetchIrtNextQuestion,
  finalizeIrtAssessment,
  thetaToKarmayogiLevel,
  type IrtCandidateItem,
  type IrtAdministeredItem
} from './assessmentService';

describe('assessmentService - IRT Psychometrics Dual-Mode Bridge', () => {
  it('maps theta to Karmayogi proficiency levels correctly', () => {
    expect(thetaToKarmayogiLevel(-2.5)).toBe('L1');
    expect(thetaToKarmayogiLevel(-1.0)).toBe('L2');
    expect(thetaToKarmayogiLevel(0.2)).toBe('L3');
    expect(thetaToKarmayogiLevel(1.5)).toBe('L4');
    expect(thetaToKarmayogiLevel(2.8)).toBe('L5');
  });

  it('selects next adaptive question using local fallback when FastAPI is offline', async () => {
    const candidates: IrtCandidateItem[] = [
      { id: 'q1', competency_id: 'comp-demarcation', irt_a: 1.2, irt_b: -1.0 },
      { id: 'q2', competency_id: 'comp-demarcation', irt_a: 1.5, irt_b: 0.0 },
      { id: 'q3', competency_id: 'comp-demarcation', irt_a: 1.8, irt_b: 1.0 },
    ];
    const administered: IrtAdministeredItem[] = [
      { item_id: 'q1', is_correct: true, irt_a: 1.2, irt_b: -1.0 },
    ];

    const result = await fetchIrtNextQuestion(candidates, administered, -1.0);

    expect(result).toBeDefined();
    expect(result.next_item_id).toBeDefined();
    expect(['q2', 'q3']).toContain(result.next_item_id);
    expect(result.provenance).toBe('LOCAL_HEURISTIC_FALLBACK');
  });

  it('finalizes assessment with confidence interval and Karmayogi level using local fallback', async () => {
    const administered: IrtAdministeredItem[] = [
      { item_id: 'q1', is_correct: true, irt_a: 1.2, irt_b: -1.0 },
      { item_id: 'q2', is_correct: true, irt_a: 1.5, irt_b: 0.0 },
      { item_id: 'q3', is_correct: true, irt_a: 1.8, irt_b: 1.0 },
    ];

    const result = await finalizeIrtAssessment(administered);

    expect(result).toBeDefined();
    expect(result.accuracy_percent).toBe(100);
    expect(result.confidence_interval_95).toHaveLength(2);
    expect(result.confidence_interval_95[0]).toBeLessThan(result.confidence_interval_95[1]);
    expect(result.provenance).toBe('LOCAL_HEURISTIC_FALLBACK');
  });
});
