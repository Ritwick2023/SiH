import { describe, it, expect } from 'vitest';
import {
  computeEvidenceWeight,
  computeBayesianWeightedGap,
  computeWeightedReadinessIndex
} from './competencyService';

describe('competencyService - Bayesian Gap & Evidence Weighting', () => {
  it('computes higher evidence weight for fresh IRT verification than self-reported', () => {
    const irtRecent = computeEvidenceWeight('IRT_VERIFIED', 5);
    const irtOlder = computeEvidenceWeight('IRT_VERIFIED', 45);
    const selfAssessed = computeEvidenceWeight('SELF_REPORTED', 5);
    const neverAssessed = computeEvidenceWeight('NEVER_ASSESSED', 5);

    expect(irtRecent).toBeGreaterThan(irtOlder);
    expect(irtOlder).toBeGreaterThan(selfAssessed);
    expect(selfAssessed).toBeGreaterThan(neverAssessed);
  });

  it('applies time decay to evidence weights over months', () => {
    const day10 = computeEvidenceWeight('IRT_VERIFIED', 10);
    const day180 = computeEvidenceWeight('IRT_VERIFIED', 180);

    expect(day180).toBeLessThan(day10);
  });

  it('computes Bayesian weighted gap score combining priority and evidence', () => {
    // Gap = 2 levels (target 4, current 2), Priority = critical (x3)
    // Fresh IRT: 2 * 3 * ~0.99 ~= 5.94
    const scoreFreshIrt = computeBayesianWeightedGap(2, 4, 'critical', {
      evidenceType: 'IRT_VERIFIED',
      daysSinceAssessment: 5
    });

    // Self-reported: 2 * 3 * ~0.49 ~= 2.94
    const scoreSelf = computeBayesianWeightedGap(2, 4, 'critical', {
      evidenceType: 'SELF_REPORTED',
      daysSinceAssessment: 5
    });

    expect(scoreFreshIrt).toBeGreaterThan(scoreSelf);
    expect(scoreFreshIrt).toBeCloseTo(5.9, 0);
  });

  it('computes weighted readiness index using priority and evidence maps', () => {
    const reqs = [
      { competencyId: 'c1', targetLevel: 4, priority: 'critical' as const },
      { competencyId: 'c2', targetLevel: 3, priority: 'important' as const },
    ];
    const userLevels = new Map([
      ['c1', 4],
      ['c2', 3],
    ]);
    const evidenceMap = new Map([
      ['c1', { evidenceType: 'IRT_VERIFIED', daysSinceAssessment: 10 }],
      ['c2', { evidenceType: 'IRT_VERIFIED', daysSinceAssessment: 10 }],
    ]);

    const readiness = computeWeightedReadinessIndex(reqs, userLevels, evidenceMap);
    expect(readiness).toBeGreaterThan(90);
  });
});
