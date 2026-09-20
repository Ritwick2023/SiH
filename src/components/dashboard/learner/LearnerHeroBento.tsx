'use client';

import React from 'react';
import Link from 'next/link';
import type { DashboardUserProps } from '@/components/dashboard/RoleDashboardRouter';
import type { PersonaFRACProfile } from '@/data/fracCadres';
import { ShieldCheck, Wifi, MapPin, Calendar, ArrowRight, CheckCircle, Clock, BookOpen } from 'lucide-react';

interface LearnerHeroBentoProps {
  user: DashboardUserProps;
  profile: PersonaFRACProfile;
  isHindi: boolean;
  readinessIndex: number;
  onOpenDossier?: () => void;
  onOpenCapiModal?: () => void;
  onStartDrill?: (drillId: string) => void;
  onViewGaps?: () => void;
}

export function LearnerHeroBento({
  user,
  profile,
  isHindi,
  readinessIndex,
  onOpenDossier,
  onOpenCapiModal,
  onStartDrill,
  onViewGaps,
}: LearnerHeroBentoProps) {
  const isFieldCadre =
    profile.cadre.toLowerCase().includes('field') ||
    profile.personaId.includes('sunita') ||
    user.id?.includes('sunita');

  const displayName = isHindi && profile.name === 'Sunita Devi' ? 'सुनीता देवी' : profile.name;
  const displayDesignation = isHindi ? profile.designation_hi : profile.designation;
  const displayDepartment = isHindi ? profile.department_hi : profile.department;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Bento: Officer Cadre Card (7 cols) */}
      <div className="lg:col-span-7 rounded-3xl bg-white border border-[#D8DFEE] p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none text-9xl font-black text-[#1C4CA1]">
          ISS
        </div>

        <div>
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isHindi ? 'FRAC प्रमाणित सिविल सेवक' : 'FRAC Verified Official'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF0F7] text-[#1F273A] border border-[#D8DFEE]">
              {profile.cadre}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#EDF0F7] text-[#475569] border border-[#D8DFEE]">
              ID: {profile.personaId.toUpperCase()}
            </span>
          </div>

          {/* Name and Designation */}
          <div
            onClick={onOpenDossier}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenDossier?.();
            }}
            title="Click to view Official Civil Service Dossier"
            className="flex items-start gap-4 cursor-pointer group"
          >
            <div className="h-14 w-14 rounded-2xl bg-[#1C4CA1] text-white flex items-center justify-center text-xl font-bold font-serif shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F273A] tracking-tight group-hover:text-[#1C4CA1] transition-colors">
                {displayName}
              </h1>
              <p className="text-sm font-semibold text-[#1164BE] mt-0.5">
                {displayDesignation}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#1C4CA1]" />
                {displayDepartment}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Cadre Feature (CAPI Field Tablet or Office Scrutiny) */}
        <div className="mt-6 pt-5 border-t border-[#D8DFEE]">
          {isFieldCadre ? (
            <div className="rounded-2xl bg-[#EDF0F7]/50 border border-[#D8DFEE] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
                  <Wifi className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F273A]">
                      {isHindi ? 'CAPI ऑफ़लाइन तुल्यकालन सक्रिय' : 'CAPI Offline Mode Active'}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {isHindi
                      ? 'अंतिम सिंक 14 मिनट पूर्व • 38 अनुसूचियां स्थानीय रूप से सुरक्षित'
                      : 'Last synced 14m ago • 38 field schedules encrypted in local IndexedDB'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenCapiModal}
                className="px-3.5 py-1.5 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-primary-dark transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                {isHindi ? 'सिंक स्थिति' : 'Sync Status'}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#EDF0F7]/50 border border-[#D8DFEE] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#1C4CA1]/10 text-[#1C4CA1] flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F273A]">
                    {isHindi ? 'सांख्यिकी संवीक्षा प्रकोष्ठ' : 'Statistical Scrutiny & DQAD Registry'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {isHindi
                      ? 'पीएलएफएस और एनएसएसओ 80वें दौर के लिए अधिकृत संवीक्षक'
                      : 'Certified validator for PLFS & NSSO 80th Round survey returns'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/pathways"
                  className="px-3 py-1.5 rounded-xl border border-[#1164BE] text-[#1C4CA1] hover:bg-[#EDF0F7] text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  {isHindi ? 'पाठ्यक्रम' : 'Courses'}
                </Link>
                <button
                  type="button"
                  onClick={onViewGaps}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-primary-dark transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  {isHindi ? 'कौशल अंतर देखें' : 'View Gap Analysis'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Bento: High-Contrast Dark Navy Field Schedule Card (5 cols) */}
      <div className="lg:col-span-5 rounded-3xl bg-[#1F273A] text-white p-6 sm:p-7 shadow-md flex flex-col justify-between relative overflow-hidden border border-[#323F58]">
        <div>
          {/* Header pill */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#FFA72F]/20 text-[#FFA72F] border border-[#FFA72F]/35">
              <Calendar className="h-3 w-3" />
              {isHindi ? 'सक्रिय परिचालन चक्र' : 'Active Operation • 2026-Q2'}
            </span>
            <span className="text-xs font-mono text-white/70">
              MoSPI FOD-PLFS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isHindi
              ? 'आवधिक श्रम बल सर्वेक्षण (PLFS)'
              : 'Periodic Labour Force Survey (PLFS)'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isFieldCadre
              ? isHindi
                ? 'चरण: अनुसूची 0.0 परिवार सूचीकरण एवं सीमा निर्धारण'
                : 'Phase: Schedule 0.0 Household Listing & Demarcation'
              : isHindi
                ? 'चरण: सूक्ष्म-डेटा संवीक्षा और विसंगति पर्ची समाधान'
                : 'Phase: Microdata Scrutiny & Query Slips Resolution'}
          </p>

          {/* Stepped progress track */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
              <span className="text-slate-200">
                {isHindi ? 'प्रारंभिक कैडर ब्रीफिंग पूर्ण' : 'Operational Briefing & Frame Allocation'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="h-6 w-6 rounded-full bg-[#FFA72F]/20 text-[#FFA72F] flex items-center justify-center shrink-0">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-[#FFA72F]">
                    {isHindi ? 'फील्ड संवीक्षा प्रगति' : 'Current Milestone Progress'}
                  </span>
                  <span className="font-mono font-bold text-[#FFA72F]">
                    {readinessIndex}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#FFA72F] to-[#F4962F] transition-all"
                    style={{ width: `${readinessIndex}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs opacity-60">
              <div className="h-6 w-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-mono font-bold">3</span>
              </div>
              <span className="text-slate-300">
                {isHindi ? 'त्रैमासिक बुलेटिन और माइक्रो-डेटा जारी' : 'Final Bulletin Tabulation & Dissemination'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/pathways"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/10"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#FFA72F]" />
            <span>{isHindi ? 'सरकारी पाठ्यक्रम (10) →' : 'Browse Official Courses (10) →'}</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              if (onStartDrill) {
                onStartDrill('drill-schedule-0');
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFA72F] text-[#1F273A] text-xs font-bold hover:bg-[#F4962F] transition-colors cursor-pointer shadow-sm active:scale-95 ml-auto"
          >
            <span>{isHindi ? 'अभ्यास आरंभ करें' : 'Start Field Drill'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
