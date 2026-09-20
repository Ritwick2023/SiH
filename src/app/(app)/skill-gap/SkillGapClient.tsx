'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  BarChart3, 
  SlidersHorizontal, 
  Calendar, 
  PieChart, 
  Compass, 
  Search, 
  GraduationCap, 
  ArrowRight
} from 'lucide-react';

import type { RadarDataPoint } from '@/components/RadarChart';
import { FracSunburstHierarchy } from '@/components/charts/FracSunburstHierarchy';
import { computeBayesianWeightedGap, computeWeightedReadinessIndex, classifySeverity } from '@/services/competencyService';
import { getPersonaFRAC } from '@/data/fracCadres';
import type { CompetencyGap } from '@/lib/types';
import type { AppUser } from '@/lib/auth';
import { useSafeLocale } from '@/lib/useSafeLocale';
import { LearningCatalogService, type RankedLearningRecommendation } from '@/services/learningCatalogService';

import { ReadinessHeroBento } from '@/components/skill-gap/ReadinessHeroBento';
import { EnhancedGapCard } from '@/components/skill-gap/EnhancedGapCard';
import { CompetencyRubricModal } from '@/components/skill-gap/CompetencyRubricModal';
import { SkillGapSimulator } from '@/components/skill-gap/SkillGapSimulator';
import { RemediationRoadmap } from '@/components/skill-gap/RemediationRoadmap';
import { CadreBenchmarkSelector } from '@/components/skill-gap/CadreBenchmarkSelector';

const RadarChart = dynamic(
  () => import('@/components/RadarChart').then((mod) => mod.RadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-64 items-center justify-center">
        <div className="h-48 w-48 rounded-full bg-slate-100 animate-pulse" />
      </div>
    ),
  }
);

interface SkillGapClientProps {
  user: AppUser;
}

export default function SkillGapClient({ user }: SkillGapClientProps) {
  const t = useTranslations('skillGap');
  const locale = useSafeLocale();
  const isHindi = locale === 'hi';

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'roadmap'>('overview');

  // Active Cadre Benchmark
  const [selectedCadre, setSelectedCadre] = useState<string>(() => {
    if (user?.email?.toLowerCase().includes('sunita')) return 'demo-sunita';
    if (user?.email?.toLowerCase().includes('priya')) return 'demo-priya';
    return 'demo-amit';
  });

  // Visualization sub-view in Overview tab
  const [activeViz, setActiveViz] = useState<'radar' | 'sunburst'>('radar');

  // Filter & Search states
  const [severityFilter, setSeverityFilter] = useState<'all' | 'HIGH' | 'MODERATE' | 'PROFICIENT'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'severity' | 'gap' | 'name'>('severity');

  // Modal & Focus States
  const [inspectingGap, setInspectingGap] = useState<CompetencyGap | null>(null);
  const [simulatorFocusedId, setSimulatorFocusedId] = useState<string | null>(null);
  const [simulatedPlanOverrides, setSimulatedPlanOverrides] = useState<Record<string, number>>({});

  // Active Cadre Profile
  const profile = useMemo(() => {
    return getPersonaFRAC(selectedCadre);
  }, [selectedCadre]);

  // Bayesian Evidence-Weighted Gaps
  const gaps: CompetencyGap[] = useMemo(() => {
    return profile.competencies.map((comp) => {
      const gapSize = Math.max(0, comp.targetLevel - comp.currentLevel);
      const daysSince = comp.evidenceType === 'assessment-verified' ? 14 : 90;
      const bayesianScore = computeBayesianWeightedGap(
        comp.currentLevel,
        comp.targetLevel,
        comp.priority,
        {
          evidenceType: comp.evidenceType,
          daysSinceAssessment: daysSince,
        }
      );
      const severity = classifySeverity(bayesianScore);
      const evidenceWeight = comp.evidenceType === 'assessment-verified' ? (daysSince < 30 ? 1.00 : 0.85) : 0.50;
      const decayFactor = Number(Math.exp(-0.35 * (daysSince / 180)).toFixed(2));

      return {
        competencyId: comp.id,
        competency: {
          id: comp.id,
          name: isHindi && comp.name_hi ? comp.name_hi : comp.name,
          name_hi: comp.name_hi,
          category: comp.category,
          description: isHindi && comp.description_hi ? comp.description_hi : comp.description,
          description_hi: comp.description_hi,
          levels: comp.levels,
          provenance: comp.provenance,
          created_at: new Date().toISOString(),
        },
        activity: {
          id: `act-${comp.id}`,
          name: isHindi && comp.activityName_hi ? comp.activityName_hi : comp.activityName,
          name_hi: comp.activityName_hi,
          description: comp.description,
          role_id: profile.personaId,
          provenance: comp.provenance,
          created_at: new Date().toISOString(),
        },
        currentLevel: comp.currentLevel,
        targetLevel: comp.targetLevel,
        gap: gapSize,
        priority: comp.priority,
        severity,
        evidenceType: comp.evidenceType,
        bayesianWeightedScore: bayesianScore,
        evidenceWeight,
        decayFactor,
        daysSinceAssessment: daysSince,
      };
    });
  }, [profile, isHindi]);

  // Priority-Weighted Readiness Index
  const weightedReadiness = useMemo(() => {
    const required = gaps.map((g) => ({
      competencyId: g.competencyId,
      targetLevel: g.targetLevel,
      priority: g.priority,
    }));
    const levelsMap = new Map<string, number>();
    const evMap = new Map<string, { evidenceType?: string; daysSinceAssessment?: number }>();
    gaps.forEach((g) => {
      levelsMap.set(g.competencyId, g.currentLevel);
      evMap.set(g.competencyId, {
        evidenceType: g.evidenceType,
        daysSinceAssessment: g.daysSinceAssessment,
      });
    });
    return computeWeightedReadinessIndex(required, levelsMap, evMap);
  }, [gaps]);

  // Counts & Summaries
  const severityCounts = useMemo(() => ({
    HIGH: gaps.filter((g) => g.severity === 'HIGH').length,
    MODERATE: gaps.filter((g) => g.severity === 'MODERATE').length,
    PROFICIENT: gaps.filter((g) => g.severity === 'PROFICIENT').length,
  }), [gaps]);

  const verifiedCount = useMemo(
    () => gaps.filter((g) => g.evidenceType === 'assessment-verified').length,
    [gaps]
  );
  const selfReportedCount = gaps.length - verifiedCount;

  // Filtered & Sorted Gaps for Overview tab
  const filteredGaps = useMemo(() => {
    let list = [...gaps];

    // Severity Filter
    if (severityFilter !== 'all') {
      list = list.filter((g) => g.severity === severityFilter);
    }

    // Category Filter
    if (categoryFilter !== 'all') {
      list = list.filter((g) => g.competency.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (g) =>
          g.competency.name.toLowerCase().includes(q) ||
          g.activity.name.toLowerCase().includes(q) ||
          g.competencyId.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'severity') {
        return (b.bayesianWeightedScore ?? 0) - (a.bayesianWeightedScore ?? 0);
      }
      if (sortBy === 'gap') {
        return b.gap - a.gap;
      }
      return a.competency.name.localeCompare(b.competency.name);
    });

    return list;
  }, [gaps, severityFilter, categoryFilter, searchQuery, sortBy]);

  // Radar chart data points
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

  // Top course recommendations
  const topRecommendations: RankedLearningRecommendation[] = useMemo(() => {
    return LearningCatalogService.getRecommendedForGaps(gaps, 4, user);
  }, [gaps, user]);

  // Interactivity Handlers
  const handleInspectRubric = (gap: CompetencyGap) => {
    setInspectingGap(gap);
  };

  const handleSimulateLevelUp = (competencyId: string, targetLevel: number) => {
    setSimulatorFocusedId(competencyId);
    setActiveTab('simulator');
  };

  const handleGeneratePlanFromSimulator = (simulatedLevels: Record<string, number>) => {
    setSimulatedPlanOverrides(simulatedLevels);
    setActiveTab('roadmap');
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* 1. Readiness Hero Bento Grid */}
      <ReadinessHeroBento
        weightedReadiness={weightedReadiness}
        criticalCount={severityCounts.HIGH}
        moderateCount={severityCounts.MODERATE}
        proficientCount={severityCounts.PROFICIENT}
        verifiedCount={verifiedCount}
        selfReportedCount={selfReportedCount}
        totalCompetencies={gaps.length}
        cadreName={profile.cadre}
        designationName={isHindi && profile.designation_hi ? profile.designation_hi : profile.designation}
        promotionThreshold={80}
        activeSeverityFilter={severityFilter}
        onFilterChange={setSeverityFilter}
        isHindi={isHindi}
      />

      {/* 2. Cross-Cadre Mobility Benchmark Selector */}
      <CadreBenchmarkSelector
        selectedCadre={selectedCadre}
        onSelectCadre={setSelectedCadre}
        isHindi={isHindi}
      />

      {/* 3. Primary Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] max-w-xl mx-auto sm:mx-0 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-[#1C4CA1] shadow-xs border border-[#D8DFEE]'
              : 'text-[#475569] hover:text-[#1F273A]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t('tabs.overview')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-white text-[#1C4CA1] shadow-xs border border-[#D8DFEE]'
              : 'text-[#475569] hover:text-[#1F273A]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t('tabs.simulator')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'roadmap'
              ? 'bg-white text-[#1C4CA1] shadow-xs border border-[#D8DFEE]'
              : 'text-[#475569] hover:text-[#1F273A]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t('tabs.roadmap')}</span>
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB A: Overview & Visualizations */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Visualization Container */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#D8DFEE] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-lg font-bold text-[#1F273A]">
                  {activeViz === 'radar'
                    ? (isHindi ? 'दक्षता रडार — वर्तमान बनाम लक्षित स्तर' : 'Competency Radar — Baseline vs Mandate')
                    : (isHindi ? 'D3.js FRAC श्रेणीबद्ध सनबर्स्ट पदानुक्रम' : 'D3.js Zoomable FRAC Sunburst Hierarchy')}
                </h2>
                <p className="text-xs text-[#475569] mt-0.5">
                  {activeViz === 'radar'
                    ? (isHindi ? '5-स्तरीय मानक के विरुद्ध आपकी दक्षताओं का तुलनात्मक स्पाइडर आरेख' : 'Multi-axis radar comparing your baseline against MoSPI cadre standards')
                    : (isHindi ? 'कार्यक्षेत्र, कार्यात्मक एवं व्यवहारिक दक्षताओं का संवादात्मक विभाजन' : 'Interactive multi-tiered partition of Domain, Functional, and Behavioural competencies')}
                </p>
              </div>

              {/* Viz Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] shrink-0">
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
                  <span>D3 Sunburst</span>
                </button>
              </div>
            </div>

            {activeViz === 'radar' ? (
              <div className="flex justify-center py-2">
                <RadarChart data={radarData} size={420} showLegend />
              </div>
            ) : (
              <div className="py-2">
                <FracSunburstHierarchy />
              </div>
            )}
          </div>

          {/* Search, Filter & Sort Toolbar */}
          <div className="rounded-2xl bg-white p-4 border border-[#D8DFEE] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('filters.searchPlaceholder')}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-border text-[#1F273A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1C4CA1]/20 focus:border-[#1C4CA1]"
              />
            </div>

            {/* Category Dropdown & Sort Dropdown */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-border text-[#1F273A] focus:outline-none focus:ring-2 focus:ring-[#1C4CA1]/20"
              >
                <option value="all">All Categories</option>
                <option value="domain">Domain</option>
                <option value="functional">Functional</option>
                <option value="behavioural">Behavioural</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'severity' | 'gap' | 'name')}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F8FAFC] border border-border text-[#1F273A] focus:outline-none focus:ring-2 focus:ring-[#1C4CA1]/20"
              >
                <option value="severity">{t('filters.sortSeverity')}</option>
                <option value="gap">{t('filters.sortGap')}</option>
                <option value="name">{t('filters.sortName')}</option>
              </select>
            </div>
          </div>

          {/* Enhanced Gap Cards List */}
          <div className="space-y-4">
            {filteredGaps.map((gap) => (
              <EnhancedGapCard
                key={gap.competencyId}
                gap={gap}
                isHindi={isHindi}
                onInspectRubric={handleInspectRubric}
                onSimulateLevelUp={handleSimulateLevelUp}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredGaps.length === 0 && (
            <div className="text-center py-12 rounded-3xl bg-white border border-[#D8DFEE] shadow-xs">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-base font-bold text-[#1F273A] mb-1">
                {isHindi ? 'इस फ़िल्टर में कोई अंतर नहीं मिला' : 'No competency gaps in this filter'}
              </h3>
              <p className="text-xs text-[#475569] max-w-sm mx-auto">
                {isHindi
                  ? 'सभी संबंधित दक्षताएं आपके चयनित मापदंडों पर खरी उतरती हैं।'
                  : 'All competencies meet or exceed targets under the selected filter criteria.'}
              </p>
            </div>
          )}

          {/* Recommended Government Courses Section */}
          {topRecommendations.length > 0 && (
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs space-y-5 border border-[#D8DFEE]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-[#1C4CA1]/10 text-[#1C4CA1] flex items-center justify-center">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#1F273A]">
                      Recommended MoSPI &amp; NSSTA Learning Modules
                    </h2>
                  </div>
                  <p className="text-xs text-[#475569] mt-1">
                    Multi-signal recommended curricula aligned with your Bayesian critical gaps
                  </p>
                </div>

                <Link
                  href="/pathways"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-primary-dark transition-colors shrink-0 shadow-xs"
                >
                  <span>Explore All Pathways</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topRecommendations.map(({ item, whyRecommended }: RankedLearningRecommendation) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#D8DFEE] flex flex-col justify-between hover:border-[#1C4CA1]/40 hover:bg-white transition-all shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
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
                      <div className="p-2.5 rounded-xl bg-white border border-[#D8DFEE] text-[11px] text-[#1C4CA1] font-semibold mb-3">
                        <strong>Why Recommended:</strong> {whyRecommended}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
                      <span className="text-muted-foreground text-[11px]">
                        {item.duration || 'Official Manual'} • {item.content_type}
                      </span>
                      <Link
                        href={`/pathways?courseId=${item.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-primary-dark transition-colors"
                      >
                        <span>View Module</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB B: What-If Simulator Sandbox */}
      {activeTab === 'simulator' && (
        <SkillGapSimulator
          gaps={gaps}
          onGeneratePlan={handleGeneratePlanFromSimulator}
          isHindi={isHindi}
          focusedCompetencyId={simulatorFocusedId}
        />
      )}

      {/* TAB C: 30/60/90-Day Remediation Roadmap */}
      {activeTab === 'roadmap' && (
        <RemediationRoadmap
          gaps={gaps}
          simulatedOverrides={simulatedPlanOverrides}
          userId={user?.id || 'demo-official'}
          isHindi={isHindi}
        />
      )}

      {/* 5. Competency Rubric Modal (Full L1–L5 Behavioral Descriptions) */}
      <CompetencyRubricModal
        gap={inspectingGap}
        isOpen={!!inspectingGap}
        onClose={() => setInspectingGap(null)}
        onSimulateLevel={(compId, lvl) => {
          setInspectingGap(null);
          setSimulatorFocusedId(compId);
          setActiveTab('simulator');
        }}
      />
    </div>
  );
}
