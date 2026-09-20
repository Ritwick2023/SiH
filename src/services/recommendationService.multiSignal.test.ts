import { describe, it, expect } from 'vitest';
import { rankCoursesMultiSignal, OFFICIAL_COURSE_CATALOG } from './recommendationService';
import type { CompetencyGap } from '@/lib/types';

describe('recommendationService - Multi-Signal Bridge', () => {
  const mockGaps: CompetencyGap[] = [
    {
      competencyId: 'comp-capi',
      competency: {
        id: 'comp-capi',
        name: 'CAPI Operations',
        name_hi: 'कैपी संचालन',
        description: '',
        category: 'Domain',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'VERIFIED_OFFICIAL',
        created_at: '2025-01-01',
      },
      activity: {
        id: 'act-1',
        name: 'Field Survey',
        role_id: 'role-jso',
        description: '',
        provenance: 'VERIFIED_OFFICIAL',
        created_at: '2025-01-01',
      },
      currentLevel: 1,
      targetLevel: 4,
      gap: 3,
      priority: 'critical',
      severity: 'HIGH',
      evidenceType: 'assessment-verified'
    }
  ];

  it('ranks courses with multi-signal fallback when remote backend is offline', async () => {
    const recommendations = await rankCoursesMultiSignal('FOD', mockGaps, OFFICIAL_COURSE_CATALOG);

    expect(recommendations).toBeDefined();
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].course.targetCompetencies).toContain('comp-capi');
    expect(recommendations[0].priority).toBe('HIGH');
    expect(recommendations[0].whyRecommended).toContain('CAPI Operations');
  });
});
