'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import type { RadarDataPoint } from '@/components/RadarChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { ProgressRing } from '@/components/ProgressRing';

const RadarChart = dynamic(
  () => import('@/components/RadarChart').then((mod) => mod.RadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-64 items-center justify-center">
        <div className="h-48 w-48 rounded-full bg-muted/40 animate-pulse" />
      </div>
    ),
  }
);
import { Award, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { getPersonaFRAC } from '@/data/fracCadres';
import { CompetencyService } from '@/services/competencyService';
import type { AppUser } from '@/lib/auth';
import { useSafeLocale } from '@/lib/useSafeLocale';
import { DigiLockerBadge } from '@/components/profile/DigiLockerBadge';

interface CompetencyRecord {
  competencyId: string;
  competencyName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  evidenceType: 'assessment-verified' | 'self-assessed';
  lastUpdated: string;
}

interface CompetencyHistoryEntry {
  date: string;
  level: number;
  source: 'self-assessment' | 'course-completion' | 'assessment-score';
}

interface ProfileData {
  name: string;
  email: string;
  designation: string;
  cadre: string;
  department: string;
  organization: string;
  role: string;
  karmaPoints: number;
  aparMilestone: string;
  readinessIndex: number;
  joinedDate: string;
  assessmentsCompleted: number;
  coursesCompleted: number;
  competencyRecords: CompetencyRecord[];
  competencyHistory: Record<string, CompetencyHistoryEntry[]>;
}

function buildPersonaProfileData(user?: AppUser | null, isHindiLang?: boolean): ProfileData {
  const profile = getPersonaFRAC(user);
  const isHindi = isHindiLang ?? (user?.user_metadata?.preferred_language === 'hi' || profile.preferredLanguage === 'hi');

  const competencyRecords: CompetencyRecord[] = profile.competencies.map((comp) => ({
    competencyId: comp.id,
    competencyName: isHindi ? comp.name_hi : comp.name,
    category: comp.category,
    currentLevel: comp.currentLevel,
    targetLevel: comp.targetLevel,
    evidenceType: comp.evidenceType,
    lastUpdated: '2026-08-15',
  }));

  const userRecords = new Map(profile.competencies.map((c) => [c.id, c.currentLevel]));
  const required = profile.competencies.map((c) => ({ competencyId: c.id, targetLevel: c.targetLevel }));
  const readinessIndex = CompetencyService.computeReadinessIndex(required, userRecords);

  const competencyHistory: Record<string, CompetencyHistoryEntry[]> = {};
  profile.competencies.forEach((c) => {
    competencyHistory[c.id] = [
      {
        date: '2026-08-15',
        level: c.currentLevel,
        source: c.evidenceType === 'assessment-verified' ? 'assessment-score' : 'self-assessment',
      },
      {
        date: '2026-03-10',
        level: Math.max(1, c.currentLevel - 1),
        source: 'self-assessment',
      },
    ];
  });

  return {
    name: profile.name,
    email: profile.email,
    designation: isHindi ? profile.designation_hi : profile.designation,
    cadre: profile.cadre,
    department: isHindi ? profile.department_hi : profile.department,
    organization: isHindi ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)' : 'Ministry of Statistics and Programme Implementation (MoSPI)',
    role: isHindi ? profile.designation_hi : profile.designation,
    karmaPoints: profile.personaId.includes('sunita') ? 1450 : 1820,
    aparMilestone: isHindi ? '2025-2026: बेंचमार्क लक्ष्य पार किया' : '2025-2026: Benchmark Target Exceeded',
    readinessIndex,
    joinedDate: '2023-06-15',
    assessmentsCompleted: 6,
    coursesCompleted: 4,
    competencyRecords,
    competencyHistory,
  };
}

export default function ProfileClient({ user }: { user?: AppUser | null }) {
  const t = useTranslations();
  const locale = useSafeLocale(user?.user_metadata?.preferred_language || 'en');
  const isHindi = locale === 'hi';
  const data = useMemo(() => buildPersonaProfileData(user, isHindi), [user, isHindi]);
  const [activeTab, setActiveTab] = useState<'overview' | 'competencies' | 'history'>('overview');

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile data unavailable</p>
      </div>
    );
  }

  // Build radar data from competency records
  const radarData: RadarDataPoint[] = data.competencyRecords.map((record) => ({
    label: record.competencyName.split(' ').slice(0, 2).join(' '),
    current: record.currentLevel,
    target: record.targetLevel,
  }));

  // Group competencies by category
  const byCategory = data.competencyRecords.reduce((acc, record) => {
    if (!acc[record.category]) acc[record.category] = [];
    acc[record.category].push(record);
    return acc;
  }, {} as Record<string, CompetencyRecord[]>);

  const categoryStyles: Record<string, { bg: string; dot: string }> = {
    Behavioural: {
      bg: 'bg-white',
      dot: 'bg-[#BF9B7A]',
    },
    Functional: {
      bg: 'bg-white',
      dot: 'bg-[#8C5B3E]',
    },
    Domain: {
      bg: 'bg-white',
      dot: 'bg-[#555934]',
    },
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header Profile Card */}
      <div className="rounded-2xl bg-white p-7 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-18 h-18 rounded-2xl bg-[#555934] flex items-center justify-center text-white text-2xl font-bold shadow-sm ring-4 ring-[#555934]/10">
              {data.name.split(' ').map((n) => n[0]).join('')}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#2d1f17] tracking-tight">{data.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#555934]/12 px-3 py-0.5 text-xs font-semibold text-[#555934]">
                  <Sparkles className="h-3 w-3" />
                  {data.role}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{data.designation}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span className="font-medium text-[#2d1f17]">{data.department}</span>
                <span>•</span>
                <span>{data.cadre}</span>
                <span>•</span>
                <span>{data.organization}</span>
              </div>
            </div>
          </div>

          {/* Key Metric Stats */}
          <div className="flex items-center gap-6 sm:gap-8 bg-[#F2E6D8]/50 rounded-2xl px-6 py-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#555934] font-mono">
                {data.karmaPoints.toLocaleString()}
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                {isHindi ? 'कर्म अंक' : 'Karma Points'}
              </p>
            </div>
            <div className="h-8 w-px bg-muted" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-chart-5 font-mono">
                {data.assessmentsCompleted}
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                {isHindi ? 'मूल्यांकन' : 'Assessments'}
              </p>
            </div>
            <div className="h-8 w-px bg-muted" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#BF9B7A] font-mono">
                {data.coursesCompleted}
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                {isHindi ? 'पाठ्यक्रम' : 'Courses'}
              </p>
            </div>
          </div>
        </div>

        {/* APAR Milestone Banner */}
        <div className="mt-6 p-4 rounded-xl bg-[#F2E6D8]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#555934]/15 text-[#555934]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('profile.aparMilestone')}</p>
              <p className="text-base font-bold text-[#2d1f17] mt-0.5">{data.aparMilestone}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#555934] text-white shadow-2xs">
            {isHindi ? 'आधिकारिक रेटिंग' : 'Official Rating'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#F2E6D8] gap-2">
        {(['overview', 'competencies', 'history'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-[#555934] text-[#555934]'
                  : 'border-transparent text-muted-foreground hover:text-[#2d1f17]'
              }`}
            >
              {tab === 'overview'
                ? isHindi ? 'अवलोकन' : 'Overview'
                : tab === 'competencies'
                ? isHindi ? 'FRAC क्षमताएं' : 'FRAC Competencies'
                : isHindi ? 'प्रगति इतिहास' : 'Growth History'}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readiness Ring Card */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#2d1f17]">
                  {t('dashboard.readinessIndex')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isHindi ? 'समग्र आधिकारिक मूल्यांकन' : 'Composite official evaluation'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#555934] bg-[#555934]/12 px-3 py-1 rounded-full">
                {data.readinessIndex}%
              </span>
            </div>
            <div className="flex justify-center py-4">
              <ProgressRing
                value={data.readinessIndex}
                size={180}
                label={isHindi ? 'तत्परता' : 'Readiness'}
                sublabel={`${data.competencyRecords.filter((c) => c.currentLevel >= c.targetLevel).length}/${data.competencyRecords.length} ${isHindi ? 'लक्ष्य पर' : 'at target'}`}
              />
            </div>
          </div>

          {/* Competency Radar Card */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#2d1f17]">
                  {t('profile.competencyRadar')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isHindi ? 'वर्तमान बनाम पद मानक' : 'Current versus role benchmark'}
                </p>
              </div>
            </div>
            <div className="flex justify-center py-2">
              <RadarChart data={radarData} size={290} showLegend />
            </div>
          </div>

          {/* Sovereign DigiLocker W3C Verifiable Credential Card (Task C4) */}
          <div className="col-span-1 lg:col-span-2">
            <DigiLockerBadge />
          </div>
        </div>
      )}

      {/* Tab Content: Competencies */}
      {activeTab === 'competencies' && (
        <div className="space-y-6">
          {Object.entries(byCategory).map(([category, records]) => {
            const style = categoryStyles[category] || categoryStyles.Domain;
            return (
              <div
                key={category}
                className={`rounded-2xl ${style.bg} p-6 shadow-card`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#2d1f17] flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    {category} {isHindi ? 'दक्षताएं' : 'Competencies'}
                  </h3>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {records.length} {isHindi ? 'ट्रैक की गईं' : 'Tracked'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {records.map((record) => {
                    const isTargetMet = record.currentLevel >= record.targetLevel;
                    const isNearTarget = record.currentLevel === record.targetLevel - 1;

                    return (
                      <div
                        key={record.competencyId}
                        className="bg-[#F2E6D8]/30 rounded-2xl p-4.5 transition-all hover:bg-[#F2E6D8]/50"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h4 className="text-sm font-semibold text-[#2d1f17]">
                              {record.competencyName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <ProvenanceBadge provenance="PROPOSED_FRAMEWORK" showLabel={false} size="sm" />
                              {record.evidenceType === 'assessment-verified' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#555934]/12 text-[#555934]">
                                  <CheckCircle2 className="h-3 w-3" /> {isHindi ? 'सत्यापित' : 'Verified'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#BF9B7A]/20 text-chart-5">
                                  {isHindi ? 'स्व-मूल्यांकित' : 'Self-Assessed'}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {record.lastUpdated}
                          </span>
                        </div>

                        {/* Level Progress */}
                        <div className="space-y-1.5 mt-3 pt-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{isHindi ? 'वर्तमान स्तर' : 'Current Level'}</span>
                            <span className="font-bold font-mono text-[#2d1f17]">
                              L{record.currentLevel} / L{record.targetLevel}
                            </span>
                          </div>

                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isTargetMet
                                  ? 'bg-[#555934]'
                                  : isNearTarget
                                  ? 'bg-[#BF9B7A]'
                                  : 'bg-[#8C5B3E]'
                              }`}
                              style={{ width: `${(record.currentLevel / 5) * 100}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
                            <span>{isHindi ? 'मानक:' : 'Benchmark:'} L{record.targetLevel}</span>
                            {isTargetMet ? (
                              <span className="text-[#555934] font-semibold">
                                {isHindi ? '✓ लक्ष्य हासिल' : '✓ Target Achieved'}
                              </span>
                            ) : (
                              <span className="text-[#8C5B3E] font-semibold">
                                {record.targetLevel - record.currentLevel} {isHindi ? 'स्तर आवश्यक' : 'Level Needed'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Growth History */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#2d1f17]">
                {t('profile.growthHistory')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'प्रमाणित मूल्यांकनों और स्व-मूल्यांकन का ऑडिट ट्रेल' : 'Audit trail of validated assessments and self-ratings'}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(data.competencyHistory).map(([competencyId, history]) => {
              const record = data.competencyRecords.find((r) => r.competencyId === competencyId);
              if (!record) return null;

              return (
                <div key={competencyId} className="space-y-3">
                  <h4 className="text-sm font-bold text-[#2d1f17] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#555934]" />
                    {record.competencyName}
                  </h4>
                  <div className="relative pl-6 space-y-3">
                    {history.map((entry, idx) => (
                      <div key={idx} className="relative">
                        <div className="bg-[#F2E6D8]/35 rounded-2xl p-4 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#2d1f17]">
                              Achieved Level {entry.level}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(entry.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                                entry.source === 'assessment-score'
                                  ? 'bg-[#555934]/15 text-[#555934]'
                                  : entry.source === 'course-completion'
                                  ? 'bg-[#BF9B7A]/20 text-chart-5'
                                  : 'bg-[#F2E6D8] text-muted-foreground'
                              }`}
                            >
                              {entry.source === 'assessment-score'
                                ? '📝 Proctored Assessment Score'
                                : entry.source === 'course-completion'
                                ? '📚 iGOT Karmayogi Course Completion'
                                : '✍️ Officer Self-Rating'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Provenance Footer */}
      <div className="rounded-2xl bg-white/70 p-4 flex items-start gap-3 shadow-card">
        <span className="text-lg">ℹ️</span>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong className="text-[#2d1f17]">Official Record:</strong> This profile displays verified FRAC competency records and evaluation histories for MoSPI personnel.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span>Framework:</span>
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={true} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
