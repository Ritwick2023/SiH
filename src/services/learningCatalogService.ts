/**
 * learningCatalogService.ts — Service layer for official government learning objects
 *
 * Provides query, filter, search, and recommendation operations over OFFICIAL_LEARNING_CATALOG.
 * Ensures strict provenance integrity and explainability.
 */

import {
  OFFICIAL_LEARNING_CATALOG,
  type OfficialLearningItem,
} from '@/data/officialLearningCatalog';
import type { CompetencyGap } from '@/lib/types';
import type { AppUser } from '@/lib/auth';
import { SEVERITY_WEIGHTS } from './competencyService';

export interface RankedLearningRecommendation {
  item: OfficialLearningItem;
  score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  whyRecommended: string;
  whyRecommended_hi: string;
  matchingGaps: {
    competencyId: string;
    competencyName: string;
    competencyNameHi?: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
  }[];
}

export interface LearningFilterOptions {
  query?: string;
  type?: string; // 'all' | 'courses' | 'manuals' | 'workshops' | 'igot'
  provider?: string;
  language?: string;
  competencyId?: string;
  stage?: string;
}

export class LearningCatalogService {
  /**
   * Return all verified learning items
   */
  static getAll(): OfficialLearningItem[] {
    return OFFICIAL_LEARNING_CATALOG;
  }

  /**
   * Find item by unique ID
   */
  static getById(id: string): OfficialLearningItem | undefined {
    return OFFICIAL_LEARNING_CATALOG.find((item) => item.id === id);
  }

  /**
   * Find items targeting a specific FRAC competency
   */
  static getByCompetency(competencyId: string): OfficialLearningItem[] {
    return OFFICIAL_LEARNING_CATALOG.filter((item) =>
      item.targetCompetencies.includes(competencyId)
    );
  }

  /**
   * Filter catalog items based on multi-criteria options
   */
  static filter(options: LearningFilterOptions): OfficialLearningItem[] {
    let results = [...OFFICIAL_LEARNING_CATALOG];

    // 1. Text Search across Title, Description, Topics, Provider
    if (options.query && options.query.trim() !== '') {
      const q = options.query.toLowerCase().trim();
      results = results.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(q) || item.title_hi.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q) || item.description_hi.toLowerCase().includes(q);
        const providerMatch = item.provider.toLowerCase().includes(q);
        const topicMatch = item.topics.some((t) => t.toLowerCase().includes(q));
        const competencyMatch = item.targetCompetencies.some((c) => c.toLowerCase().includes(q));
        return titleMatch || descMatch || providerMatch || topicMatch || competencyMatch;
      });
    }

    // 2. High-level category tab filter
    if (options.type && options.type !== 'all') {
      if (options.type === 'courses') {
        // Structured programmes & workshops
        results = results.filter((item) =>
          ['workshop', 'training_programme', 'residential_course'].includes(item.source_type)
        );
      } else if (options.type === 'manuals') {
        // Statutory manuals & compendiums
        results = results.filter((item) =>
          ['field_manual', 'technical_protocol', 'classification_compendium'].includes(item.source_type)
        );
      } else if (options.type === 'igot') {
        results = results.filter((item) => item.source_type === 'igot_demo');
      }
    }

    // 3. Specific Provider filter
    if (options.provider && options.provider !== 'all') {
      results = results.filter((item) =>
        item.provider.toLowerCase().includes(options.provider!.toLowerCase())
      );
    }

    // 4. Language filter
    if (options.language && options.language !== 'all') {
      if (options.language === 'Hindi') {
        results = results.filter((item) => item.language === 'Hindi' || item.language === 'Bilingual');
      } else if (options.language === 'English') {
        results = results.filter((item) => item.language === 'English' || item.language === 'Bilingual');
      } else {
        results = results.filter((item) => item.language === options.language);
      }
    }

    // 5. Competency ID filter
    if (options.competencyId && options.competencyId !== 'all') {
      results = results.filter((item) =>
        item.targetCompetencies.includes(options.competencyId!)
      );
    }

    // 6. Stage filter
    if (options.stage && options.stage !== 'all') {
      results = results.filter((item) => item.stage === options.stage);
    }

    return results;
  }

  /**
   * Multi-signal recommendation engine ranking government resources against learner's competency gaps
   */
  static rankForGaps(
    gaps: CompetencyGap[],
    user?: AppUser | null,
    catalog: OfficialLearningItem[] = OFFICIAL_LEARNING_CATALOG
  ): RankedLearningRecommendation[] {
    if (!gaps || gaps.length === 0) {
      return [];
    }

    const isHindi =
      user?.user_metadata?.preferred_language === 'hi' ||
      user?.id?.includes('sunita');

    const userCadre = (user?.user_metadata?.cadre as string) || '';

    const recommendations: RankedLearningRecommendation[] = [];

    for (const item of catalog) {
      let totalScore = 0;
      const matchingGaps: RankedLearningRecommendation['matchingGaps'] = [];

      for (const gap of gaps) {
        if (item.targetCompetencies.includes(gap.competencyId) && gap.gap > 0) {
          const priorityWeight = SEVERITY_WEIGHTS[gap.priority] || 10;

          // Target level match
          let levelMultiplier = 1.0;
          if (item.targetLevel === gap.targetLevel) {
            levelMultiplier = 1.5;
          } else if (item.targetLevel > gap.targetLevel) {
            levelMultiplier = 1.2;
          }

          // Cadre role relevance boost
          let cadreBoost = 1.0;
          if (userCadre && item.government_role_relevance.some((r) => r.toLowerCase().includes(userCadre.toLowerCase()))) {
            cadreBoost = 1.3;
          }

          // Language relevance boost
          let langBoost = 1.0;
          if (isHindi && (item.language === 'Hindi' || item.language === 'Bilingual')) {
            langBoost = 1.2;
          }

          const gapScore = gap.gap * priorityWeight * levelMultiplier * cadreBoost * langBoost;
          totalScore += gapScore;

          matchingGaps.push({
            competencyId: gap.competencyId,
            competencyName: gap.competency.name,
            competencyNameHi: gap.competency.name_hi,
            currentLevel: gap.currentLevel,
            targetLevel: gap.targetLevel,
            gap: gap.gap,
          });
        }
      }

      if (matchingGaps.length > 0) {
        const priority: RankedLearningRecommendation['priority'] =
          totalScore >= 140 ? 'HIGH' : totalScore >= 60 ? 'MEDIUM' : 'LOW';

        const primaryGap = matchingGaps[0];
        const enName = primaryGap.competencyName;
        const hiName = primaryGap.competencyNameHi || enName;

        const isResource = item.source_type.includes('manual') || item.source_type.includes('protocol') || item.source_type.includes('compendium');

        const whyRecommended = isResource
          ? `Official MoSPI reference manual providing statutory rules and guidelines to close your ${primaryGap.gap}-level gap in ${enName} (L${primaryGap.currentLevel} → L${primaryGap.targetLevel}).`
          : `Official NSSTA training programme directly targeted to upgrade your proficiency in ${enName} from Level ${primaryGap.currentLevel} to required Level ${primaryGap.targetLevel}.`;

        const whyRecommended_hi = isResource
          ? `${hiName} में आपके ${primaryGap.gap}-स्तर के अंतर (L${primaryGap.currentLevel} → L${primaryGap.targetLevel}) को पाटने के लिए वैधानिक दिशानिर्देश प्रदान करने वाला आधिकारिक MoSPI संदर्भ मैनुअल।`
          : `${hiName} में आपकी दक्षता को स्तर ${primaryGap.currentLevel} से आवश्यक स्तर ${primaryGap.targetLevel} तक उन्नत करने के लिए प्रत्यक्ष आधिकारिक NSSTA प्रशिक्षण कार्यक्रम।`;

        recommendations.push({
          item,
          score: Math.round(totalScore),
          priority,
          whyRecommended,
          whyRecommended_hi,
          matchingGaps,
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Helper to return top N recommendations for competency gaps
   */
  static getRecommendedForGaps(
    gaps: CompetencyGap[],
    limit: number = 4,
    user?: AppUser | null
  ): RankedLearningRecommendation[] {
    return this.rankForGaps(gaps, user).slice(0, limit);
  }
}
