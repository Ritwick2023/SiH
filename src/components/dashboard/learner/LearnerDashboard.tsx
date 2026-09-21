'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardUserProps } from '@/components/dashboard/RoleDashboardRouter';
import { getPersonaFRAC } from '@/data/fracCadres';
import { LearnerKpiStrip } from './LearnerKpiStrip';
import { PriorityGapsCard } from './PriorityGapsCard';
import { LearnerCoursesTable } from './LearnerCoursesTable';
import { MoSPIFieldManualsShelf } from './MoSPIFieldManualsShelf';
import { HorizontalDrillsCarousel } from './HorizontalDrillsCarousel';
import { KarmayogiPathwaysTrack } from './KarmayogiPathwaysTrack';
import { LearnerDrillModal } from './modals/LearnerDrillModal';
import { ManualReaderModal } from './modals/ManualReaderModal';
import { OfficerDossierModal } from './modals/OfficerDossierModal';
import { BridgeGapRemediationModal } from './modals/BridgeGapRemediationModal';
import { useSafeLocale } from '@/lib/useSafeLocale';
import { Award, X } from 'lucide-react';
import type { DemoPersona } from '@/lib/types';
import type { FRACCompetencyDef } from '@/data/fracCadres';

export default function LearnerDashboard({ user }: { user: DashboardUserProps }) {
  const router = useRouter();
  const profile = getPersonaFRAC(user);

  const globalLocale = useSafeLocale(user.user_metadata?.preferred_language || (user.id?.includes('sunita') ? 'hi' : 'en'));
  const isHindi =
    globalLocale === 'hi' ||
    user.user_metadata?.preferred_language === 'hi' ||
    profile.preferredLanguage === 'hi' ||
    user.id?.includes('sunita');

  // Modal States
  const [activeDrillId, setActiveDrillId] = useState<string | null>(null);
  const [activeManualId, setActiveManualId] = useState<string | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [selectedBridgeGapComp, setSelectedBridgeGapComp] = useState<FRACCompetencyDef | null>(null);
  const [drillToast, setDrillToast] = useState<{ points: number; message: string } | null>(null);

  // Compute readiness index
  const totalSkills = profile.competencies.length;
  const verifiedSkills = profile.competencies.filter(
    (c) => c.evidenceType === 'assessment-verified'
  ).length;
  const metTargetCount = profile.competencies.filter(
    (c) => c.currentLevel >= c.targetLevel
  ).length;
  const readinessIndex = Math.round((metTargetCount / Math.max(1, totalSkills)) * 100);

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

  const handleStartDrill = (drillId: string) => setActiveDrillId(drillId);
  const handleOpenManual = (manualId: string) => setActiveManualId(manualId);

  const handleBridgeGap = (competencyId: string) => {
    const comp = profile.competencies.find((c) => c.id === competencyId);
    if (comp) {
      setSelectedBridgeGapComp(comp);
    } else {
      router.push('/skill-gap');
    }
  };

  const handleDrillComplete = (points: number) => {
    setDrillToast({
      points,
      message: isHindi
        ? `बधाई! आपके प्रोफाइल में +${points} पॉइंट जोड़ दिए गए।`
        : `Well done! +${points} points added to your profile.`,
    });
  };

  const displayName = (user.user_metadata?.name as string) || profile.name;
  const greeting = isHindi
    ? `नमस्ते, ${displayName.split(' ')[0]}!`
    : `Hello, ${displayName.split(' ')[0]}!`;

  return (
    <div data-testid="learner-dashboard" className="space-y-8 pb-12">

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D8DFEE]">
        <div>
          <h1 className="text-2xl font-black text-[#1F273A] tracking-tight">
            {greeting}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isHindi
              ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय • क्षमता विकास पोर्टल'
              : 'Ministry of Statistics & Programme Implementation • Training & Learning Portal'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDossierModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#EDF0F7] hover:bg-[#1C4CA1] hover:text-white text-[#1C4CA1] border border-[#D8DFEE] transition-all cursor-pointer"
        >
          {isHindi ? 'मेरी प्रोफाइल देखें' : 'View My Profile'}
        </button>
      </div>

      {/* 2-Card Progress Summary */}
      <LearnerKpiStrip
        readinessIndex={readinessIndex}
        activeModulesCount={2}
        verifiedSkillsCount={verifiedSkills}
        totalSkillsCount={totalSkills}
        drillsCompleted={6}
        trainingHours={24}
        isHindi={isHindi}
      />

      {/* Section: My Skill Gaps */}
      <section className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#1F273A]">
            {isHindi ? 'कौशल में सुधार की जरूरत' : 'Skills That Need Improvement'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {isHindi ? 'आपकी भूमिका के अनुसार' : 'Based on your role'}
          </span>
        </div>
        <PriorityGapsCard
          competencies={profile.competencies}
          isHindi={isHindi}
          onBridgeGap={handleBridgeGap}
          onViewAllGaps={() => router.push('/skill-gap')}
        />
      </section>

      {/* Section: My Courses */}
      <section className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#1F273A]">
            {isHindi ? 'मेरे पाठ्यक्रम' : 'My Courses'}
          </h2>
        </div>
        <LearnerCoursesTable isHindi={isHindi} />
      </section>

      {/* Section: Practice Quizzes */}
      <section className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#1F273A]">
            {isHindi ? 'अभ्यास प्रश्नोत्तरी' : 'Practice Quizzes'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {isHindi ? 'अपनी तैयारी जांचें' : 'Test your knowledge'}
          </span>
        </div>
        <HorizontalDrillsCarousel
          onStartDrill={handleStartDrill}
          isHindi={isHindi}
        />
      </section>

      {/* Section: Government Training Courses */}
      <section className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#1F273A]">
            {isHindi ? 'सरकारी प्रशिक्षण पाठ्यक्रम' : 'Government Training Courses'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {isHindi ? 'iGOT कर्मयोगी पर उपलब्ध' : 'Available on iGOT Karmayogi'}
          </span>
        </div>
        <KarmayogiPathwaysTrack isHindi={isHindi} />
      </section>

      {/* Section: Reference Documents */}
      <section className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#1F273A]">
            {isHindi ? 'संदर्भ दस्तावेज़' : 'Reference Documents'}
          </h2>
          <span className="text-xs text-muted-foreground">
            {isHindi ? 'आधिकारिक गाइड और निर्देश' : 'Official guides & instructions'}
          </span>
        </div>
        <MoSPIFieldManualsShelf
          isHindi={isHindi}
          onOpenManual={handleOpenManual}
        />
      </section>

      {/* Modals */}
      <BridgeGapRemediationModal
        isOpen={!!selectedBridgeGapComp}
        onClose={() => setSelectedBridgeGapComp(null)}
        competency={selectedBridgeGapComp}
        isHindi={isHindi}
        onOpenManual={handleOpenManual}
        onStartDrill={handleStartDrill}
      />

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

      {/* Toast notification */}
      {drillToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-[#1F273A] text-white px-5 py-4 rounded-2xl shadow-2xl border border-[#D8DFEE]/20 flex items-center gap-3.5 max-w-md">
            <div className="h-10 w-10 rounded-xl bg-[#FFA72F]/20 text-[#FFA72F] flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#FFA72F]">
                {isHindi ? 'अंक अर्जित!' : 'Points Earned!'}
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
