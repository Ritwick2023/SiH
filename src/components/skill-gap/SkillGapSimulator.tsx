'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';
import { CompetencyGap } from '@/lib/types';
import { 
  computeWeightedReadinessIndex, 
  computeBayesianWeightedGap 
} from '@/services/competencyService';

interface SkillGapSimulatorProps {
  gaps: CompetencyGap[];
  onGeneratePlan: (simulatedLevels: Record<string, number>) => void;
  isHindi: boolean;
  focusedCompetencyId?: string | null;
}

export function SkillGapSimulator({
  gaps,
  onGeneratePlan,
  isHindi,
  focusedCompetencyId,
}: SkillGapSimulatorProps) {
  const t = useTranslations('skillGap');

  // Baseline levels map
  const baseLevels = useMemo(() => {
    const map = new Map<string, number>();
    gaps.forEach((g) => map.set(g.competencyId, g.currentLevel));
    return map;
  }, [gaps]);

  // Simulated overrides: competencyId -> level (1-5)
  const [simulatedOverrides, setSimulatedOverrides] = useState<Record<string, number>>({});
  const [prevFocusedId, setPrevFocusedId] = useState<string | null | undefined>(focusedCompetencyId);

  // Synchronize focused competency override without triggering cascading effect renders
  if (focusedCompetencyId !== prevFocusedId) {
    setPrevFocusedId(focusedCompetencyId);
    if (focusedCompetencyId) {
      const match = gaps.find((g) => g.competencyId === focusedCompetencyId);
      if (match) {
        setSimulatedOverrides((prev) => ({
          ...prev,
          [focusedCompetencyId]: match.targetLevel,
        }));
      }
    }
  }

  const handleSliderChange = (competencyId: string, value: number) => {
    setSimulatedOverrides((prev) => ({
      ...prev,
      [competencyId]: value,
    }));
  };

  const handleReset = () => {
    setSimulatedOverrides({});
  };

  const requiredCompetencies = useMemo(
    () =>
      gaps.map((g) => ({
        competencyId: g.competencyId,
        targetLevel: g.targetLevel,
        priority: g.priority,
      })),
    [gaps]
  );

  const evidenceMap = useMemo(() => {
    const map = new Map<string, { evidenceType?: string; daysSinceAssessment?: number }>();
    gaps.forEach((g) => {
      map.set(g.competencyId, {
        evidenceType: g.evidenceType,
        daysSinceAssessment: g.daysSinceAssessment ?? 14,
      });
    });
    return map;
  }, [gaps]);

  const baselineReadiness = useMemo(
    () => computeWeightedReadinessIndex(requiredCompetencies, baseLevels, evidenceMap),
    [requiredCompetencies, baseLevels, evidenceMap]
  );

  const effectiveSimulatedLevels = useMemo(() => {
    const map = new Map(baseLevels);
    Object.entries(simulatedOverrides).forEach(([id, lvl]) => {
      map.set(id, lvl);
    });
    return map;
  }, [baseLevels, simulatedOverrides]);

  const simulatedReadiness = useMemo(
    () => computeWeightedReadinessIndex(requiredCompetencies, effectiveSimulatedLevels, evidenceMap),
    [requiredCompetencies, effectiveSimulatedLevels, evidenceMap]
  );

  const delta = simulatedReadiness - baselineReadiness;

  // Compute remaining critical gaps & transitions
  const { criticalGapsRemaining, baselineCriticalGaps, transitions } = useMemo(() => {
    let baseCrit = 0;
    let simCrit = 0;
    const transList: Array<{ name: string; from: string; to: string }> = [];

    gaps.forEach((g) => {
      const baseLvl = g.currentLevel;
      const simLvl = effectiveSimulatedLevels.get(g.competencyId) ?? baseLvl;
      const ev = evidenceMap.get(g.competencyId);

      const baseScore = computeBayesianWeightedGap(baseLvl, g.targetLevel, g.priority, ev);
      const simScore = computeBayesianWeightedGap(simLvl, g.targetLevel, g.priority, ev);

      if (baseScore >= 3.5) baseCrit++;
      if (simScore >= 3.5) simCrit++;

      if (simLvl !== baseLvl) {
        const fromSeverity = baseScore >= 3.5 ? '🔴 Critical' : baseScore >= 1.5 ? '🟡 Moderate' : '🟢 Proficient';
        const toSeverity = simScore >= 3.5 ? '🔴 Critical' : simScore >= 1.5 ? '🟡 Moderate' : '🟢 Proficient';
        transList.push({
          name: (isHindi && g.competency.name_hi) ? g.competency.name_hi : g.competency.name,
          from: fromSeverity,
          to: toSeverity,
        });
      }
    });

    return {
      baselineCriticalGaps: baseCrit,
      criticalGapsRemaining: simCrit,
      transitions: transList,
    };
  }, [gaps, effectiveSimulatedLevels, evidenceMap, isHindi]);

  const meetsThreshold = simulatedReadiness >= 80;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Competency Level Sliders */}
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-7 border border-[#D8DFEE] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-lg font-bold text-[#1F273A] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#1C4CA1]" />
                {t('simulator.title')}
              </h2>
              <p className="text-xs text-[#475569]">
                {t('simulator.subtitle')}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#475569] hover:text-[#1F273A] bg-[#F8FAFC] hover:bg-[#EDF0F7] border border-border transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('simulator.resetBaseline')}</span>
            </button>
          </div>

          {/* Sliders list */}
          <div className="space-y-3.5">
            {gaps.map((gap, index) => {
              const currentVal = effectiveSimulatedLevels.get(gap.competencyId) ?? gap.currentLevel;
              const hasChanged = currentVal !== gap.currentLevel;
              const isTargetAchieved = currentVal >= gap.targetLevel;

              return (
                <div
                  key={gap.competencyId}
                  id={`simulator-${gap.competencyId}`}
                  className={`p-4 rounded-2xl border transition-all ${
                    hasChanged
                      ? 'bg-[#EDF0F7]/80 border-[#1C4CA1] ring-2 ring-[#1C4CA1]/15 shadow-xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-bold text-[#94A3B8] font-mono">
                        {index + 1}.
                      </span>
                      <span className="text-sm font-bold text-[#1F273A] truncate">
                        {(isHindi && gap.competency.name_hi) ? gap.competency.name_hi : gap.competency.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-[#475569]">
                        Target: <strong className="text-[#B45309]">L{gap.targetLevel}</strong>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold ${
                        hasChanged 
                          ? 'bg-[#1C4CA1] text-white shadow-xs' 
                          : 'bg-slate-200 text-[#1F273A]'
                      }`}>
                        L{currentVal}
                      </span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={currentVal}
                      onChange={(e) => handleSliderChange(gap.competencyId, Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1C4CA1]"
                    />

                    {/* Step Labels */}
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono font-semibold px-0.5">
                      <span>L1</span>
                      <span>L2</span>
                      <span>L3</span>
                      <span>L4</span>
                      <span>L5</span>
                    </div>
                  </div>

                  {hasChanged && (
                    <div className="mt-2 text-xs flex items-center justify-between text-[#1C4CA1] font-semibold pt-1 border-t border-border">
                      <span>Simulated: L{gap.currentLevel} → L{currentVal} ({currentVal > gap.currentLevel ? `+${currentVal - gap.currentLevel}` : currentVal - gap.currentLevel})</span>
                      {isTargetAchieved && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Target Met
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Simulation HUD Results (High-Contrast White Card) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white border-2 border-[#1C4CA1] p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1C4CA1] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFA72F]" />
                <span>Simulation Results</span>
              </span>
              {delta > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{delta}% Gain
                </span>
              )}
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <span className="text-xs font-semibold text-muted-foreground block mb-1">
                  {t('simulator.currentReadiness')}
                </span>
                <span className="text-3xl font-black text-[#1F273A]">
                  {baselineReadiness}%
                </span>
              </div>

              <div className="bg-[#EDF0F7] p-4 rounded-2xl border-2 border-[#1C4CA1]">
                <span className="text-xs font-bold text-[#1C4CA1] block mb-1">
                  {t('simulator.simulatedReadiness')}
                </span>
                <span className="text-3xl font-black text-[#1C4CA1]">
                  {simulatedReadiness}%
                </span>
              </div>
            </div>

            {/* Critical Gaps Status */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1F273A]">
                <span>{t('simulator.criticalGapsRemaining')}:</span>
                <span className="font-bold text-sm">
                  {baselineCriticalGaps} → <strong className={criticalGapsRemaining === 0 ? 'text-emerald-700' : 'text-red-700'}>{criticalGapsRemaining}</strong>
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {criticalGapsRemaining === 0 
                  ? '✓ All high-severity critical gaps eliminated!'
                  : `${criticalGapsRemaining} critical gap(s) remaining`}
              </div>
            </div>

            {/* Promotion Threshold Check */}
            <div className={`p-4 rounded-2xl border ${
              meetsThreshold 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {meetsThreshold ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cadre Promotion Target Achieved!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{80 - simulatedReadiness}% below promotion threshold</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {meetsThreshold
                  ? 'This simulated proficiency level satisfies the 80% competency benchmark for official promotion review.'
                  : 'Adjust remaining sliders to reach the 80% promotion threshold.'}
              </p>
            </div>

            {/* Severity Transitions List */}
            {transitions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-muted-foreground block uppercase tracking-wider">
                  {t('simulator.severityTransitions')}
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {transitions.map((tr, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-[#F8FAFC] px-3 py-2 rounded-xl border border-[#E2E8F0]">
                      <span className="truncate pr-2 font-semibold text-[#1F273A]">{tr.name}</span>
                      <span className="shrink-0 font-mono text-[11px] font-bold text-[#475569]">
                        {tr.from} → {tr.to}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button: Generate Learning Plan */}
            <button
              type="button"
              onClick={() => onGeneratePlan(simulatedOverrides)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm bg-[#1C4CA1] hover:bg-primary-dark text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFA72F]" />
              <span>{t('simulator.generatePlan')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
