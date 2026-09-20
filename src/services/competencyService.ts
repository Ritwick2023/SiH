/**
 * Competency Service
 * Core domain logic for gap calculation, readiness indexing, and severity computation
 * Framework-agnostic (no React dependencies)
 */

import type {
  ActivityCompetency,
  CompetencyRecord,
  CompetencyGap,
  ActivityPriority,
  SeverityBucket,
  Activity,
  Competency,
  ConfidenceTier,
} from '@/lib/types';
import { executeWithFallback, getServiceUrl } from '@/lib/serviceUtils';

// ============================================================================
// CONSTANTS
// ============================================================================

export const SEVERITY_WEIGHTS = {
  critical: 100,
  important: 50,
  desirable: 10,
};

export const GAP_PRIORITY_WEIGHTS: Record<ActivityPriority, number> = {
  critical: 3,
  important: 2,
  desirable: 1,
};

// ============================================================================
// DOMAIN LOGIC
// ============================================================================

/**
 * Compute severity score based on gap and priority weight (PRD §4.1)
 * Severity Score = max(0, targetLevel - currentLevel) * priorityWeight
 * where critical=3, important=2, desirable=1
 */
export function computeGapSeverity(
  currentLevel: number,
  targetLevel: number,
  priority: ActivityPriority
): number {
  const gap = Math.max(0, targetLevel - currentLevel);
  const weight = GAP_PRIORITY_WEIGHTS[priority] ?? 1;
  return gap * weight;
}

/**
 * Computes evidence weight with half-life time decay for Bayesian gap weighting.
 * IRT-Verified < 30 days: 1.0, 30-90 days: 0.85, > 90 days: 0.65
 * Self-Reported: 0.50, Default: 0.30
 * Decay factor: exp(-0.35 * days / 180)
 */
export function computeEvidenceWeight(
  evidenceType?: string,
  daysSinceAssessment: number = 0
): number {
  let baseWeight = 0.30;
  const ev = (evidenceType || '').toLowerCase();
  if (ev.includes('irt') || ev.includes('assessment-verified') || ev.includes('verified')) {
    if (daysSinceAssessment < 30) baseWeight = 1.00;
    else if (daysSinceAssessment <= 90) baseWeight = 0.85;
    else baseWeight = 0.65;
  } else if (ev.includes('self')) {
    baseWeight = 0.50;
  }

  const lambda = 0.35;
  const decay = Math.exp(-lambda * (daysSinceAssessment / 180));
  return Number((baseWeight * decay).toFixed(3));
}

/**
 * Computes Bayesian Evidence-Weighted Gap Score:
 * WeightedGapScore = max(0, targetLevel - currentLevel) * W_priority * W_evidence * Delta_decay
 */
export function computeBayesianWeightedGap(
  currentLevel: number,
  targetLevel: number,
  priority: ActivityPriority,
  options?: { evidenceType?: string; daysSinceAssessment?: number }
): number {
  const gap = Math.max(0, targetLevel - currentLevel);
  const priorityWeight = GAP_PRIORITY_WEIGHTS[priority] ?? 1;
  const evidenceWeight = options ? computeEvidenceWeight(options.evidenceType, options.daysSinceAssessment ?? 0) : 1.0;
  return Number((gap * priorityWeight * evidenceWeight).toFixed(2));
}

/**
 * Computes priority and evidence-weighted readiness index:
 * WeightedReadiness = Sum(min(level_i, target_i) * W_p * W_ev) / Sum(target_i * W_p)
 */
export function computeWeightedReadinessIndex(
  requiredCompetencies: Array<{ competencyId: string; targetLevel: number; priority?: ActivityPriority }>,
  userRecords: Map<string, number>,
  evidenceMap?: Map<string, { evidenceType?: string; daysSinceAssessment?: number }>
): number {
  if (requiredCompetencies.length === 0) return 0;

  let totalMaxWeight = 0;
  let achievedWeight = 0;

  for (const req of requiredCompetencies) {
    const pWeight = GAP_PRIORITY_WEIGHTS[req.priority ?? 'important'] ?? 2;
    const ev = evidenceMap?.get(req.competencyId);
    const evWeight = ev ? computeEvidenceWeight(ev.evidenceType, ev.daysSinceAssessment ?? 0) : 0.85;

    const userLevel = userRecords.get(req.competencyId) ?? 0;
    const cappedLevel = Math.min(userLevel, req.targetLevel);

    totalMaxWeight += req.targetLevel * pWeight;
    achievedWeight += cappedLevel * pWeight * evWeight;
  }

  if (totalMaxWeight === 0) return 0;
  return Math.round((achievedWeight / totalMaxWeight) * 100);
}

/**
 * Classify severity score into official FRAC severity buckets (PRD §4.1)
 * Score >= 4  → HIGH (Critical Gap)
 * Score 2-3   → MODERATE (Moderate Gap)
 * Score <= 1  → PROFICIENT (Proficient)
 */
export function classifySeverity(score: number): SeverityBucket {
  if (score >= 4) return 'HIGH';
  if (score >= 2) return 'MODERATE';
  return 'PROFICIENT';
}

/**
 * Determine promoted competency level after assessment completion (PRD §4.1, §4.3)
 * - Score < 40%: No promotion
 * - Score 40-69%: +1 level if current < L3 (capped at L3)
 * - Score >= 70%: +2 levels (or +1 level in strictMode, capped at L5)
 */
export function promoteCompetencyLevel(
  currentLevel: number,
  score: number,
  options?: { strictMode?: boolean }
): number {
  if (currentLevel >= 5) return 5;
  if (score < 40) return currentLevel;

  if (options?.strictMode) {
    if (score >= 70) {
      return Math.min(5, currentLevel + 1);
    }
    if (currentLevel < 3) {
      return Math.min(3, currentLevel + 1);
    }
    return currentLevel;
  }

  // Score > 70%: promote by up to 2 levels, cap at 5
  if (score > 70) {
    return Math.min(5, currentLevel + 2);
  }

  // Score === 70%: promote if < L3, capped at L3
  if (score === 70) {
    if (currentLevel < 3) {
      return Math.min(3, currentLevel + 2);
    }
    return currentLevel;
  }

  // Medium score: 40% - 69% (promote by 1 level if < L3, capped at L3)
  if (currentLevel < 3) {
    return Math.min(3, currentLevel + 1);
  }

  return currentLevel;
}

/**
 * Compute readiness index: % of required competencies at or above target level
 */
export function computeReadinessIndex(
  requiredCompetencies: Array<{ competencyId: string; targetLevel: number }>,
  userRecords: Map<string, number>
): number {
  if (requiredCompetencies.length === 0) return 0;

  const metCount = requiredCompetencies.filter((req) => {
    const userLevel = userRecords.get(req.competencyId) ?? 0;
    return userLevel >= req.targetLevel;
  }).length;

  return Math.round((metCount / requiredCompetencies.length) * 100);
}

/**
 * Build a CompetencyGap record with full details
 */
function buildCompetencyGap(
  competency: Competency,
  activity: Activity,
  currentLevel: number,
  targetLevel: number,
  priority: ActivityPriority,
  evidenceType: 'self-assessed' | 'assessment-verified'
): CompetencyGap | null {
  const gap = Math.max(0, targetLevel - currentLevel);
  const severityScore = computeGapSeverity(currentLevel, targetLevel, priority);
  const severity = classifySeverity(severityScore);

  return {
    competencyId: competency.id,
    competency,
    activity,
    currentLevel,
    targetLevel,
    gap,
    priority,
    severity,
    evidenceType,
  };
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Analyze competency gaps for a user in a specific role
 * Called by Dashboard, Skill Gap Analysis, Pathways
 */
export async function analyzeCompetencyGaps({
  userCompetencies,
  activityCompetencies,
  competencies,
  activities,
  roleId,
  activityId,
}: {
  userCompetencies: CompetencyRecord[];
  activityCompetencies: ActivityCompetency[];
  competencies: Map<string, Competency>;
  activities: Map<string, Activity>;
  roleId?: string;
  activityId?: string;
}): Promise<{
  gaps: CompetencyGap[];
  readinessIndex: number;
  topGaps: CompetencyGap[];
}> {
  // 1. Build user record map for quick lookup
  const userRecords = new Map(userCompetencies.map((rec) => [rec.competency_id, rec.current_level]));

  // 2. Filter mappings
  const relevantMappings = activityCompetencies.filter((ac) => {
    if (activityId) return activities.get(ac.activity_id)?.id === activityId;
    if (roleId) return activities.get(ac.activity_id)?.role_id === roleId;
    return true;
  });

  // 3. Build gaps for each required competency
  const gaps: CompetencyGap[] = relevantMappings
    .map((ac) => {
      const competency = competencies.get(ac.competency_id);
      const activity = activities.get(ac.activity_id);

      if (!competency || !activity) return null;

      const userRecord = userCompetencies.find((r) => r.competency_id === ac.competency_id);
      const currentLevel = userRecord?.current_level ?? 1;
      const evidenceType: 'self-assessed' | 'assessment-verified' = userRecord?.evidence ? 'assessment-verified' : 'self-assessed';

      return buildCompetencyGap(
        competency,
        activity,
        currentLevel,
        ac.target_level,
        ac.priority,
        evidenceType
      );
    })
    .filter((g): g is CompetencyGap => g !== null);

  // 4. Sort by severity (descending)
  gaps.sort((a, b) => {
    const scoreA = computeGapSeverity(a.currentLevel, a.targetLevel, a.priority);
    const scoreB = computeGapSeverity(b.currentLevel, b.targetLevel, b.priority);
    return scoreB - scoreA;
  });

  // 5. Compute readiness index
  const requiredCompetencies = relevantMappings.map((ac) => ({
    competencyId: ac.competency_id,
    targetLevel: ac.target_level,
  }));

  const readinessIndex = computeReadinessIndex(requiredCompetencies, userRecords);

  // 6. Top 3 gaps
  const topGaps = gaps.slice(0, 3);

  return {
    gaps,
    readinessIndex,
    topGaps,
  };
}

/**
 * Compute severity label for UI display
 */
export function getSeverityLabel(severity: SeverityBucket): string {
  const labels = {
    HIGH: 'Critical Gap',
    MODERATE: 'Moderate Gap',
    PROFICIENT: 'Proficient',
  };
  return labels[severity];
}

/**
 * Maps evidence type and age to UI confidence tier
 */
export function getConfidenceTier(evidenceType?: string, daysSinceAssessment: number = 0): ConfidenceTier {
  if (!evidenceType || evidenceType === 'unassessed') {
    return 'UNASSESSED';
  }
  if (evidenceType === 'self-assessed' || evidenceType === 'SELF_REPORTED') {
    return 'SELF_REPORTED';
  }
  if (daysSinceAssessment < 30) {
    return 'VERIFIED_RECENT';
  }
  if (daysSinceAssessment <= 90) {
    return 'VERIFIED_AGING';
  }
  return 'VERIFIED_STALE';
}

/**
 * Simulates readiness score when user drags sliders in the What-If sandbox.
 * Pure TypeScript synchronous execution (0ms round-trip).
 */
export function simulateReadinessScore(
  requiredCompetencies: Array<{ competencyId: string; targetLevel: number; priority?: ActivityPriority }>,
  baseLevels: Map<string, number>,
  simulatedOverrides: Record<string, number>,
  evidenceMap?: Map<string, { evidenceType?: string; daysSinceAssessment?: number }>
): {
  simulatedReadiness: number;
  baselineReadiness: number;
  delta: number;
  criticalGapsRemaining: number;
  meetsPromotionThreshold: boolean;
} {
  const effectiveLevels = new Map(baseLevels);
  for (const [compId, level] of Object.entries(simulatedOverrides)) {
    effectiveLevels.set(compId, level);
  }

  const baselineReadiness = computeWeightedReadinessIndex(requiredCompetencies, baseLevels, evidenceMap);
  const simulatedReadiness = computeWeightedReadinessIndex(requiredCompetencies, effectiveLevels, evidenceMap);

  let criticalGapsRemaining = 0;
  for (const req of requiredCompetencies) {
    const cur = effectiveLevels.get(req.competencyId) ?? 0;
    const ev = evidenceMap?.get(req.competencyId);
    const score = computeBayesianWeightedGap(cur, req.targetLevel, req.priority ?? 'important', ev);
    if (score >= 3.5) {
      criticalGapsRemaining++;
    }
  }

  return {
    simulatedReadiness,
    baselineReadiness,
    delta: simulatedReadiness - baselineReadiness,
    criticalGapsRemaining,
    meetsPromotionThreshold: simulatedReadiness >= 80,
  };
}

/**
 * FastAPI bridge for Bayesian gap scoring using executeWithFallback
 */
export async function computeGapWithFastAPI(
  currentLevel: number,
  targetLevel: number,
  priority: ActivityPriority,
  options?: { evidenceType?: string; daysSinceAssessment?: number }
): Promise<{
  weighted_gap_score: number;
  evidence_weight: number;
  decay_factor: number;
  severity_bucket: SeverityBucket;
}> {
  const days = options?.daysSinceAssessment ?? 0;
  const evType = options?.evidenceType;
  const isIrt = evType === 'assessment-verified' || evType === 'IRT_VERIFIED';

  return executeWithFallback(
    async () => {
      const analyticsUrl = getServiceUrl('NEXT_PUBLIC_ANALYTICS_SERVICE_URL', 'http://localhost:8000');
      const res = await fetch(`${analyticsUrl}/api/v1/analytics/gap-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_level: currentLevel,
          target_level: targetLevel,
          priority,
          evidence_type: isIrt ? 'IRT_VERIFIED' : 'SELF_REPORTED',
          days_since_assessment: days,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    () => {
      const weightedScore = computeBayesianWeightedGap(currentLevel, targetLevel, priority, options);
      const evWeight = computeEvidenceWeight(evType, days);
      const decay = Number(Math.exp(-0.35 * (days / 180)).toFixed(3));
      return {
        weighted_gap_score: weightedScore,
        evidence_weight: evWeight,
        decay_factor: decay,
        severity_bucket: classifySeverity(weightedScore),
      };
    },
    'BayesianGapScoreFastAPI',
    1500
  );
}

/**
 * Export all public functions and types
 */
export const CompetencyService = {
  analyzeCompetencyGaps,
  computeGapSeverity,
  computeBayesianWeightedGap,
  computeEvidenceWeight,
  computeWeightedReadinessIndex,
  getConfidenceTier,
  simulateReadinessScore,
  computeGapWithFastAPI,
  classifySeverity,
  computeReadinessIndex,
  promoteCompetencyLevel,
  getSeverityLabel,
};
