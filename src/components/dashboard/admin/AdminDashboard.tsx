'use client';

import React, { useState } from 'react';
import { AdminKpiStrip } from './AdminKpiStrip';
import { HorizontalZonalHealthCarousel } from './HorizontalZonalHealthCarousel';
import { DepartmentBreakdownTable } from './DepartmentBreakdownTable';
import { AdminAiNarrativeBox } from './AdminAiNarrativeBox';
import { OutcomeCorrelationChart } from './OutcomeCorrelationChart';
import { FracSunburstHierarchy } from '@/components/charts/FracSunburstHierarchy';
import { AdminCabinetDrawer } from './AdminCabinetDrawer';
import { HorizontalPolicyDirectivesCarousel, type PolicyDirectiveData } from './HorizontalPolicyDirectivesCarousel';
import { MinisterialBriefingModal } from './modals/MinisterialBriefingModal';
import { NationalCadreRosterModal } from './modals/NationalCadreRosterModal';
import { CommissionSweepModal } from './modals/CommissionSweepModal';
import { RegionalDetailModal } from './modals/RegionalDetailModal';
import { NationalReadinessModal } from './modals/NationalReadinessModal';
import { FlaggedRegionsModal } from './modals/FlaggedRegionsModal';
import type { DepartmentMetric } from '@/services/adminDashboardService';
import type { AppUser } from '@/lib/auth';
import {
  ShieldCheck,
  Users,
  FileText,
  MapPin,
  TrendingDown,
  LayoutGrid,
  Map,
  Send,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardProps {
  user: AppUser;
  isHindi?: boolean;
}

export function AdminDashboard({ user, isHindi = false }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'zonal_ro' | 'scrutiny_correlation' | 'policy_circulars' | 'governance_orders'
  >('overview');

  // Interactive Modal State
  const [briefingModalOpen, setBriefingModalOpen] = useState(false);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [sweepModalOpen, setSweepModalOpen] = useState(false);
  const [readinessModalOpen, setReadinessModalOpen] = useState(false);
  const [flaggedModalOpen, setFlaggedModalOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<DepartmentMetric | null>(null);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);

  // In-website status feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const adminName = user.user_metadata?.name || 'Dr. Rajeshwar Kumar, ISS';
  const adminDesignation =
    user.user_metadata?.designation || 'Additional Director General (Training & Cadre)';
  const adminCadre = user.user_metadata?.cadre || 'Indian Statistical Service (MoSPI)';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleInspectOffice = (office: DepartmentMetric) => {
    setSelectedOffice(office);
    setOfficeModalOpen(true);
  };

  const handleReadCircular = (directive: PolicyDirectiveData) => {
    showToast(`Accessing official policy circular: ${directive.circularNo || directive.title}`);
  };

  const handleKpiClick = (kpiId: string) => {
    if (kpiId === 'headcount') {
      setRosterModalOpen(true);
    } else if (kpiId === 'readiness') {
      setReadinessModalOpen(true);
    } else if (kpiId === 'error_rate') {
      setActiveTab('scrutiny_correlation');
    } else if (kpiId === 'flagged') {
      setFlaggedModalOpen(true);
    } else if (kpiId === 'cohorts') {
      setActiveTab('policy_circulars');
    }
  };

  return (
    <div data-testid="admin-dashboard" className="space-y-6 pb-16">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-[#1C4CA1] text-white text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#FFA72F]" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white cursor-pointer px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Administrative Profile */}
      <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#1C4CA1] text-white flex items-center justify-center text-xl font-bold font-serif shrink-0 shadow-xs">
              RK
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  National Executive Command
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF0F7] text-[#475569] border border-[#D8DFEE]">
                  {adminCadre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FFA72F]/15 text-[#1F273A] border border-[#FFA72F]/30">
                  ISS Senior SAG
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F273A] tracking-tight">
                {adminName}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#1164BE] mt-0.5">
                {adminDesignation} • Workforce Strategy &amp; Statistical Governance
              </p>
              <p className="text-xs text-[#475569] flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#1C4CA1]" />
                Ministry of Statistics &amp; Programme Implementation, Sardar Patel Bhawan, New Delhi
              </p>
            </div>
          </div>

          {/* Quick Action Pills in Header */}
          <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 pt-2 md:pt-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBriefingModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F273A] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Download className="h-3.5 w-3.5 text-[#FFA72F]" />
                <span>Secretary Memo (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setRosterModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D8DFEE] text-xs font-bold text-[#1C4CA1] hover:bg-[#EDF0F7] transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Cadre Roster</span>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#EDF0F7]/60 border border-[#D8DFEE] text-right hidden sm:block">
              <span className="text-[10px] font-bold text-[#475569] block">Statistical Authority</span>
              <span className="text-xs font-black text-[#1C4CA1]">National Sample Survey (NSS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Card Macro KPI Strip with interactive onKpiClick */}
      <AdminKpiStrip onKpiClick={handleKpiClick} />

      {/* Multi-Deck Workspace Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#1C4CA1] text-white shadow-xs font-black'
              : 'bg-white text-[#475569] border border-[#D8DFEE] hover:bg-[#EDF0F7]'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>{isHindi ? 'कार्यकारी कमान' : 'Executive Command'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'zonal_ro'}
          onClick={() => setActiveTab('zonal_ro')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'zonal_ro'
              ? 'bg-[#1C4CA1] text-white shadow-xs font-black'
              : 'bg-white text-[#475569] border border-[#D8DFEE] hover:bg-[#EDF0F7]'
          }`}
        >
          <Map className="h-3.5 w-3.5" />
          <span>{isHindi ? 'क्षेत्रीय संवर्ग स्वास्थ्य' : 'Regional Cadre Health'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'scrutiny_correlation'}
          onClick={() => setActiveTab('scrutiny_correlation')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'scrutiny_correlation'
              ? 'bg-[#1C4CA1] text-white shadow-xs font-black'
              : 'bg-white text-[#475569] border border-[#D8DFEE] hover:bg-[#EDF0F7]'
          }`}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          <span>{isHindi ? 'परिणाम सहसंबंध विश्लेषण' : 'Outcome Regression'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'policy_circulars'}
          onClick={() => setActiveTab('policy_circulars')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'policy_circulars'
              ? 'bg-[#1C4CA1] text-white shadow-xs font-black'
              : 'bg-white text-[#475569] border border-[#D8DFEE] hover:bg-[#EDF0F7]'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>{isHindi ? 'नीति निर्देश' : 'Policy Directives'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'governance_orders'}
          onClick={() => setActiveTab('governance_orders')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'governance_orders'
              ? 'bg-[#1C4CA1] text-white shadow-xs font-black'
              : 'bg-white text-[#475569] border border-[#D8DFEE] hover:bg-[#EDF0F7]'
          }`}
        >
          <Send className="h-3.5 w-3.5" />
          <span>{isHindi ? 'मंत्रिमंडल दराज' : 'Cabinet Drawer'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW (EXECUTIVE COMMAND CENTER) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Horizontal Zonal Health Deck */}
          <HorizontalZonalHealthCarousel
            onInspectZone={handleInspectOffice}
            onDispatchTriage={(zone) => {
              showToast(`NSSTA Triage team dispatched to ${zone}!`);
              setFlaggedModalOpen(true);
            }}
          />

          {/* AI Executive Intelligence Briefing */}
          <AdminAiNarrativeBox />

          {/* Horizontal Policy Directives & Cabinet Circulars Deck */}
          <HorizontalPolicyDirectivesCarousel onReadCircular={handleReadCircular} />

          {/* FRAC Competency Sunburst Hierarchy (Task C1) */}
          <FracSunburstHierarchy />

          {/* Outcome Correlation Scatter Chart (PRD Lever 2 & §9.4.5) */}
          <OutcomeCorrelationChart />

          {/* Regional Office Breakdown & Ministerial Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <DepartmentBreakdownTable onInspectOffice={handleInspectOffice} />
            </div>
            <div className="lg:col-span-4">
              <AdminCabinetDrawer
                onOpenBriefingModal={() => setBriefingModalOpen(true)}
                onOpenRosterModal={() => setRosterModalOpen(true)}
                onOpenSweepModal={() => setSweepModalOpen(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ZONAL & REGIONAL HEALTH */}
      {activeTab === 'zonal_ro' && (
        <div className="space-y-6">
          <HorizontalZonalHealthCarousel
            onInspectZone={handleInspectOffice}
            onDispatchTriage={(zone) => {
              showToast(`NSSTA Triage team dispatched to ${zone}!`);
              setFlaggedModalOpen(true);
            }}
          />
          <DepartmentBreakdownTable onInspectOffice={handleInspectOffice} />
        </div>
      )}

      {/* TAB 3: OUTCOME REGRESSION (PRD §9.4.5) */}
      {activeTab === 'scrutiny_correlation' && (
        <div className="space-y-6">
          <OutcomeCorrelationChart />
          <AdminAiNarrativeBox />
        </div>
      )}

      {/* TAB 4: POLICY DIRECTIVES & CABINET CIRCULARS */}
      {activeTab === 'policy_circulars' && (
        <div className="space-y-6">
          <HorizontalPolicyDirectivesCarousel onReadCircular={handleReadCircular} />
          <div className="p-6 rounded-3xl bg-white border border-[#D8DFEE] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D8DFEE]">
              <ShieldCheck className="h-4 w-4 text-[#1C4CA1]" />
              <h3 className="font-bold text-[#1F273A] text-sm">
                National Data Governance &amp; Cadre Compliance Overview
              </h3>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              All 5 statutory policy circulars are issued under the joint authority of the Cabinet Secretariat, 
              Ministry of Statistics &amp; Programme Implementation, and National Statistical Commission (NSC).
              Mandated compliance milestones are audited bi-weekly through the automated CAPI scrutiny pipeline.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE] text-center">
                <span className="text-[10px] text-[#475569] block">Mandated Surveys</span>
                <span className="text-lg font-black font-mono text-[#1C4CA1]">PLFS, ASHE, HCES</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE] text-center">
                <span className="text-[10px] text-[#475569] block">Average Compliance</span>
                <span className="text-lg font-black font-mono text-emerald-700">71.5%</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE] text-center">
                <span className="text-[10px] text-[#475569] block">Next Enforcement Audit</span>
                <span className="text-lg font-black font-mono text-[#1164BE]">15 Oct 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOVERNANCE ORDERS & CABINET DRAWER */}
      {activeTab === 'governance_orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <AdminCabinetDrawer
                onOpenBriefingModal={() => setBriefingModalOpen(true)}
                onOpenRosterModal={() => setRosterModalOpen(true)}
                onOpenSweepModal={() => setSweepModalOpen(true)}
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-[#D8DFEE] shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#1F273A]">
                  Statutory Ministerial Instruments
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Generate executive legal briefing instruments and deploy nationwide assessment sweeps 
                  for the National Statistical Systems Training Academy (NSSTA).
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSweepModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-all cursor-pointer shadow-xs flex items-center justify-between"
                  >
                    <span>Authorize Q3 National Assessment Sweep</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRosterModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#D8DFEE] text-[#1C4CA1] text-xs font-bold hover:bg-[#EDF0F7] transition-all cursor-pointer shadow-2xs flex items-center justify-between"
                  >
                    <span>Inspect Complete 4,850 Officer Registry</span>
                    <Users className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBriefingModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1F273A] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-2xs flex items-center justify-between"
                  >
                    <span>Open Confidential Secretary Briefing Memo</span>
                    <Download className="h-3.5 w-3.5 text-[#FFA72F]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOUNTED EXECUTIVE MODALS */}
      <MinisterialBriefingModal
        isOpen={briefingModalOpen}
        onClose={() => setBriefingModalOpen(false)}
      />

      <NationalCadreRosterModal
        isOpen={rosterModalOpen}
        onClose={() => setRosterModalOpen(false)}
      />

      <CommissionSweepModal
        isOpen={sweepModalOpen}
        onClose={() => setSweepModalOpen(false)}
        onSuccess={(id) => showToast(`Executive Order ${id} successfully authorized!`)}
      />

      <RegionalDetailModal
        isOpen={officeModalOpen}
        onClose={() => setOfficeModalOpen(false)}
        office={selectedOffice}
        onDispatchTriage={(name) => showToast(`NSSTA Triage dispatched to ${name}!`)}
      />

      <NationalReadinessModal
        isOpen={readinessModalOpen}
        onClose={() => setReadinessModalOpen(false)}
      />

      <FlaggedRegionsModal
        isOpen={flaggedModalOpen}
        onClose={() => setFlaggedModalOpen(false)}
        onDispatchIntervention={(name) => showToast(`Intervention ordered for ${name}!`)}
      />
    </div>
  );
}

export default AdminDashboard;
