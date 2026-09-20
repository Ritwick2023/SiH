'use client';

import React, { useRef, useState } from 'react';
import { Award, Compass, ArrowUpRight, CheckCircle2, Lock, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';

export interface PathwayMilestone {
  id: string;
  stageNumber: number;
  title: string;
  title_hi: string;
  cadre: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
  competenciesCovered: number;
  totalCompetencies: number;
  karmaReward: string;
  iGotCourseTitle: string;
  iGotLink: string;
}

export const PATHWAY_MILESTONES: PathwayMilestone[] = [
  {
    id: 'stage-1-foundational',
    stageNumber: 1,
    title: 'Stage 1: Field Demarcation & Survey Listing',
    title_hi: 'चरण 1: फील्ड सीमांकन एवं सर्वेक्षण सूचीकरण',
    cadre: 'Field Operations Division (FOD) • JSO / SSU',
    status: 'completed',
    progress: 100,
    competenciesCovered: 3,
    totalCompetencies: 3,
    karmaReward: '+150 KP',
    iGotCourseTitle: 'Mastering Census Enumeration Blocks & Hamlet Formation',
    iGotLink: 'https://igotkarmayogi.gov.in',
  },
  {
    id: 'stage-2-capi-operations',
    stageNumber: 2,
    title: 'Stage 2: CAPI Tablet Operations & Error Mitigation',
    title_hi: 'चरण 2: कैपी टैबलेट संचालन एवं त्रुटि निवारण',
    cadre: 'FOD Investigators & Field Supervisors',
    status: 'in-progress',
    progress: 65,
    competenciesCovered: 2,
    totalCompetencies: 3,
    karmaReward: '+200 KP',
    iGotCourseTitle: 'ASHE & PLFS Android CAPI Protocols & Offline Encryption',
    iGotLink: 'https://igotkarmayogi.gov.in',
  },
  {
    id: 'stage-3-economic-coding',
    stageNumber: 3,
    title: 'Stage 3: Advanced Economic Coding (NIC/NCO)',
    title_hi: 'चरण 3: उन्नत आर्थिक वर्गीकरण (एनआईसी/एनसीओ)',
    cadre: 'Survey Design & Research Division (SDRD)',
    status: 'locked',
    progress: 0,
    competenciesCovered: 0,
    totalCompetencies: 4,
    karmaReward: '+250 KP',
    iGotCourseTitle: 'Disambiguating Informal Sector Enterprises under NIC-2008',
    iGotLink: 'https://igotkarmayogi.gov.in',
  },
  {
    id: 'stage-4-national-accounts',
    stageNumber: 4,
    title: 'Stage 4: Statistical Quality Audits & Macro Aggregates',
    title_hi: 'चरण 4: सांख्यिकीय गुणवत्ता लेखापरीक्षा एवं समष्टि योग',
    cadre: 'Data Quality Assurance Division (DQAD) • ISS Officers',
    status: 'locked',
    progress: 0,
    competenciesCovered: 0,
    totalCompetencies: 4,
    karmaReward: '+400 KP',
    iGotCourseTitle: 'National Accounts Aggregates & Discrepancy Reconciliation',
    iGotLink: 'https://igotkarmayogi.gov.in',
  },
];

interface KarmayogiPathwaysTrackProps {
  isHindi?: boolean;
}

export function KarmayogiPathwaysTrack({ isHindi = false }: KarmayogiPathwaysTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -330 : 330;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLaunchModule = (milestone: PathwayMilestone) => {
    if (milestone.status === 'locked') {
      setLockedNotice(
        isHindi
          ? `यह चरण लॉक है! कृपया पहले चरण ${milestone.stageNumber - 1} की योग्यताएं पूर्ण करें।`
          : `This stage is locked! Complete all prerequisite competencies in Stage ${milestone.stageNumber - 1} to unlock.`
      );
      return;
    }
    window.open(milestone.iGotLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-3xl bg-white border border-[#D8DFEE] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#D8DFEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1C4CA1]" />
            <h2 className="text-base sm:text-lg font-bold text-[#1F273A]">
              {isHindi ? 'iGOT कर्मयोगी एकीकृत प्रगति पथ' : 'Karmayogi Bharat Integrated Progression Track'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1C4CA1]/10 text-[#1C4CA1] hidden sm:inline">
              4 Stages
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            {isHindi
              ? 'अन्वेषक से सांख्यिकी अधिकारी तक राष्ट्रीय क्षमता विकास का क्रमबद्ध मार्ग'
              : 'Sequential civil service competency ladder from Field Demarcation to National Accounts'}
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll pathways left"
            className="h-8 w-8 rounded-xl bg-[#EDF0F7] border border-[#D8DFEE] flex items-center justify-center text-[#1F273A] hover:bg-[#D8DFEE] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll pathways right"
            className="h-8 w-8 rounded-xl bg-[#EDF0F7] border border-[#D8DFEE] flex items-center justify-center text-[#1F273A] hover:bg-[#D8DFEE] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* In-website locked stage notice banner */}
      {lockedNotice && (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{lockedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setLockedNotice(null)}
            className="text-amber-800/70 hover:text-amber-900 p-1 rounded-lg cursor-pointer transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Horizontal Milestone Cards */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PATHWAY_MILESTONES.map((m) => {
          const title = isHindi ? m.title_hi : m.title;

          return (
            <div
              key={m.id}
              className={`min-w-70 sm:min-w-[320px] max-w-[320px] rounded-2xl border p-4 sm:p-5 flex flex-col justify-between snap-start shadow-2xs transition-all ${
                m.status === 'in-progress'
                  ? 'bg-white border-[#1C4CA1] ring-2 ring-[#1C4CA1]/20'
                  : m.status === 'completed'
                    ? 'bg-[#EDF0F7]/40 border-[#D8DFEE] hover:border-[#1C4CA1]/40 hover:bg-white'
                    : 'bg-slate-50 border-[#D8DFEE] opacity-70'
              }`}
            >
              <div>
                {/* Stage Pill & Reward */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                        : m.status === 'in-progress'
                          ? 'bg-[#1C4CA1]/15 text-[#1C4CA1] border border-[#1C4CA1]/30'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isHindi ? `चरण ${m.stageNumber}` : `Stage ${m.stageNumber}`}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#1F273A] bg-[#FFA72F]/20 px-2 py-0.5 rounded-full border border-[#FFA72F]/40">
                    <Award className="h-3 w-3 text-[#1C4CA1]" />
                    {m.karmaReward}
                  </span>
                </div>

                {/* Milestone Title */}
                <h3 className="text-sm font-black text-[#1F273A] line-clamp-2 leading-snug">
                  {title}
                </h3>
                <p className="text-[11px] font-medium text-[#475569] mt-1 truncate">
                  {m.cadre}
                </p>

                {/* Course preview */}
                <div className="mt-3 p-3 rounded-xl bg-[#EDF0F7]/60 border border-[#D8DFEE] space-y-1">
                  <span className="text-[10px] font-bold text-[#1164BE] uppercase tracking-wider block">
                    {isHindi ? 'संबद्ध कर्मयोगी मॉड्यूल' : 'Core iGOT Course'}
                  </span>
                  <p className="text-xs font-bold text-[#1F273A] line-clamp-1">
                    {m.iGotCourseTitle}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#475569]">
                      {m.competenciesCovered}/{m.totalCompetencies} {isHindi ? 'कौशल' : 'Skills'}
                    </span>
                    <span className="font-bold text-[#1C4CA1]">{m.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#EDF0F7] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        m.status === 'completed' ? 'bg-emerald-600' : 'bg-[#1C4CA1]'
                      }`}
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[#D8DFEE]">
                <button
                  type="button"
                  onClick={() => handleLaunchModule(m)}
                  className={`w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                    m.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : m.status === 'in-progress'
                        ? 'bg-[#1C4CA1] text-white hover:bg-[#1164BE]'
                        : 'bg-slate-200 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {m.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isHindi ? 'सत्यापित एवं उत्तीर्ण' : 'Verified & Completed'}</span>
                    </>
                  ) : m.status === 'in-progress' ? (
                    <>
                      <Compass className="h-3.5 w-3.5 text-[#FFA72F]" />
                      <span>{isHindi ? 'मॉड्यूल जारी रखें' : 'Resume Module'}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>{isHindi ? 'तालाबंद (प्रगति आवश्यक)' : 'Locked (Prerequisite)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
