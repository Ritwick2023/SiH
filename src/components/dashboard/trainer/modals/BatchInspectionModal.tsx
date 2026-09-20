'use client';

import React, { useState } from 'react';
import {
  X,
  Users,
  GraduationCap,
  Download,
  CheckCircle2,
  Search,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';

export interface TraineeRecord {
  id: string;
  name: string;
  cadre: string;
  designation: string;
  center: string;
  score: number;
  drillsCompleted: number;
  status: 'SAFE' | 'WATCH' | 'CRITICAL';
  weakCompetency: string;
}

export interface CohortData {
  id: string;
  code: string;
  name: string;
  cadre: string;
  center: string;
  enrolled: number;
  avgScore: number;
  progress: number;
  atRiskCount: number;
  director: string;
  startDate: string;
  endDate: string;
  trainees?: TraineeRecord[];
}

const DEFAULT_TRAINEES: TraineeRecord[] = [
  {
    id: 'tr-01',
    name: 'Amit Sharma',
    cadre: 'Indian Statistical Service (ISS)',
    designation: 'Junior Statistical Officer',
    center: 'NSSTA Greater Noida',
    score: 52,
    drillsCompleted: 14,
    status: 'WATCH',
    weakCompetency: 'comp-demarcation (Census Boundary Demarcation)',
  },
  {
    id: 'tr-02',
    name: 'Sunita Devi',
    cadre: 'NSSO Field Operations Division',
    designation: 'Field Investigator',
    center: 'ZTC Kolkata',
    score: 44,
    drillsCompleted: 9,
    status: 'CRITICAL',
    weakCompetency: 'comp-capi (CAPI Tablet Operations)',
  },
  {
    id: 'tr-03',
    name: 'Vikramaditya Rao',
    cadre: 'Subordinate Statistical Service (SSS)',
    designation: 'Statistical Investigator Gr. II',
    center: 'ZTC Nagpur',
    score: 78,
    drillsCompleted: 22,
    status: 'SAFE',
    weakCompetency: 'None (Proficient in sampling)',
  },
  {
    id: 'tr-04',
    name: 'Deepika Nair',
    cadre: 'Data Quality Assurance Division (DQAD)',
    designation: 'Assistant Director',
    center: 'MoSPI HQ Delhi',
    score: 86,
    drillsCompleted: 26,
    status: 'SAFE',
    weakCompetency: 'comp-data (Scrutiny Consistency)',
  },
  {
    id: 'tr-05',
    name: 'Rohan Mehra',
    cadre: 'NSSO Field Operations Division',
    designation: 'Field Investigator',
    center: 'ZTC Lucknow',
    score: 48,
    drillsCompleted: 11,
    status: 'CRITICAL',
    weakCompetency: 'comp-nsso (PLFS Schedule 10.4)',
  },
  {
    id: 'tr-06',
    name: 'Kavita Sundaram',
    cadre: 'Economic Statistics Division (ESD)',
    designation: 'Junior Statistical Officer',
    center: 'ZTC Chennai',
    score: 64,
    drillsCompleted: 18,
    status: 'WATCH',
    weakCompetency: 'comp-survey (ASI Multiplier Calculation)',
  },
];

interface BatchInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohort: CohortData | null;
  onOpenRemediation?: (cohort: CohortData) => void;
}

export function BatchInspectionModal({
  isOpen,
  onClose,
  cohort,
  onOpenRemediation,
}: BatchInspectionModalProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CRITICAL' | 'WATCH' | 'SAFE'>('ALL');
  const [activeTab, setActiveTab] = useState<'roster' | 'competencies' | 'timeline'>('roster');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

  if (!isOpen || !cohort) return null;

  const trainees = cohort.trainees || DEFAULT_TRAINEES;
  const filteredTrainees = trainees.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.designation.toLowerCase().includes(search.toLowerCase()) ||
      t.center.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    setCopiedMessage(`Exported roster for ${cohort.name} to CSV.`);
    setTimeout(() => setCopiedMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#D8DFEE] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#D8DFEE] bg-[#EDF0F7]/60">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20 font-mono">
                {cohort.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white text-muted-foreground border border-[#D8DFEE]">
                {cohort.center}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#1164BE]/10 text-[#1164BE]">
                Director: {cohort.director}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F273A] tracking-tight">
              {cohort.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {cohort.cadre} • Term: {cohort.startDate} to {cohort.endDate}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-[#D8DFEE] text-muted-foreground hover:bg-[#EDF0F7] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Cohort Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-[#EDF0F7]/40 border-b border-[#D8DFEE]">
          <div className="p-3 rounded-xl bg-white border border-[#D8DFEE]">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Enrolled Cadre</p>
            <p className="text-xl font-extrabold text-[#1F273A] font-mono mt-0.5">
              {cohort.enrolled} <span className="text-xs font-normal text-muted-foreground">Officers</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D8DFEE]">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Cohort Mean Score</p>
            <p className="text-xl font-extrabold text-[#1C4CA1] font-mono mt-0.5">
              {cohort.avgScore}% <span className="text-xs font-normal text-muted-foreground">Pass Rate</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D8DFEE]">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Syllabus Progress</p>
            <p className="text-xl font-extrabold text-[#FFA72F] font-mono mt-0.5">
              {cohort.progress}% <span className="text-xs font-normal text-muted-foreground">Completed</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D8DFEE]">
            <p className="text-[10px] font-bold uppercase text-red-700">At-Risk Deficit</p>
            <p className="text-xl font-extrabold text-red-600 font-mono mt-0.5">
              {cohort.atRiskCount} <span className="text-xs font-normal text-muted-foreground">Officers &lt;60%</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-[#D8DFEE] bg-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'roster'
                  ? 'border-[#1C4CA1] text-[#1C4CA1]'
                  : 'border-transparent text-muted-foreground hover:text-[#1F273A]'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Officer Roster ({trainees.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('competencies')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'competencies'
                  ? 'border-[#1C4CA1] text-[#1C4CA1]'
                  : 'border-transparent text-muted-foreground hover:text-[#1F273A]'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Curriculum Masteries</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'border-[#1C4CA1] text-[#1C4CA1]'
                  : 'border-transparent text-muted-foreground hover:text-[#1F273A]'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Academic Milestones</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1 rounded-lg bg-[#EDF0F7] border border-[#D8DFEE] text-xs font-semibold text-[#1C4CA1] hover:bg-[#D8DFEE] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Roster</span>
            </button>
          </div>
        </div>

        {copiedMessage && (
          <div className="mx-6 mt-3 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{copiedMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'roster' && (
            <div className="space-y-3">
              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search officer, designation or center..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#D8DFEE] text-xs text-[#1F273A] focus:outline-none focus:ring-1 focus:ring-[#1C4CA1]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {(['ALL', 'CRITICAL', 'WATCH', 'SAFE'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        filterStatus === st
                          ? 'bg-[#1C4CA1] text-white'
                          : 'bg-[#EDF0F7] text-muted-foreground hover:bg-[#D8DFEE]'
                      }`}
                    >
                      {st === 'ALL' ? 'All Trainees' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trainee Table */}
              <div className="overflow-x-auto rounded-xl border border-[#D8DFEE]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDF0F7] border-b border-[#D8DFEE] text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Officer</th>
                      <th className="py-2.5 px-3">Cadre & Center</th>
                      <th className="py-2.5 px-3">Readiness</th>
                      <th className="py-2.5 px-3">Weak Competency</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8DFEE] bg-white">
                    {filteredTrainees.map((trainee) => (
                      <tr key={trainee.id} className="hover:bg-[#EDF0F7]/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-[#1C4CA1]/10 text-[#1C4CA1] flex items-center justify-center font-bold text-[11px] font-mono shrink-0">
                              {trainee.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-[#1F273A]">{trainee.name}</p>
                              <p className="text-[10px] text-muted-foreground">{trainee.designation}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="text-[#1F273A] font-medium">{trainee.cadre}</p>
                          <p className="text-[10px] text-muted-foreground">{trainee.center}</p>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-[#1F273A] text-sm">
                              {trainee.score}%
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                                trainee.status === 'CRITICAL'
                                  ? 'bg-red-500/15 text-red-700'
                                  : trainee.status === 'WATCH'
                                    ? 'bg-amber-500/15 text-amber-700'
                                    : 'bg-emerald-500/15 text-emerald-700'
                              }`}
                            >
                              {trainee.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[11px] font-mono text-[#1C4CA1] font-medium">
                            {trainee.weakCompetency}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenRemediation?.(cohort);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#EDF0F7] hover:bg-[#1C4CA1] hover:text-white text-[#1C4CA1] text-[11px] font-bold border border-[#D8DFEE] transition-all cursor-pointer"
                          >
                            Remediate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'competencies' && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Aggregated mastery scores across mandatory MoSPI operational protocols for {cohort.name}:
              </p>
              <div className="space-y-3">
                {[
                  {
                    code: 'comp-demarcation',
                    title: 'Census Boundary Demarcation & Hamlet-Groups (Schedule 0.0)',
                    score: 58,
                    target: 75,
                    gap: '-17%',
                    critical: true,
                  },
                  {
                    code: 'comp-capi',
                    title: 'CAPI Tablet Operations, Offline Sync & GPS Lock',
                    score: 64,
                    target: 80,
                    gap: '-16%',
                    critical: true,
                  },
                  {
                    code: 'comp-nsso',
                    title: 'NSSO Activity Classification (PLFS Schedule 10.4)',
                    score: 72,
                    target: 75,
                    gap: '-3%',
                    critical: false,
                  },
                  {
                    code: 'comp-survey',
                    title: 'Sampling Multipliers & First Stage Unit Weighting',
                    score: 68,
                    target: 75,
                    gap: '-7%',
                    critical: false,
                  },
                  {
                    code: 'comp-data',
                    title: 'Inter-Record Scrutiny Rules & Validation Formulae',
                    score: 84,
                    target: 80,
                    gap: '+4%',
                    critical: false,
                  },
                ].map((c) => (
                  <div key={c.code} className="p-4 rounded-xl bg-[#EDF0F7]/40 border border-[#D8DFEE] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-[#1C4CA1] mr-2">
                          {c.code}
                        </span>
                        <span className="font-bold text-[#1F273A]">{c.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1F273A]">{c.score}%</span>
                        <span className="text-[10px] text-muted-foreground">(Target: {c.target}%)</span>
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            c.critical ? 'bg-red-500/15 text-red-700' : 'bg-emerald-500/15 text-emerald-700'
                          }`}
                        >
                          {c.gap}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#D8DFEE] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          c.critical ? 'bg-amber-600' : 'bg-[#1C4CA1]'
                        }`}
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  {
                    week: 'Week 1',
                    milestone: 'Foundational Induction & Statistical Systems Overview',
                    status: 'Completed',
                    date: '10 Aug 2026',
                  },
                  {
                    week: 'Week 2',
                    milestone: 'Schedule 0.0 Demarcation & Field Handbook Practicum',
                    status: 'Completed',
                    date: '17 Aug 2026',
                  },
                  {
                    week: 'Week 3',
                    milestone: 'CAPI Tablet Simulation & GPS Geofencing Trials',
                    status: 'In Progress (Active Deficit Detected)',
                    date: '24 Aug 2026',
                  },
                  {
                    week: 'Week 4',
                    milestone: 'Final Statutory Comprehensive Evaluation (Mid-Term)',
                    status: 'Scheduled',
                    date: '02 Sep 2026',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#EDF0F7]/40 border border-[#D8DFEE] flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-[#1C4CA1] uppercase tracking-wider">
                        {item.week}
                      </span>
                      <p className="text-xs font-bold text-[#1F273A] mt-0.5">{item.milestone}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.status}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-white px-2 py-1 rounded-lg border border-[#D8DFEE]">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#D8DFEE] bg-[#EDF0F7]/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-[#1C4CA1]" />
            <span>NSSTA Course Director Academic Governance</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#D8DFEE] text-xs font-bold text-muted-foreground hover:bg-[#EDF0F7] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRemediation?.(cohort);
              }}
              className="px-4 py-2 rounded-xl bg-[#FFA72F] text-[#1F273A] text-xs font-bold hover:bg-[#E08D18] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dispatch Remedial Drill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchInspectionModal;
