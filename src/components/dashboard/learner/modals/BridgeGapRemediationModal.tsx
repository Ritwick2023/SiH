'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { FRACCompetencyDef } from '@/data/fracCadres';
import { LearningCatalogService } from '@/services/learningCatalogService';
import {
  X,
  GraduationCap,
  BookOpen,
  PlayCircle,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface BridgeGapRemediationModalProps {
  competency: FRACCompetencyDef | null;
  isOpen: boolean;
  onClose: () => void;
  isHindi?: boolean;
  onOpenManual?: (manualId: string) => void;
  onStartDrill?: (drillId: string) => void;
}

export function BridgeGapRemediationModal({
  competency,
  isOpen,
  onClose,
  isHindi = false,
  onOpenManual,
  onStartDrill,
}: BridgeGapRemediationModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'learning' | 'rubric' | 'drills'>('learning');

  // Matched courses from official catalog
  const matchingCourses = useMemo(() => {
    if (!competency) return [];
    return LearningCatalogService.getByCompetency(competency.id);
  }, [competency]);

  if (!isOpen || !competency) return null;

  const compName = isHindi ? competency.name_hi : competency.name;
  const activityName = isHindi ? competency.activityName_hi : competency.activityName;
  const gapSize = Math.max(0, competency.targetLevel - competency.currentLevel);

  // Map competency to relevant manuals and drills
  const manualMapping: Record<string, { id: string; title: string; desc: string }> = {
    'comp-data': {
      id: 'manual-asi-scrutiny',
      title: 'MoSPI Field Scrutiny & Validation Manual (Vol. II)',
      desc: 'Mathematical consistency rules, outlier scrub routines, and schedule verification checks.',
    },
    'comp-survey': {
      id: 'manual-nsso-plfs',
      title: 'NSSO Sampling Design & Multiplier Estimation Protocol',
      desc: 'Multi-stage stratified sampling, design effect (DEFF), and sample weights allocation.',
    },
    'comp-capi': {
      id: 'manual-capi-handbook',
      title: 'ASHE & CAPI Tablet Operational Manual',
      desc: 'Offline SQLite syncing, GPS geofencing, and household roster recording rules.',
    },
    'comp-nsso': {
      id: 'manual-nsso-plfs',
      title: 'PLFS Quarterly Field Protocol & Standard Classifications',
      desc: 'NIC/NCO occupation codes and household consumer expenditure scrutiny protocols.',
    },
  };

  const drillMapping: Record<string, { id: string; title: string; points: number }> = {
    'comp-data': {
      id: 'drill-outlier-scrub',
      title: 'Field Schedule 1.0 Outlier Scrubbing & Cook\'s Distance',
      points: 50,
    },
    'comp-survey': {
      id: 'drill-sampling-weights',
      title: 'Multi-Stage Sampling Multiplier & DEFF Computation',
      points: 50,
    },
    'comp-capi': {
      id: 'drill-capi-skip',
      title: 'CAPI Schedule 1.0 Branching & Skip Logic Drill',
      points: 50,
    },
    'comp-nsso': {
      id: 'drill-plfs-classification',
      title: 'PLFS Activity Status & Worker Population Classification',
      points: 50,
    },
  };

  const relevantManual = manualMapping[competency.id] || manualMapping['comp-data'];
  const relevantDrill = drillMapping[competency.id] || drillMapping['comp-data'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#D8DFEE] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#EDF0F7]/70 border-b border-[#D8DFEE] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
                {competency.category}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/15 text-red-700 border border-red-500/30">
                <AlertCircle className="h-3 w-3" />
                {isHindi ? `अंतर: L${competency.currentLevel} → L${competency.targetLevel}` : `Gap: L${competency.currentLevel} → L${competency.targetLevel} (+${gapSize} Levels)`}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-[#D8DFEE]">
                {competency.id}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-[#1F273A] tracking-tight">
              {isHindi ? `दक्षता अंतर निवारण: ${compName}` : `Bridge Competency Gap: ${compName}`}
            </h2>

            <p className="text-xs text-[#475569] flex items-center gap-1.5 truncate">
              <span className="font-semibold text-[#1164BE]">
                {isHindi ? 'संबद्ध आधिकारिक कर्तव्य:' : 'Linked Cadre Duty:'}
              </span>
              <span className="font-medium text-[#1F273A] truncate">{activityName}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white border border-[#D8DFEE] flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-[#EDF0F7] transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 sm:px-6 pt-3 border-b border-[#D8DFEE] bg-white text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('learning')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'learning'
                ? 'border-[#1C4CA1] text-[#1C4CA1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>{isHindi ? 'प्रशिक्षण मॉड्यूल एवं सामग्री' : 'Learning & Practice'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rubric')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rubric'
                ? 'border-[#1C4CA1] text-[#1C4CA1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>{isHindi ? 'FRAC रूब्रिक स्तर (L1-L5)' : 'FRAC Rubric Progression'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#F8FAFC]">
          {activeTab === 'learning' && (
            <>
              {/* Option 1: Recommended MoSPI / NSSTA Modules */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1F273A] flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-[#1C4CA1]" />
                    <span>{isHindi ? 'अनुशंसित प्रशिक्षण पाठ्यक्रम (iGOT / NSSTA)' : 'Recommended MoSPI & NSSTA Courses'}</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-[#1C4CA1]">
                    {matchingCourses.length} available
                  </span>
                </div>

                {matchingCourses.length > 0 ? (
                  <div className="space-y-2.5">
                    {matchingCourses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        className="p-4 rounded-2xl bg-white border border-[#D8DFEE] shadow-2xs hover:border-[#1C4CA1]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#1C4CA1]/10 text-[#1C4CA1]">
                              Target: L{course.targetLevel}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              {course.duration || 'Self-paced'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#1F273A] leading-snug">
                            {course.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {course.provider}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            router.push(`/pathways?courseId=${course.id}`);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
                        >
                          <span>{isHindi ? 'मॉड्यूल शुरू करें' : 'Start Module'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-white border border-[#D8DFEE] text-center text-xs text-slate-500">
                    Curating specialized NSSTA training tracks for this cadre level...
                  </div>
                )}
              </div>

              {/* Option 2 & 3: Official Field Manual & Practical Drill Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Field Manual */}
                <div className="p-4 rounded-2xl bg-white border border-[#D8DFEE] shadow-2xs space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span>{isHindi ? 'आधिकारिक फील्ड मैनुअल' : 'Official MoSPI SOP Manual'}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1F273A]">{relevantManual.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{relevantManual.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenManual) {
                        onOpenManual(relevantManual.id);
                      } else {
                        router.push('/documents');
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{isHindi ? 'मैनुअल पढ़ें' : 'Read SOP Manual'}</span>
                  </button>
                </div>

                {/* Practical Drill */}
                <div className="p-4 rounded-2xl bg-white border border-[#D8DFEE] shadow-2xs space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                      <Award className="h-4 w-4 text-[#D97706]" />
                      <span>{isHindi ? 'व्यावहारिक सिमुलेशन ड्रिल' : 'Practical Simulation Drill'}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1F273A]">{relevantDrill.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Hands-on scenario practice with instant feedback • Earn +{relevantDrill.points} Karma Points
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onStartDrill) {
                        onStartDrill(relevantDrill.id);
                      } else {
                        router.push('/practice');
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span>{isHindi ? 'ड्रिल शुरू करें (+50 कर्म)' : 'Launch Drill (+50 Karma)'}</span>
                  </button>
                </div>
              </div>

              {/* Cadre Competency Milestone Guidance */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1F273A]">
                    <span className="h-2 w-2 rounded-full bg-[#1C4CA1] shrink-0" />
                    <span>
                      {isHindi
                        ? `MoSPI संवर्ग लक्ष्य: स्तर L${competency.currentLevel} से L${competency.targetLevel} की ओर प्रगति`
                        : `MoSPI Cadre Target: Progressing from Level L${competency.currentLevel} to L${competency.targetLevel}`}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569]">
                    {isHindi
                      ? 'ऊपर दिए गए आधिकारिक प्रशिक्षण मॉड्यूल पूर्ण करने या व्यावहारिक अभ्यास ड्रिल करने पर आपकी प्रोफ़ाइल में प्रगति स्वचालित रूप से दर्ज की जाएगी।'
                      : 'Completing the recommended learning modules or practical field drills above records official progress toward closing this gap in your service dossier.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push('/skill-gap');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#D8DFEE] text-[#1C4CA1] hover:bg-stone-100 text-xs font-bold shadow-2xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <span>{isHindi ? 'रोडमैप देखें' : 'View Roadmap'}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}

          {activeTab === 'rubric' && (
            <div className="space-y-3">
              <p className="text-xs text-[#475569]">
                {isHindi
                  ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) के FRAC ढांचे के अनुसार L1 से L5 स्तर की अपेक्षाएं:'
                  : 'Official Ministry of Statistics & Programme Implementation (MoSPI) FRAC competency level definitions:'}
              </p>

              <div className="space-y-2">
                {[
                  { lvl: 1, label: 'L1: Foundational / Basic Awareness', desc: competency.levels.L1 },
                  { lvl: 2, label: 'L2: Field Execution / Intermediate', desc: competency.levels.L2 },
                  { lvl: 3, label: 'L3: Operational Supervision & Scrutiny', desc: competency.levels.L3 },
                  { lvl: 4, label: 'L4: Analytical Mastery & Quality Assurance', desc: competency.levels.L4 },
                  { lvl: 5, label: 'L5: Cadre Authority & Methodological Innovation', desc: competency.levels.L5 },
                ].map((item) => {
                  const isCurrent = item.lvl === competency.currentLevel;
                  const isTarget = item.lvl === competency.targetLevel;
                  const isAchieved = item.lvl <= competency.currentLevel;

                  return (
                    <div
                      key={item.lvl}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-blue-50/60 border-[#1C4CA1]/40 ring-1 ring-[#1C4CA1]/30'
                          : isTarget
                          ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-400/30'
                          : isAchieved
                          ? 'bg-white border-[#D8DFEE]'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-[#1F273A]">{item.label}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1C4CA1] text-white">
                            Current Level
                          </span>
                        )}
                        {isTarget && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706] text-white">
                            Mandated Target
                          </span>
                        )}
                        {isAchieved && !isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#D8DFEE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/skill-gap');
            }}
            className="text-xs font-bold text-[#1C4CA1] hover:text-[#1164BE] flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            <span>{isHindi ? '30/60/90-दिवसीय समग्र रोडमैप देखें' : 'View Full 30/60/90-Day Career Roadmap'}</span>
            <ExternalLink className="h-3 w-3" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#EDF0F7] hover:bg-[#D8DFEE] text-[#1F273A] text-xs font-bold transition-colors cursor-pointer self-end sm:self-auto"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
