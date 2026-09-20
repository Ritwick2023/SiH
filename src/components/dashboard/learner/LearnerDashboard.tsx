'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardUserProps } from '@/components/dashboard/RoleDashboardRouter';
import { getPersonaFRAC } from '@/data/fracCadres';
import { LearnerKpiStrip } from './LearnerKpiStrip';
import { LearnerHeroBento } from './LearnerHeroBento';
import { PriorityGapsCard } from './PriorityGapsCard';
import { LearnerCoursesTable } from './LearnerCoursesTable';
import { MoSPIFieldManualsShelf } from './MoSPIFieldManualsShelf';
import { HorizontalDrillsCarousel } from './HorizontalDrillsCarousel';
import { KarmayogiPathwaysTrack } from './KarmayogiPathwaysTrack';
import { CAPIFieldStationTab } from './CAPIFieldStationTab';
import { LearnerDrillModal } from './modals/LearnerDrillModal';
import { ManualReaderModal } from './modals/ManualReaderModal';
import { OfficerDossierModal } from './modals/OfficerDossierModal';
import { CAPIConnectivityModal } from './modals/CAPIConnectivityModal';
import { LearnerKarmaLedgerModal } from './modals/LearnerKarmaLedgerModal';
import { useSafeLocale } from '@/lib/useSafeLocale';
import { LayoutDashboard, BookOpen, Target, GraduationCap, Wifi, Award, X } from 'lucide-react';
import { FracSunburstHierarchy } from '@/components/charts/FracSunburstHierarchy';
import type { DemoPersona } from '@/lib/types';

export default function LearnerDashboard({ user }: { user: DashboardUserProps }) {
  const router = useRouter();
  // Retrieve official FRAC profile
  const profile = getPersonaFRAC(user);

  // Read global app locale from next-intl (with fallback to user preferred language)
  const globalLocale = useSafeLocale(user.user_metadata?.preferred_language || (user.id?.includes('sunita') ? 'hi' : 'en'));
  const isHindi =
    globalLocale === 'hi' ||
    user.user_metadata?.preferred_language === 'hi' ||
    profile.preferredLanguage === 'hi' ||
    user.id?.includes('sunita');
  const [activeTab, setActiveTab] = useState<'overview' | 'manuals' | 'competencies' | 'pathways' | 'capi'>('overview');

  // Interactive Modal States
  const [activeDrillId, setActiveDrillId] = useState<string | null>(null);
  const [activeManualId, setActiveManualId] = useState<string | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [capiModalOpen, setCapiModalOpen] = useState(false);
  const [karmaModalOpen, setKarmaModalOpen] = useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [drillToast, setDrillToast] = useState<{ points: number; message: string } | null>(null);

  // Compute readiness index & verified counts
  const totalSkills = profile.competencies.length;
  const verifiedSkills = profile.competencies.filter(
    (c) => c.evidenceType === 'assessment-verified'
  ).length;
  const metTargetCount = profile.competencies.filter(
    (c) => c.currentLevel >= c.targetLevel
  ).length;
  const readinessIndex = Math.round((metTargetCount / Math.max(1, totalSkills)) * 100);

  // Fallback persona for dossier modal
  const activePersona: DemoPersona = {
    id: user.id || 'demo-learner',
    name: (user.user_metadata?.name as string) || profile.name,
    email: user.email || 'learner@mospi.gov.in',
    role: 'learner',
    designation: (user.user_metadata?.designation as string) || profile.designation,
    cadre: (user.user_metadata?.cadre as string) || profile.cadre,
    department: profile.department,
    preferred_language: isHindi ? 'hi' : 'en',
    organization_id: 'org-mospi',
  };

  const handleStartDrill = (drillId: string) => {
    setActiveDrillId(drillId);
  };

  const handleOpenManual = (manualId: string) => {
    setActiveManualId(manualId);
  };

  const handleDrillComplete = (points: number) => {
    setDrillToast({
      points,
      message: isHindi
        ? `बधाई! आपके आधिकारिक कैडर प्रोफाइल में +${points} कर्म अंक जोड़ दिए गए हैं।`
        : `Congratulations! +${points} Karma Points have been credited to your official civil service dossier.`,
    });
  };

  const tabs = [
    {
      id: 'overview' as const,
      label: isHindi ? 'परिचालन कार्यक्षेत्र' : 'Operational Workspace',
      icon: LayoutDashboard,
    },
    {
      id: 'manuals' as const,
      label: isHindi ? 'फील्ड मैनुअल शेल्फ' : 'Field Manuals Shelf',
      icon: BookOpen,
    },
    {
      id: 'competencies' as const,
      label: isHindi ? 'FRAC क्षमता अंतर' : 'FRAC Competency Gaps',
      icon: Target,
    },
    {
      id: 'pathways' as const,
      label: isHindi ? 'सरकारी पाठ्यक्रम (Karmayogi Pathways)' : 'Government Courses (Karmayogi Pathways)',
      icon: GraduationCap,
    },
    {
      id: 'capi' as const,
      label: isHindi ? 'कैपी फील्ड स्टेशन' : 'CAPI Field Station',
      icon: Wifi,
    },
  ];

  return (
    <div data-testid="learner-dashboard" className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D8DFEE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1C4CA1]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#1F273A] tracking-tight">
              {isHindi ? 'अधिकारी क्षमता एवं प्रशिक्षण कार्यक्षेत्र' : 'Officer Competency & Learning Workspace'}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isHindi
              ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय • क्षमता विकास पोर्टल'
              : 'Ministry of Statistics & Programme Implementation • Capacity Building Ecosystem'}
          </p>
        </div>
      </div>

      {/* 5-Card Pastel KPI Strip (Image 2) */}
      <LearnerKpiStrip
        readinessIndex={readinessIndex}
        activeModulesCount={2}
        verifiedSkillsCount={verifiedSkills}
        totalSkillsCount={totalSkills}
        drillsCompleted={6}
        trainingHours={24}
        isHindi={isHindi}
        onSelectTab={(tab) => {
          if (tab === 'competencies' || tab === 'pathways' || tab === 'overview') {
            setActiveTab(tab);
          }
        }}
      />

      {/* Interactive Workspace Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#D8DFEE] text-xs font-bold scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#1C4CA1] text-white shadow-xs font-black'
                  : 'bg-white text-[#475569] hover:bg-[#EDF0F7] hover:text-[#1C4CA1] border border-[#D8DFEE]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#FFA72F]' : 'text-[#1C4CA1]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Operational Workspace (Default) */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Asymmetric Hero Bento (Image 1) */}
          <LearnerHeroBento
            user={user}
            profile={profile}
            isHindi={isHindi}
            readinessIndex={readinessIndex}
            onOpenDossier={() => setDossierModalOpen(true)}
            onOpenCapiModal={() => setCapiModalOpen(true)}
            onStartDrill={handleStartDrill}
            onViewGaps={() => setActiveTab('competencies')}
          />

          {/* Main Content Grid: Priority Competency Gaps & Government Courses Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Priority Competency Gaps (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <PriorityGapsCard
                competencies={profile.competencies}
                isHindi={isHindi}
                onBridgeGap={(competencyId) => router.push(`/assessment/${competencyId}`)}
                onViewAllGaps={() => setActiveTab('competencies')}
              />
            </div>

            {/* Right Column: Enrolled Courses Table (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <LearnerCoursesTable isHindi={isHindi} />
            </div>
          </div>

          {/* Horizontal Priority Drills Carousel */}
          <HorizontalDrillsCarousel
            onStartDrill={handleStartDrill}
            isHindi={isHindi}
          />

          {/* Horizontal Official MoSPI Field Manuals Shelf */}
          <MoSPIFieldManualsShelf
            isHindi={isHindi}
            onOpenManual={handleOpenManual}
          />
        </div>
      )}

      {/* Tab 2: Field Manuals & SOP Shelf */}
      {activeTab === 'manuals' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <MoSPIFieldManualsShelf
            isHindi={isHindi}
            onOpenManual={handleOpenManual}
          />
          <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1F273A]">
              {isHindi ? 'डिजिटल मैनुअल खोज एवं वैधानिक संदर्भ' : 'Digital Manual Search & Statutory Repository'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isHindi
                ? 'सभी मैनुअल एनएसएसटीए और राष्ट्रीय सांख्यिकी आयोग (NSC) द्वारा प्रमाणित हैं।'
                : 'All statutory guidelines are certified by NSSTA and the National Statistical Commission (NSC).'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleOpenManual('manual-plfs-vol1')}
                className="p-4 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE] text-left hover:border-[#1C4CA1]/50 hover:bg-[#EDF0F7] transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-[10px] font-bold text-[#1C4CA1] uppercase tracking-wider block mb-1">
                  NSSO FOD
                </span>
                <p className="font-bold text-xs text-[#1F273A]">PLFS Vol 1: Instructions</p>
                <p className="text-[11px] text-muted-foreground mt-1">184 Pages • Ver 2026.1</p>
              </button>
              <button
                type="button"
                onClick={() => handleOpenManual('manual-schedule-0')}
                className="p-4 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE] text-left hover:border-[#1C4CA1]/50 hover:bg-[#EDF0F7] transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-[10px] font-bold text-[#1164BE] uppercase tracking-wider block mb-1">
                  SDRD
                </span>
                <p className="font-bold text-xs text-[#1F273A]">Schedule 0.0 Demarcation</p>
                <p className="text-[11px] text-muted-foreground mt-1">96 Pages • Ver 2025.4</p>
              </button>
              <button
                type="button"
                onClick={() => handleOpenManual('manual-capi-handbook')}
                className="p-4 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE] text-left hover:border-[#1C4CA1]/50 hover:bg-[#EDF0F7] transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  DPD
                </span>
                <p className="font-bold text-xs text-[#1F273A]">ASHE & CAPI Tablet Protocol</p>
                <p className="text-[11px] text-muted-foreground mt-1">64 Pages • Ver 2026.2</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: FRAC Competency Gaps & Interactive D3 Sunburst */}
      {activeTab === 'competencies' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#D8DFEE]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1C4CA1]" />
                  <h2 className="text-lg font-bold text-[#1F273A]">
                    {isHindi ? 'इंटरएक्टिव FRAC सनरबर्स्ट दक्षता पदानुक्रम' : 'Interactive FRAC Sunburst Competency Hierarchy'}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isHindi
                    ? 'डी3.जेएस विज़ुअलाइज़ेशन • डोमेन, उप-डोमेन और L1-L5 दक्षताओं का अन्वेषण करें'
                    : 'D3.js Visualization • Drill down across Domains, Subdomains, and L1-L5 Competency Levels'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EDF0F7] text-[#1C4CA1] border border-[#D8DFEE] self-start sm:self-auto">
                D3 v7 Zoomable Engine
              </span>
            </div>
            <FracSunburstHierarchy />
          </div>

          <PriorityGapsCard
            competencies={profile.competencies}
            isHindi={isHindi}
            onBridgeGap={(competencyId) => router.push(`/assessment/${competencyId}`)}
          />
          <HorizontalDrillsCarousel
            onStartDrill={handleStartDrill}
            isHindi={isHindi}
          />
        </div>
      )}

      {/* Tab 4: Karmayogi Pathways */}
      {activeTab === 'pathways' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <KarmayogiPathwaysTrack isHindi={isHindi} />
          <LearnerCoursesTable isHindi={isHindi} />
        </div>
      )}

      {/* Tab 5: CAPI Field Station */}
      {activeTab === 'capi' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <CAPIFieldStationTab isHindi={isHindi} />
        </div>
      )}

      {/* Active Interactive Modals */}
      <LearnerDrillModal
        isOpen={!!activeDrillId}
        onClose={() => setActiveDrillId(null)}
        drillId={activeDrillId || undefined}
        onComplete={handleDrillComplete}
        isHindi={isHindi}
      />

      <ManualReaderModal
        isOpen={!!activeManualId}
        onClose={() => setActiveManualId(null)}
        manualId={activeManualId || undefined}
        isHindi={isHindi}
      />

      <OfficerDossierModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        persona={activePersona}
        isHindi={isHindi}
      />

      <CAPIConnectivityModal
        isOpen={capiModalOpen}
        onClose={() => setCapiModalOpen(false)}
        isHindi={isHindi}
        isOfflineSimulated={isOfflineSimulated}
        onToggleOfflineSimulated={() => setIsOfflineSimulated(!isOfflineSimulated)}
      />

      <LearnerKarmaLedgerModal
        isOpen={karmaModalOpen}
        onClose={() => setKarmaModalOpen(false)}
        isHindi={isHindi}
      />

      {/* In-Website Toast for Drill Karma Credit */}
      {drillToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-[#1F273A] text-white px-5 py-4 rounded-2xl shadow-2xl border border-[#D8DFEE]/20 flex items-center gap-3.5 max-w-md">
            <div className="h-10 w-10 rounded-xl bg-[#FFA72F]/20 text-[#FFA72F] flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#FFA72F]">
                {isHindi ? 'कर्म अंक अर्जित!' : 'Karma Points Earned!'}
              </p>
              <p className="text-xs text-white/90 leading-snug mt-0.5">
                {drillToast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrillToast(null)}
              aria-label="Close notification"
              className="text-white/60 hover:text-white p-1 rounded-lg cursor-pointer transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
