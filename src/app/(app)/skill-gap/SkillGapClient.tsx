'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PlayCircle, BookOpen, GraduationCap, ArrowRight, PieChart, Compass } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { RadarDataPoint } from '@/components/RadarChart';
import { LearningCatalogService, type RankedLearningRecommendation } from '@/services/learningCatalogService';
import type { OfficialLearningItem } from '@/data/officialLearningCatalog';
import { FracSunburstHierarchy } from '@/components/charts/FracSunburstHierarchy';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { CompetencyService } from '@/services/competencyService';
import { getPersonaFRAC } from '@/data/fracCadres';
import type { CompetencyGap } from '@/lib/types';
import type { AppUser } from '@/lib/auth';
import { useSafeLocale } from '@/lib/useSafeLocale';

const RadarChart = dynamic(
  () => import('@/components/RadarChart').then((mod) => mod.RadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-64 items-center justify-center">
        <div className="h-48 w-48 rounded-full bg-muted/40 animate-pulse" />
      </div>
    ),
  }
);

interface GapCardProps {
  gap: CompetencyGap;
  isHindi?: boolean;
}

function GapCard({ gap, isHindi }: GapCardProps) {
  const matchingCourses = useMemo(
    () => LearningCatalogService.getByCompetency(gap.competencyId),
    [gap.competencyId]
  );
  const severityPillColors = {
    HIGH: 'text-red-700 bg-red-500/15 border border-red-500/30',
    MODERATE: 'text-amber-700 bg-amber-500/15 border border-amber-500/30',
    PROFICIENT: 'text-emerald-700 bg-emerald-500/15 border border-emerald-500/30',
  };

  return (
    <div className="rounded-2xl bg-white p-6 border border-[#D8DFEE] shadow-xs transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-[#1F273A]">
              {gap.competency.name}
            </h3>
            <ProvenanceBadge provenance={gap.competency.provenance} showLabel={false} size="sm" />
          </div>
          <p className="text-sm text-[#475569] mb-2">
            {isHindi ? 'गतिविधि:' : 'Activity:'} {gap.activity.name}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${severityPillColors[gap.severity]}`}>
            {gap.severity === 'HIGH' && (isHindi ? '🔴 उच्च गंभीरता' : '🔴 Critical')}
            {gap.severity === 'MODERATE' && (isHindi ? '🟡 मध्यम' : '🟡 Moderate')}
            {gap.severity === 'PROFICIENT' && (isHindi ? '🟢 प्रवीण' : '🟢 Proficient')}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 bg-[#EDF0F7]/60 px-4 py-2.5 rounded-xl text-xs border border-[#D8DFEE]">
        <div className="flex items-center gap-3 font-mono">
          <span className="text-[#475569]">{isHindi ? 'वर्तमान:' : 'Current:'} <strong className="text-[#1F273A] font-bold text-sm">L{gap.currentLevel}</strong></span>
          <span className="text-[#94A3B8]">→</span>
          <span className="text-[#475569]">{isHindi ? 'लक्षित:' : 'Target:'} <strong className="text-[#1C4CA1] font-bold text-sm">L{gap.targetLevel}</strong></span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#475569]">
          <span className="capitalize">{isHindi ? 'प्राथमिकता:' : 'Priority:'} <strong className="text-[#1F273A] font-semibold">{gap.priority}</strong></span>
          <span>•</span>
          <span>{isHindi ? 'अंतर स्कोर:' : 'Severity Score:'} <strong className="text-[#1C4CA1] font-bold">{CompetencyService.computeGapSeverity(gap.currentLevel, gap.targetLevel, gap.priority)}</strong></span>
        </div>
      </div>

      <details className="group mb-2">
        <summary className="text-xs font-semibold text-[#1C4CA1] hover:text-[#1164BE] cursor-pointer inline-flex items-center gap-1 select-none">
          <span>{isHindi ? 'यह क्यों महत्वपूर्ण है' : 'Why this matters'}</span>
          <span className="text-[10px] group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <p className="text-xs text-[#475569] leading-relaxed mt-1.5 pl-2 border-l-2 border-[#1C4CA1]/30">
          {gap.evidenceType === 'assessment-verified'
            ? isHindi
              ? `आपके ${gap.activity.name} प्रदर्शन मूल्यांकन ने स्तर ${gap.currentLevel} दर्शाया, जबकि प्रभावी निष्पादन हेतु स्तर ${gap.targetLevel} आवश्यक है।`
              : `Your verified proficiency is Level ${gap.currentLevel}. Cadre duties for ${gap.activity.name} require Level ${gap.targetLevel} for field data consistency.`
            : isHindi
              ? `स्व-मूल्यांकन के आधार पर, स्तर ${gap.targetLevel} की आवश्यकताओं को पूरा करने के लिए ${gap.competency.name} विकसित करना आवश्यक है।`
              : `Self-assessed baseline is Level ${gap.currentLevel}. Take the diagnostic assessment to certify Level ${gap.targetLevel} for ${gap.activity.name}.`
          }
        </p>
      </details>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2 border-t border-[#D8DFEE]">
        <div className="flex items-center gap-2 text-xs text-[#475569]">
          <span className="px-2.5 py-1 rounded-full bg-[#EDF0F7] text-[#1F273A] border border-[#D8DFEE]">
            {gap.evidenceType === 'assessment-verified' ? (
              isHindi ? 'मूल्यांकन-सत्यापित' : 'Assessment-verified'
            ) : (
              isHindi ? 'स्व-मूल्यांकित' : 'Self-assessed'
            )}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#1C4CA1]/10 text-[#1C4CA1] font-medium">
            {gap.competency.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {gap.severity !== 'PROFICIENT' && (
            <>
              <Link
                href={`/pathways?competency=${gap.competencyId}`}
                className="inline-flex items-center gap-1 text-xs text-[#1C4CA1] hover:text-[#1164BE] font-bold"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{isHindi ? 'पाठ्यक्रम' : 'Courses'}</span>
              </Link>
              <Link
                href={`/assessment/${gap.competencyId}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-white bg-[#1C4CA1] hover:bg-[#1164BE] font-bold rounded-xl transition-all shadow-2xs active:scale-[0.98]"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                <span>{isHindi ? 'मूल्यांकन दें' : 'Take Assessment'}</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {matchingCourses.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#D8DFEE]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-[#1C4CA1] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-[#1C4CA1]" />
              <span>Recommended MoSPI Modules</span>
            </span>
            <span className="text-[10px] font-mono text-[#475569]">
              {matchingCourses.length} Curricula
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {matchingCourses.slice(0, 2).map((course: OfficialLearningItem) => (
              <Link
                key={course.id}
                href={`/pathways/${course.id}`}
                className="group flex flex-col justify-between p-3 rounded-xl bg-white border border-[#D8DFEE] hover:border-[#1C4CA1]/50 hover:bg-[#EDF0F7]/30 transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1C4CA1]/10 text-[#1C4CA1]">
                      {course.provider}
                    </span>
                    <span className="text-[10px] font-mono text-[#475569]">
                      Target L{course.targetLevel}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-[#1F273A] group-hover:text-[#1C4CA1] transition-colors line-clamp-1">
                    {course.title}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#D8DFEE]/60 text-[10px]">
                  <span className="text-[#475569]">{course.duration || 'Handbook'}</span>
                  <span className="text-[#1C4CA1] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Study</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface SkillGapClientProps {
  user: AppUser;
}

export default function SkillGapClient({ user }: SkillGapClientProps) {
  const t = useTranslations();
  const locale = useSafeLocale();
  const isHindi = locale === 'hi';
  const [filter, setFilter] = useState<'all' | 'HIGH' | 'MODERATE' | 'PROFICIENT'>('all');
  const [activeViz, setActiveViz] = useState<'radar' | 'sunburst'>('radar');

  const profile = useMemo(() => {
    return getPersonaFRAC(user);
  }, [user]);

  const gaps: CompetencyGap[] = useMemo(() => {
    return profile.competencies.map((comp) => {
      const gap = Math.max(0, comp.targetLevel - comp.currentLevel);
      const severityScore = CompetencyService.computeGapSeverity(comp.currentLevel, comp.targetLevel, comp.priority);
      const severity = CompetencyService.classifySeverity(severityScore);

      return {
        competencyId: comp.id,
        competency: {
          id: comp.id,
          name: isHindi ? comp.name_hi : comp.name,
          name_hi: comp.name_hi,
          category: comp.category,
          description: isHindi ? comp.description_hi : comp.description,
          description_hi: comp.description_hi,
          levels: comp.levels,
          provenance: comp.provenance,
          created_at: new Date().toISOString(),
        },
        activity: {
          id: `act-${comp.id}`,
          name: isHindi ? comp.activityName_hi : comp.activityName,
          name_hi: comp.activityName_hi,
          description: comp.description,
          role_id: profile.personaId,
          provenance: comp.provenance,
          created_at: new Date().toISOString(),
        },
        currentLevel: comp.currentLevel,
        targetLevel: comp.targetLevel,
        gap,
        priority: comp.priority,
        severity,
        evidenceType: comp.evidenceType,
      };
    });
  }, [profile, isHindi]);

  const radarData: RadarDataPoint[] = useMemo(() => {
    return gaps.map((gap: CompetencyGap) => ({
      label: gap.competency.name.length > 20
        ? gap.competency.name.substring(0, 18) + '…'
        : gap.competency.name,
      labelHi: gap.competency.name_hi,
      current: gap.currentLevel,
      target: gap.targetLevel,
    }));
  }, [gaps]);

  const topRecommendations: RankedLearningRecommendation[] = useMemo(() => {
    return LearningCatalogService.getRecommendedForGaps(gaps, 4, user);
  }, [gaps, user]);

  const severityCounts = useMemo(() => ({
    HIGH: gaps.filter((g: CompetencyGap) => g.severity === 'HIGH').length,
    MODERATE: gaps.filter((g: CompetencyGap) => g.severity === 'MODERATE').length,
    PROFICIENT: gaps.filter((g: CompetencyGap) => g.severity === 'PROFICIENT').length,
  }), [gaps]);

  const filteredGaps = useMemo(() => {
    return filter === 'all' ? gaps : gaps.filter((gap: CompetencyGap) => gap.severity === filter);
  }, [gaps, filter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
            Cadre: {profile.cadre}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FFA72F]/15 text-[#1F273A] border border-[#FFA72F]/30">
            MoSPI FRAC Framework
          </span>
        </div>
        <h1 className="text-3xl font-black text-[#1F273A] tracking-tight">
          {t('skillGap.title')}
        </h1>
        <p className="text-[#475569] max-w-3xl">
          {t('skillGap.subtitle')}
        </p>
      </div>

      {/* Visualization Card with View Toggle */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#D8DFEE] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D8DFEE]">
          <div>
            <h2 className="text-lg font-bold text-[#1F273A]">
              {activeViz === 'radar'
                ? isHindi
                  ? 'दक्षता रडार — वर्तमान बनाम अपेक्षित स्तर'
                  : 'Competency Radar — Current vs Required Levels'
                : isHindi
                  ? 'D3.js FRAC श्रेणीबद्ध सनबर्स्ट पदानुक्रम'
                  : 'D3.js Interactive FRAC Sunburst Competency Hierarchy'}
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              {activeViz === 'radar'
                ? 'Spider graph comparing 5-level proficiency baseline to MoSPI cadre mandate'
                : 'Multi-tiered structural partition of Domain, Behavioral, and Functional competencies'}
            </p>
          </div>

          {/* Viz Toggle Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveViz('radar')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViz === 'radar'
                  ? 'bg-[#1C4CA1] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#1F273A]'
              }`}
            >
              <PieChart className="h-3.5 w-3.5" />
              <span>Radar Chart</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveViz('sunburst')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeViz === 'sunburst'
                  ? 'bg-[#1C4CA1] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#1F273A]'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>D3 Sunburst Hierarchy</span>
            </button>
          </div>
        </div>

        {activeViz === 'radar' ? (
          <div className="flex justify-center py-2">
            <RadarChart data={radarData} size={450} showLegend />
          </div>
        ) : (
          <div className="py-2">
            <FracSunburstHierarchy />
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="rounded-3xl bg-white p-4 border border-[#D8DFEE] shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#475569]">
            {isHindi ? 'गंभीरता अनुसार फ़िल्टर करें:' : 'Filter by severity:'}
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#1C4CA1] text-white shadow-2xs'
                : 'bg-[#EDF0F7] text-[#475569] hover:bg-[#D8DFEE]'
            }`}
          >
            {isHindi ? 'सभी' : 'All'} ({gaps.length})
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'HIGH'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            {isHindi ? '🔴 उच्च गंभीरता' : '🔴 High'} ({severityCounts.HIGH})
          </button>
          <button
            onClick={() => setFilter('MODERATE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'MODERATE'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            {isHindi ? '🟡 मध्यम' : '🟡 Moderate'} ({severityCounts.MODERATE})
          </button>
          <button
            onClick={() => setFilter('PROFICIENT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'PROFICIENT'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {isHindi ? '🟢 प्रवीण' : '🟢 Proficient'} ({severityCounts.PROFICIENT})
          </button>
        </div>
      </div>

      {/* Gap Cards */}
      <div className="space-y-4">
        {filteredGaps.map((gap) => (
          <GapCard key={gap.competencyId} gap={gap} isHindi={isHindi} />
        ))}
      </div>

      {/* Empty State */}
      {filteredGaps.length === 0 && (
        <div className="text-center py-12 rounded-3xl bg-white border border-[#D8DFEE] shadow-xs">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-bold text-[#1F273A] mb-2">
            {isHindi ? 'इस श्रेणी में कोई कमी नहीं है' : 'No gaps in this category'}
          </h3>
          <p className="text-[#475569]">
            {isHindi
              ? 'इस फ़िल्टर के लिए सभी दक्षताएं लक्षित स्तर पर या उससे अधिक हैं।'
              : 'All competencies are at or above target level for this filter.'}
          </p>
        </div>
      )}

      {/* Recommended Government Courses to Bridge All Gaps */}
      {topRecommendations.length > 0 && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs space-y-5 border border-[#D8DFEE]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8DFEE]">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-[#1C4CA1]/10 text-[#1C4CA1] flex items-center justify-center">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1F273A]">
                  Recommended Government Courses &amp; Modules
                </h2>
              </div>
              <p className="text-xs text-[#475569] mt-1">
                Official curricula from NSSTA &amp; MoSPI prioritized by your critical competency gaps
              </p>
            </div>
            <Link
              href="/pathways"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-colors shrink-0 shadow-2xs"
            >
              <span>Explore All 10 Courses</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topRecommendations.map(({ item, whyRecommended }: RankedLearningRecommendation) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#EDF0F7]/40 border border-[#D8DFEE] flex flex-col justify-between hover:border-[#1C4CA1]/40 hover:bg-white transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1C4CA1]/10 text-[#1C4CA1]">
                      {item.provider}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#1C4CA1]">
                      Target L{item.targetLevel} • {item.difficulty}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1F273A] line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#475569] line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-[#D8DFEE] text-[11px] text-[#1C4CA1] font-medium mb-3">
                    <strong>Why Recommended:</strong> {whyRecommended}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#D8DFEE] text-xs">
                  <span className="text-[#475569] text-[11px]">
                    {item.duration || 'Official Publication'} • {item.content_type}
                  </span>
                  <Link
                    href={`/pathways/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-colors"
                  >
                    <span>View Course</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
