'use client';

import React from 'react';
import { TrendingUp, BookOpen } from 'lucide-react';

interface LearnerKpiStripProps {
  readinessIndex: number;
  activeModulesCount: number;
  verifiedSkillsCount: number;
  totalSkillsCount: number;
  drillsCompleted: number;
  trainingHours: number;
  isHindi?: boolean;
  onSelectTab?: (tab: string) => void;
}

export function LearnerKpiStrip({
  readinessIndex,
  activeModulesCount,
  isHindi = false,
}: LearnerKpiStripProps) {
  const nextCourseLabel = isHindi
    ? 'अगला अनुशंसित पाठ्यक्रम'
    : 'Next Recommended Course';
  const nextCourseValue = isHindi ? 'सर्वेक्षण डेटा संग्रह' : 'Survey Data Collection';
  const nextCourseSubtext = isHindi ? 'iGOT कर्मयोगी पर उपलब्ध' : 'Available on iGOT Karmayogi';

  const progressLabel = isHindi ? 'आपकी कुल प्रगति' : 'Your Overall Progress';
  const progressSubtext =
    readinessIndex >= 70
      ? isHindi
        ? 'बढ़िया! लक्ष्य पर हैं'
        : 'Great! You are on track'
      : isHindi
        ? 'कुछ क्षेत्रों में ध्यान दें'
        : 'A few areas need attention';

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {/* Card 1: Overall Progress */}
      <div className="rounded-2xl bg-white border border-[#D8DFEE] p-4 shadow-xs flex items-center gap-3.5">
        <div className="h-11 w-11 rounded-2xl bg-[#1C4CA1]/10 flex items-center justify-center shrink-0">
          <TrendingUp className="h-5 w-5 text-[#1C4CA1]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-muted-foreground truncate leading-tight">
            {progressLabel}
          </p>
          <p className="text-2xl font-extrabold text-[#1F273A] tracking-tight mt-0.5 font-mono tabular-nums">
            {readinessIndex}%
          </p>
          <p className="text-[10px] font-medium text-muted-foreground/80 truncate">
            {progressSubtext}
          </p>
        </div>
      </div>

      {/* Card 2: Next Recommended Course */}
      <div className="rounded-2xl bg-white border border-[#D8DFEE] p-4 shadow-xs flex items-center gap-3.5">
        <div className="h-11 w-11 rounded-2xl bg-[#F9EAC1] flex items-center justify-center shrink-0">
          <BookOpen className="h-5 w-5 text-[#D97706]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-muted-foreground truncate leading-tight">
            {nextCourseLabel}
          </p>
          <p className="text-sm font-extrabold text-[#1F273A] tracking-tight mt-0.5 truncate">
            {nextCourseValue}
          </p>
          <p className="text-[10px] font-medium text-muted-foreground/80 truncate">
            {nextCourseSubtext}
          </p>
        </div>
      </div>
    </section>
  );
}
