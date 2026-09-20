'use client';

import React, { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { 
  X, 
  CheckCircle2, 
  Target, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Award,
  Lock
} from 'lucide-react';
import { CompetencyGap } from '@/lib/types';
import { OFFICIAL_FRAC_COMPETENCIES } from '@/data/fracCadres';

interface CompetencyRubricModalProps {
  gap: CompetencyGap | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulateLevel?: (competencyId: string, level: number) => void;
}

export function CompetencyRubricModal({
  gap,
  isOpen,
  onClose,
  onSimulateLevel,
}: CompetencyRubricModalProps) {
  const t = useTranslations('skillGap');
  const locale = useLocale();
  const isHindi = locale === 'hi';

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !gap) return null;

  const fracDef = OFFICIAL_FRAC_COMPETENCIES[gap.competencyId];
  const levels = fracDef?.levels ?? {
    L1: 'Basic conceptual understanding and routine assistance.',
    L2: 'Independent routine execution under supervision with standard protocols.',
    L3: 'Autonomous complex problem resolution and peer coordination.',
    L4: 'Advanced methodology review, quality audit, and junior mentoring.',
    L5: 'Expert leadership, national statistical standards architecture.',
  };

  const compName = isHindi && fracDef?.name_hi ? fracDef.name_hi : gap.competency.name;
  const compDesc = isHindi && fracDef?.description_hi ? fracDef.description_hi : gap.competency.description;

  const currentLevel = gap.currentLevel;
  const targetLevel = gap.targetLevel;

  const levelTitles: Record<number, string> = {
    1: isHindi ? 'स्तर 1: बुनियादी (L1 - Foundation)' : 'Level 1: Foundation (L1)',
    2: isHindi ? 'स्तर 2: व्यावहारिक (L2 - Applied)' : 'Level 2: Applied (L2)',
    3: isHindi ? 'स्तर 3: स्वायत्त (L3 - Autonomous)' : 'Level 3: Autonomous (L3)',
    4: isHindi ? 'स्तर 4: उन्नत (L4 - Advanced)' : 'Level 4: Advanced (L4)',
    5: isHindi ? 'स्तर 5: विशेषज्ञ (L5 - Expert)' : 'Level 5: Expert (L5)',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rubric-modal-title"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-[#D8DFEE] shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-[#E2E8F0] bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF0F7] text-[#1F273A] border border-[#D8DFEE]">
                  <Award className="w-3.5 h-3.5 text-[#1C4CA1]" />
                  {gap.competency.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-[#475569]">
                  ID: {gap.competencyId}
                </span>
                {gap.evidenceType === 'assessment-verified' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    IRT Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                    Self-Reported
                  </span>
                )}
              </div>
              <h2 id="rubric-modal-title" className="text-xl font-black text-[#1F273A] tracking-tight">
                {compName}
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] line-clamp-2">
                {compDesc}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-[#1F273A] hover:bg-[#EDF0F7] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#E2E8F0]">
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                {t('currentLevel')}
              </span>
              <span className="text-lg font-black text-[#1C4CA1]">
                Level {currentLevel}
              </span>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                {t('targetLevel')}
              </span>
              <span className="text-lg font-black text-[#D97706]">
                Level {targetLevel}
              </span>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                {t('gap')}
              </span>
              <span className={`text-lg font-black ${gap.gap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {gap.gap > 0 ? `-${gap.gap} Level${gap.gap > 1 ? 's' : ''}` : 'No Gap ✓'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Rubric Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F273A] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#1C4CA1]" />
              {t('rubric.title')}
            </h3>
            <span className="text-[11px] font-medium text-muted-foreground">
              Mission Karmayogi FRAC Standard
            </span>
          </div>

          {/* L1 to L5 Ladder */}
          <div className="space-y-2.5">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const levelKey = `L${lvl}` as keyof typeof levels;
              const descriptor = levels[levelKey];
              const isCurrent = lvl === currentLevel;
              const isTarget = lvl === targetLevel;
              const isAchieved = lvl <= currentLevel;
              const isAboveTarget = lvl > targetLevel;

              let cardBg = 'bg-[#F8FAFC] border-[#E2E8F0]';
              if (isCurrent) {
                cardBg = 'bg-blue-50/70 border-2 border-[#1C4CA1]';
              } else if (isTarget) {
                cardBg = 'bg-amber-50/70 border-2 border-[#FFA72F]';
              } else if (isAchieved) {
                cardBg = 'bg-emerald-50/50 border border-emerald-300';
              }

              return (
                <div
                  key={lvl}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 ${cardBg}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#1F273A]">
                          {levelTitles[lvl]}
                        </span>
                        
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#1C4CA1] text-white">
                            <ShieldCheck className="w-3 h-3" />
                            {t('rubric.currentLevel')}
                          </span>
                        )}

                        {isTarget && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFA72F] text-white">
                            <Target className="w-3 h-3" />
                            {t('rubric.targetLevel')}
                          </span>
                        )}

                        {isAchieved && !isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-100">
                            <CheckCircle2 className="w-3 h-3" />
                            Achieved
                          </span>
                        )}

                        {isAboveTarget && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-muted-foreground bg-slate-200">
                            <Lock className="w-3 h-3" />
                            Mastery
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pl-0.5">
                        {descriptor}
                      </p>
                    </div>

                    {onSimulateLevel && (
                      <button
                        onClick={() => onSimulateLevel(gap.competencyId, lvl)}
                        className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-white hover:bg-[#F8FAFC] text-[#1F273A] transition-colors cursor-pointer"
                        title={`Simulate level ${lvl} in What-If sandbox`}
                      >
                        Simulate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bridge the Gap Callout */}
          {gap.gap > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <h4 className="text-sm font-bold text-amber-950">
                  {t('rubric.bridgeNeeded')} (Level {currentLevel} → Level {targetLevel})
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {t('rubric.bridgeDescription', { current: currentLevel, target: targetLevel })}
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-xs font-medium text-[#1F273A]">
                🎯 {levels[`L${targetLevel}` as keyof typeof levels]}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-bold text-[#475569] hover:text-[#1F273A] transition-colors cursor-pointer"
          >
            {t('rubric.close')}
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <Link
              href={`/assessment?competency=${gap.competencyId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#1C4CA1] hover:bg-primary-dark text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              {t('rubric.takeAssessment')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
