'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Award, 
  Printer 
} from 'lucide-react';

interface ReadinessHeroBentoProps {
  weightedReadiness: number;
  criticalCount: number;
  moderateCount: number;
  proficientCount: number;
  verifiedCount: number;
  selfReportedCount: number;
  totalCompetencies: number;
  cadreName: string;
  designationName: string;
  promotionThreshold?: number;
  activeSeverityFilter: string;
  onFilterChange: (severity: 'all' | 'HIGH' | 'MODERATE' | 'PROFICIENT') => void;
  isHindi: boolean;
}

export function ReadinessHeroBento({
  weightedReadiness,
  criticalCount,
  moderateCount,
  proficientCount,
  verifiedCount,
  selfReportedCount,
  totalCompetencies,
  cadreName,
  designationName,
  promotionThreshold = 80,
  activeSeverityFilter,
  onFilterChange,
  isHindi,
}: ReadinessHeroBentoProps) {
  const t = useTranslations('skillGap');

  // Gauge calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (weightedReadiness / 100) * circumference;

  const meetsThreshold = weightedReadiness >= promotionThreshold;

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-4 mb-6">
      {/* Top Banner / Hero Card */}
      <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFA72F]/15 text-[#92400E] border border-[#FFA72F]/30">
                <Award className="w-3.5 h-3.5 text-[#B45309]" />
                <span>{isHindi ? 'मिशन कर्मयोगी FRAC संरेखित' : 'Mission Karmayogi FRAC Aligned'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF0F7] text-[#1F273A] border border-[#D8DFEE]">
                {cadreName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F273A]">
              {t('title')}
            </h1>

            <p className="text-sm text-[#475569] max-w-2xl leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Dossier Print Button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handlePrintDossier}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#F8FAFC] hover:bg-[#EDF0F7] text-[#1F273A] border border-border transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
              title="Print official APAR Competency Audit Report"
            >
              <Printer className="w-4 h-4 text-[#1C4CA1]" />
              <span>{t('printDossier')}</span>
            </button>
          </div>
        </div>

        {/* Bento Grid inside Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E2E8F0]">
          {/* Cell 1: Weighted Cadre Readiness Index Dial */}
          <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#E2E8F0] flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="text-slate-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className={`${
                    weightedReadiness >= 80
                      ? 'text-emerald-600'
                      : weightedReadiness >= 50
                      ? 'text-[#1C4CA1]'
                      : 'text-red-600'
                  } transition-all duration-1000 ease-out`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-[#1F273A] tracking-tight">
                  {weightedReadiness}%
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Readiness
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#1F273A]">
                {t('weightedReadiness')}
              </div>
              <div className="text-[11px] text-muted-foreground leading-tight">
                Bayesian W_p × W_ev weighted aggregate across all activities
              </div>
            </div>
          </div>

          {/* Cell 2: Severity Distribution Filter Chips */}
          <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#E2E8F0] flex flex-col justify-between">
            <div className="text-xs font-bold text-[#1F273A] mb-2 flex items-center justify-between">
              <span>{isHindi ? 'गंभीरता अनुसार फ़िल्टर' : 'Severity Count'}</span>
              <span className="text-[10px] text-muted-foreground">(Click to filter)</span>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => onFilterChange(activeSeverityFilter === 'HIGH' ? 'all' : 'HIGH')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSeverityFilter === 'HIGH'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>{criticalCount} {t('highSeverity')}</span>
                </span>
                <span className="text-[11px]">🔴</span>
              </button>

              <button
                onClick={() => onFilterChange(activeSeverityFilter === 'MODERATE' ? 'all' : 'MODERATE')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSeverityFilter === 'MODERATE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>{moderateCount} {t('moderateSeverity')}</span>
                </span>
                <span className="text-[11px]">🟡</span>
              </button>

              <button
                onClick={() => onFilterChange(activeSeverityFilter === 'PROFICIENT' ? 'all' : 'PROFICIENT')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSeverityFilter === 'PROFICIENT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{proficientCount} {t('lowSeverity')}</span>
                </span>
                <span className="text-[11px]">🟢</span>
              </button>
            </div>
          </div>

          {/* Cell 3: Evidence Quality Indicator */}
          <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#E2E8F0] flex flex-col justify-between">
            <div className="text-xs font-bold text-[#1F273A] mb-1 flex items-center justify-between">
              <span>{t('evidenceQuality')}</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">
                {verifiedCount}/{totalCompetencies} IRT
              </span>
            </div>

            {/* Two-tone Stacked Ratio Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-[#1C4CA1] transition-all duration-500"
                  style={{ width: `${totalCompetencies ? (verifiedCount / totalCompetencies) * 100 : 0}%` }}
                  title={`${verifiedCount} IRT-Verified`}
                />
                <div 
                  className="h-full bg-[#FFA72F] transition-all duration-500"
                  style={{ width: `${totalCompetencies ? (selfReportedCount / totalCompetencies) * 100 : 0}%` }}
                  title={`${selfReportedCount} Self-Reported`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-[#475569]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#1C4CA1]" />
                  {verifiedCount} Verified
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FFA72F]" />
                  {selfReportedCount} Self-Reported
                </span>
              </div>
            </div>

            {selfReportedCount > 0 ? (
              <div className="mt-2 text-[11px] font-medium text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-200 leading-tight">
                ⚠️ {selfReportedCount} {isHindi ? 'दक्षताओं हेतु IRT सत्यापन आवश्यक' : 'competencies need IRT verification'}
              </div>
            ) : (
              <div className="mt-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 leading-tight">
                ✓ 100% {isHindi ? 'दक्षताएं सत्यापित' : 'Competencies IRT-Verified'}
              </div>
            )}
          </div>

          {/* Cell 4: APAR Promotion Readiness Tag */}
          <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#E2E8F0] flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                {isHindi ? 'APAR पदोन्नति तत्परता' : 'APAR Promotion Meter'}
              </div>
              <div className="text-sm font-black text-[#1F273A] truncate">
                {designationName}
              </div>
            </div>

            <div className="space-y-1.5 my-2">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#475569]">
                <span>{isHindi ? 'पदोन्नति सीमा:' : 'Threshold:'}</span>
                <span className="font-mono font-bold text-[#1F273A]">{promotionThreshold}%</span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    meetsThreshold ? 'bg-emerald-600' : 'bg-[#1C4CA1]'
                  }`}
                  style={{ width: `${Math.min(100, (weightedReadiness / promotionThreshold) * 100)}%` }}
                />
              </div>
            </div>

            <div className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
              meetsThreshold 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              {meetsThreshold 
                ? (isHindi ? '✓ पदोन्नति सीमा पूरी' : '✓ Meets Cadre Promotion Threshold')
                : (isHindi ? `${promotionThreshold - weightedReadiness}% अतिरिक्त तत्परता आवश्यक` : `${promotionThreshold - weightedReadiness}% below promotion target`)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
