'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight, 
  ChevronRight
} from 'lucide-react';
import { CompetencyGap } from '@/lib/types';
import { LearningCatalogService } from '@/services/learningCatalogService';

interface RemediationRoadmapProps {
  gaps: CompetencyGap[];
  simulatedOverrides?: Record<string, number>;
  userId: string;
  isHindi: boolean;
}

export function RemediationRoadmap({
  gaps,
  simulatedOverrides,
  userId,
  isHindi,
}: RemediationRoadmapProps) {
  const t = useTranslations('skillGap');
  const storageKey = `statvidya_roadmap_completed_${userId}`;

  // Persistent milestone completion map: milestoneId -> boolean
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(`statvidya_roadmap_completed_${userId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [prevStorageKey, setPrevStorageKey] = useState(storageKey);

  // Synchronize storage key changes during render without cascading effect triggers
  if (storageKey !== prevStorageKey) {
    setPrevStorageKey(storageKey);
    let updatedVal: Record<string, boolean> = {};
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) updatedVal = JSON.parse(stored);
      } catch {
        // Local storage unavailable
      }
    }
    setCompletedMilestones(updatedVal);
  }

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // Local storage unavailable
      }
      return updated;
    });
  };

  const { phase1Gaps, phase2Gaps, phase3Gaps } = useMemo(() => {
    const p1: CompetencyGap[] = [];
    const p2: CompetencyGap[] = [];
    const p3: CompetencyGap[] = [];

    gaps.forEach((gap) => {
      const override = simulatedOverrides?.[gap.competencyId];
      const effectiveTarget = override ?? gap.targetLevel;
      const effectiveGap = Math.max(0, effectiveTarget - gap.currentLevel);

      if (gap.severity === 'HIGH' || effectiveGap >= 2) {
        p1.push(gap);
      } else if (gap.severity === 'MODERATE' || effectiveGap === 1) {
        p2.push(gap);
      } else {
        p3.push(gap);
      }
    });

    if (p1.length === 0 && gaps.length > 0) p1.push(gaps[0]);
    if (p2.length === 0 && gaps.length > 1) p2.push(gaps[1]);
    if (p3.length === 0 && gaps.length > 2) p3.push(gaps[2]);

    return { phase1Gaps: p1, phase2Gaps: p2, phase3Gaps: p3 };
  }, [gaps, simulatedOverrides]);

  const totalMilestones = phase1Gaps.length + phase2Gaps.length + phase3Gaps.length;
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

  const renderMilestoneCard = (gap: CompetencyGap, phaseNumber: number) => {
    const milestoneId = `phase${phaseNumber}-${gap.competencyId}`;
    const isCompleted = !!completedMilestones[milestoneId];
    const courses = LearningCatalogService.getByCompetency(gap.competencyId);
    const topCourse = courses[0];
    const targetLvl = simulatedOverrides?.[gap.competencyId] ?? gap.targetLevel;
    const estHours = (targetLvl - gap.currentLevel) * 4 || 6;

    return (
      <div
        key={milestoneId}
        className={`p-4 rounded-2xl border transition-all min-w-0 overflow-hidden ${
          isCompleted
            ? 'bg-emerald-50/50 border-emerald-300'
            : 'bg-[#F8FAFC] border-[#E2E8F0] shadow-2xs hover:border-[#1C4CA1]/30 hover:bg-white'
        }`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={() => toggleMilestone(milestoneId)}
            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
            title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 space-y-2 min-w-0">
            <div>
              <h4 className={`text-sm font-bold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-[#1F273A]'}`} title={gap.competency.name}>
                {(isHindi && gap.competency.name_hi) ? gap.competency.name_hi : gap.competency.name}
              </h4>

              <div className="flex items-center gap-2 text-xs text-[#475569] mt-1">
                <span className="font-bold text-[#1C4CA1]">
                  L{gap.currentLevel} → L{targetLvl}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" />
                  ~{estHours} hrs
                </span>
              </div>
            </div>

            {/* Official Course Preview */}
            {topCourse && (
              <div className="p-3 rounded-xl bg-white border border-[#D8DFEE] text-xs space-y-1.5 min-w-0 overflow-hidden">
                <div className="font-bold text-[#1F273A] truncate" title={topCourse.title}>
                  {topCourse.title}
                </div>
                <div className="flex items-center justify-between gap-2 text-[11px] min-w-0">
                  <span className="text-muted-foreground font-medium truncate flex-1 min-w-0" title={topCourse.provider}>
                    {topCourse.provider}
                  </span>
                  <Link
                    href={`/pathways?courseId=${topCourse.id}`}
                    className="inline-flex items-center gap-1 font-bold text-[#1C4CA1] hover:underline shrink-0"
                  >
                    <span>{isHindi ? 'मॉड्यूल शुरू करें' : 'Start Module'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Assessment Link */}
            <div className="pt-1 flex items-center justify-end">
              <Link
                href={`/assessment?competency=${gap.competencyId}`}
                className="text-[11px] font-semibold text-muted-foreground hover:text-[#1C4CA1] inline-flex items-center gap-1"
              >
                <span>{isHindi ? 'मूल्यांकन द्वारा सत्यापित करें' : 'Verify via Assessment'}</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress */}
      <div className="rounded-3xl bg-white p-6 sm:p-7 border border-[#D8DFEE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F273A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1C4CA1]" />
              {t('roadmap.title')}
            </h2>
            <p className="text-xs text-[#475569]">
              {t('roadmap.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#1F273A] bg-[#EDF0F7] px-3.5 py-1.5 rounded-xl border border-[#D8DFEE]">
              {t('roadmap.overallProgress', { completed: completedCount, total: totalMilestones })}
            </span>
            <span className="text-xs font-mono font-extrabold text-[#1C4CA1]">
              Day 14 of 90
            </span>
          </div>
        </div>

        {/* 90-Day Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#1C4CA1] via-[#FFA72F] to-emerald-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
            <span>Day 1 (Urgent)</span>
            <span>Day 30 (Applied)</span>
            <span>Day 60 (Supervisory)</span>
            <span>Day 90 (APAR Ready)</span>
          </div>
        </div>
      </div>

      {/* 3-Column Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phase 1 (Days 1–30) — Urgent Remediation */}
        <div className="rounded-3xl bg-white p-5 border border-[#D8DFEE] shadow-xs space-y-4 min-w-0">
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                {t('roadmap.phase1Title')}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                {t('roadmap.phase1Range')}
              </span>
            </div>
            <p className="text-[11px] text-red-800 font-medium">
              {t('roadmap.phase1Desc')}
            </p>
          </div>

          <div className="space-y-3 min-w-0">
            {phase1Gaps.map((gap) => renderMilestoneCard(gap, 1))}
          </div>
        </div>

        {/* Phase 2 (Days 31–60) — Applied Field Proficiency */}
        <div className="rounded-3xl bg-white p-5 border border-[#D8DFEE] shadow-xs space-y-4 min-w-0">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                {t('roadmap.phase2Title')}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                {t('roadmap.phase2Range')}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 font-medium">
              {t('roadmap.phase2Desc')}
            </p>
          </div>

          <div className="space-y-3 min-w-0">
            {phase2Gaps.map((gap) => renderMilestoneCard(gap, 2))}
          </div>
        </div>

        {/* Phase 3 (Days 61–90) — Supervisory & Capstone */}
        <div className="rounded-3xl bg-white p-5 border border-[#D8DFEE] shadow-xs space-y-4 min-w-0">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                {t('roadmap.phase3Title')}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                {t('roadmap.phase3Range')}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">
              {t('roadmap.phase3Desc')}
            </p>
          </div>

          <div className="space-y-3">
            {phase3Gaps.map((gap) => renderMilestoneCard(gap, 3))}
          </div>
        </div>
      </div>
    </div>
  );
}
