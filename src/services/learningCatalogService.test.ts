import { describe, it, expect } from 'vitest';
import { LearningCatalogService } from './learningCatalogService';
import type { CompetencyGap } from '@/lib/types';
import type { AppUser } from '@/lib/auth';

describe('LearningCatalogService', () => {
  it('loads all catalog items with verified official provenance and valid source domains', () => {
    const items = LearningCatalogService.getAll();
    expect(items.length).toBeGreaterThanOrEqual(10);

    for (const item of items) {
      expect(item.id).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.title_hi).toBeDefined();
      expect(item.source_url).toBeDefined();
      expect(item.source_domain).toBeDefined();
      expect(item.provenance).toBeDefined();
      expect(item.statvidya_mapping_rationale).toBeDefined();

      if (item.provenance === 'VERIFIED_OFFICIAL') {
        expect(['mospi.gov.in', 'nssta.gov.in']).toContain(item.source_domain);
        expect(item.source_url.startsWith('http')).toBe(true);
      } else if (item.provenance === 'SYNTHETIC_DEMO_DATA') {
        expect(item.source_domain).toBe('igotkarmayogi.gov.in');
      }
    }
  });

  it('retrieves an item by unique ID', () => {
    const workshop = LearningCatalogService.getById('nssta-data-collection-workshop');
    expect(workshop).toBeDefined();
    expect(workshop?.title).toContain('Nuances of Data Collection');
    expect(workshop?.provider).toContain('NSSTA');
    expect(workshop?.provenance).toBe('VERIFIED_OFFICIAL');
  });

  it('filters items by type (courses vs manuals)', () => {
    const courses = LearningCatalogService.filter({ type: 'courses' });
    expect(courses.length).toBeGreaterThan(0);
    for (const c of courses) {
      expect(['workshop', 'training_programme', 'residential_course']).toContain(c.source_type);
    }

    const manuals = LearningCatalogService.filter({ type: 'manuals' });
    expect(manuals.length).toBeGreaterThan(0);
    for (const m of manuals) {
      expect(['field_manual', 'technical_protocol', 'classification_compendium']).toContain(m.source_type);
    }
  });

  it('searches items by keyword in English and Hindi', () => {
    const searchCapi = LearningCatalogService.filter({ query: 'CAPI' });
    expect(searchCapi.length).toBeGreaterThan(0);

    const searchHindi = LearningCatalogService.filter({ query: 'सांख्यिकी' });
    expect(searchHindi.length).toBeGreaterThan(0);
  });

  it('ranks learning items for gaps and outputs explainable rationales', () => {
    const mockGaps: CompetencyGap[] = [
      {
        competencyId: 'comp-capi',
        competency: {
          id: 'comp-capi',
          name: 'CAPI Tablet Operations & Sync',
          name_hi: 'कैपी टैबलेट संचालन और तुल्यकालन',
          category: 'Functional',
          provenance: 'VERIFIED_OFFICIAL',
          levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
          created_at: '',
        },
        currentLevel: 1,
        targetLevel: 3,
        gap: 2,
        priority: 'critical',
        severity: 'HIGH',
        activity: {
          id: 'act-1',
          name: 'CAPI Field Work',
          role_id: 'role-fi',
          provenance: 'VERIFIED_OFFICIAL',
          created_at: '',
        },
        evidenceType: 'self-assessed',
      },
    ];

    const ranked = LearningCatalogService.rankForGaps(mockGaps, {
      id: 'demo-sunita',
      user_metadata: { preferred_language: 'hi', cadre: 'NSSO Field Operations Division' },
    } as unknown as AppUser);

    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].item.targetCompetencies).toContain('comp-capi');
    expect(ranked[0].whyRecommended).toContain('CAPI Tablet Operations');
    expect(ranked[0].whyRecommended_hi).toBeDefined();
    expect(ranked[0].priority).toBe('HIGH');
  });
});
