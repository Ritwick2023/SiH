'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  PlayCircle, 
  SlidersHorizontal, 
  Info, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { CompetencyGap } from '@/lib/types';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { LearningCatalogService } from '@/services/learningCatalogService';
import { GAP_PRIORITY_WEIGHTS } from '@/services/competencyService';

interface EnhancedGapCardProps {
  gap: CompetencyGap;
  isHindi: boolean;
  onInspectRubric: (gap: CompetencyGap) => void;
  onSimulateLevelUp: (competencyId: string, targetLevel: number) => void;
}

export function EnhancedGapCard({
  gap,
  isHindi,
  onInspectRubric,
  onSimulateLevelUp,
}: EnhancedGapCardProps) {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  const matchingCourses = useMemo(
    () => LearningCatalogService.getByCompetency(gap.competencyId),
    [gap.competencyId]
  );

  const daysSince = gap.daysSinceAssessment ?? (gap.evidenceType === 'assessment-verified' ? 14 : 90);
  const evidenceWeight = gap.evidenceWeight ?? (gap.evidenceType === 'assessment-verified' ? (daysSince < 30 ? 1.00 : 0.85) : 0.50);
  const decayFactor = gap.decayFactor ?? Number(Math.exp(-0.35 * (daysSince / 180)).toFixed(2));
  const priorityWeight = GAP_PRIORITY_WEIGHTS[gap.priority] ?? 2;
  const bayesianScore = gap.bayesianWeightedScore ?? Number((gap.gap * priorityWeight * evidenceWeight * decayFactor).toFixed(1));

  // Severity color tokens
  const severityBadge = {
    HIGH: {
      bg: 'bg-red-50 border-red-200 text-red-800',
      pill: 'bg-red-600',
      label: isHindi ? 'गंभीर अंतर' : 'Critical Gap',
      scoreColor: 'text-red-700',
    },
    MODERATE: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      pill: 'bg-amber-600',
      label: isHindi ? 'मध्यम अंतर' : 'Moderate Gap',
      scoreColor: 'text-amber-800',
    },
    PROFICIENT: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      pill: 'bg-emerald-600',
      label: isHindi ? 'प्रवीण' : 'Proficient',
      scoreColor: 'text-emerald-700',
    },
  }[gap.severity];

  return (
    <div className="group relative rounded-2xl bg-white p-6 border border-[#D8DFEE] shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden">
      {/* Top indicator bar for high priority */}
      {gap.severity === 'HIGH' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-[#1F273A] tracking-tight">
              {gap.competency.name}
            </h3>
            <ProvenanceBadge provenance={gap.competency.provenance} showLabel={false} size="sm" />
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-[#EDF0F7] text-[#1F273A] border border-[#D8DFEE]">
              {gap.competency.category}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#475569] flex items-center gap-1.5">
            <span className="font-semibold text-[#1F273A]">
              {isHindi ? 'गतिविधि:' : 'Activity:'}
            </span>
            <span>{gap.activity.name}</span>
          </p>
        </div>

        {/* Severity & Score Badge */}
        <div className="flex items-center sm:flex-col sm:items-end gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${severityBadge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${severityBadge.pill}`} />
            {severityBadge.label}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
              onMouseEnter={() => setShowFormulaTooltip(true)}
              onMouseLeave={() => setShowFormulaTooltip(false)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-[#1F273A] cursor-help"
            >
              <span>Score: <strong className={severityBadge.scoreColor}>{bayesianScore}</strong></span>
              <Info className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {showFormulaTooltip && (
              <div className="absolute right-0 top-full mt-1 w-64 p-3 rounded-xl bg-[#1F273A] text-white text-[11px] shadow-xl z-30 border border-slate-700 animate-in fade-in duration-150">
                <div className="font-bold text-[#FFA72F] mb-1">Bayesian Formula Breakdown</div>
                <div className="space-y-0.5 text-slate-200">
                  <div>Gap: {gap.targetLevel} - {gap.currentLevel} = {gap.gap}</div>
                  <div>Priority: W = {priorityWeight} ({gap.priority})</div>
                  <div>Evidence: W = {evidenceWeight.toFixed(2)} ({gap.evidenceType})</div>
                  <div>Freshness Decay: Δ = {decayFactor.toFixed(2)}</div>
                  <div className="border-t border-slate-700 pt-1 mt-1 font-mono text-emerald-400 font-bold">
                    {gap.gap} × {priorityWeight} × {evidenceWeight.toFixed(2)} × {decayFactor.toFixed(2)} = {bayesianScore}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level Progression & Evidence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs mb-4">
        {/* Left: Level Stepper */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="font-semibold text-[#1F273A]">
              {isHindi ? 'दक्षता स्तर:' : 'Competency Level:'}
            </span>
            <span className="font-mono text-xs">
              L{gap.currentLevel} → <strong className="text-[#1C4CA1] font-bold">L{gap.targetLevel}</strong>
            </span>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const isCurrent = lvl === gap.currentLevel;
              const isTarget = lvl === gap.targetLevel;
              const isFilled = lvl <= gap.currentLevel;
              const isInGap = lvl > gap.currentLevel && lvl <= gap.targetLevel;

              let dotClass = 'bg-slate-200';
              if (isCurrent) dotClass = 'bg-[#1C4CA1] ring-2 ring-[#1C4CA1]/30';
              else if (isTarget) dotClass = 'bg-[#FFA72F] ring-2 ring-[#FFA72F]/30';
              else if (isFilled) dotClass = 'bg-emerald-600';
              else if (isInGap) dotClass = 'bg-red-200';

              return (
                <div key={lvl} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className={`h-2 w-full rounded-full transition-all ${dotClass}`} />
                  <span className="text-[10px] text-muted-foreground font-mono font-medium">L{lvl}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Bayesian Evidence & Freshness */}
        <div className="space-y-1.5 sm:border-l sm:border-[#E2E8F0] sm:pl-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1F273A]">
              {isHindi ? 'सत्यापन साक्ष्य:' : 'Verification Evidence:'}
            </span>
            <span className="font-mono text-xs text-[#1F273A]">
              {gap.evidenceType === 'assessment-verified' ? 'Assessment' : 'Self-Reported'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#475569]">
            <span>{isHindi ? 'साक्ष्य भार:' : 'Evidence Weight:'}</span>
            <span className="font-mono font-semibold text-[#1F273A]">{evidenceWeight.toFixed(2)}x</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#475569]">
            <span>{isHindi ? 'नवीनता क्षय:' : 'Freshness Decay:'}</span>
            <span className="font-mono font-semibold text-[#1F273A]">{decayFactor.toFixed(2)} ({daysSince}d ago)</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Inspect Rubric CTA */}
          <button
            type="button"
            onClick={() => onInspectRubric(gap)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#1C4CA1] bg-[#EDF0F7] hover:bg-[#D8DFEE] border border-border transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1C4CA1]" />
            <span>{isHindi ? 'FRAC रूब्रिक देखें (L1-L5)' : 'Inspect FRAC Rubric'}</span>
          </button>

          {/* Simulate Level Up */}
          <button
            type="button"
            onClick={() => onSimulateLevelUp(gap.competencyId, gap.targetLevel)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#475569] bg-white hover:bg-[#F8FAFC] border border-border transition-all cursor-pointer"
            title="Open in What-If Simulator"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{isHindi ? 'सिम्युलेट करें' : 'Simulate'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {gap.severity !== 'PROFICIENT' && (
            <Link
              href={`/assessment?competency=${gap.competencyId}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#1C4CA1] hover:bg-primary-dark rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{isHindi ? 'मूल्यांकन दें' : 'Verify via IRT'}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Inline Recommended MoSPI Courses */}
      {matchingCourses.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#1C4CA1] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#1C4CA1]" />
              <span>{isHindi ? 'अनुशंसित प्रशिक्षण मॉड्यूल' : 'Recommended MoSPI Learning Modules'}</span>
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              {matchingCourses.length} available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {matchingCourses.slice(0, 2).map((course) => (
              <Link
                key={course.id}
                href={`/pathways?courseId=${course.id}`}
                className="group/course flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#1C4CA1]/40 transition-all text-xs"
              >
                <div className="space-y-0.5 truncate pr-2">
                  <div className="font-bold text-[#1F273A] group-hover/course:text-[#1C4CA1] truncate">
                    {course.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                    <span className="font-medium">{course.provider}</span>
                    <span>•</span>
                    <span>{course.duration || 'Self-paced'}</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover/course:text-[#1C4CA1] group-hover/course:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
