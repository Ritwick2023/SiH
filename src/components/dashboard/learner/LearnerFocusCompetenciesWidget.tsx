'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight } from 'lucide-react';
import type { FRACCompetencyDef } from '@/data/fracCadres';

interface LearnerFocusCompetenciesWidgetProps {
  competencies?: FRACCompetencyDef[];
  onBridgeGap?: (competencyId: string) => void;
  isHindi?: boolean;
}

export function LearnerFocusCompetenciesWidget({
  competencies = [],
  onBridgeGap,
  isHindi = false,
}: LearnerFocusCompetenciesWidgetProps) {
  const cardTitle = isHindi ? 'सुधार हेतु प्राथमिकता योग्यताएँ' : 'Priority Competencies to Level Up';
  const viewAllText = isHindi ? 'सभी देखें →' : 'View All →';
  const bridgeGapText = isHindi ? 'कौशल अंतर दूर करें' : 'Bridge Gap';

  // Filter for competencies with gaps (target > current), prioritizing critical/important
  const focusList = competencies
    .filter((c) => c.currentLevel < c.targetLevel)
    .sort((a, b) => {
      const gapA = a.targetLevel - a.currentLevel;
      const gapB = b.targetLevel - b.currentLevel;
      return gapB - gapA;
    })
    .slice(0, 2);

  // Fallback if all targets are met
  const items = focusList.length > 0 ? focusList : competencies.slice(0, 2);

  return (
    <div className="rounded-2xl bg-white border border-[#D8DFEE] p-5 shadow-xs flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C4CA1]/10 text-[#1C4CA1]">
            <Target className="h-4 w-4" />
          </div>
          <h3 className="font-extrabold text-sm text-[#1F273A] tracking-tight">
            {cardTitle}
          </h3>
        </div>
        <Link
          href="/skill-gap"
          prefetch={true}
          className="text-xs font-bold text-[#1C4CA1] hover:text-[#1164BE] hover:underline transition-colors flex items-center gap-1"
        >
          {viewAllText}
        </Link>
      </div>

      {/* Competencies Mini Rows */}
      <div className="space-y-3">
        {items.map((comp) => {
          const percent = Math.min(100, Math.round((comp.currentLevel / Math.max(1, comp.targetLevel)) * 100));
          const compName = isHindi && comp.name_hi ? comp.name_hi : comp.name;

          return (
            <div
              key={comp.id}
              className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#1F273A] truncate flex-1" title={compName}>
                  {compName}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-600 shrink-0">
                  L{comp.currentLevel} <span className="text-slate-400">/</span> L{comp.targetLevel}
                </span>
              </div>

              {/* Progress Bar + Bridge CTA Row */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1C4CA1] transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onBridgeGap?.(comp.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1C4CA1] hover:text-white bg-[#1C4CA1]/10 hover:bg-[#1C4CA1] px-2 py-0.5 rounded-md transition-all cursor-pointer shrink-0"
                >
                  <span>{bridgeGapText}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LearnerFocusCompetenciesWidget;
