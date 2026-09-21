'use client';

import React from 'react';
import Link from 'next/link';
import type { OfficialLearningItem } from '@/data/officialLearningCatalog';
import type { AppUser } from '@/lib/auth';
import { getPersonaFRAC } from '@/data/fracCadres';
import {
  ArrowLeft,
  ExternalLink,
  PlayCircle,
  Building2,
  ShieldCheck,
  BookmarkCheck,
  FileEdit,
  CheckCircle2,
} from 'lucide-react';

interface CourseDetailClientProps {
  item: OfficialLearningItem;
  user?: AppUser | null;
}

export default function CourseDetailClient({ item, user }: CourseDetailClientProps) {
  const profile = getPersonaFRAC(user);
  const isHindi =
    user?.user_metadata?.preferred_language === 'hi' ||
    profile.preferredLanguage === 'hi' ||
    user?.id?.includes('sunita');

  const title = isHindi && item.title_hi ? item.title_hi : item.title;
  const description = isHindi && item.description_hi ? item.description_hi : item.description;
  const provider = isHindi && item.provider_hi ? item.provider_hi : item.provider;
  const mappingRationale = isHindi && item.statvidya_mapping_rationale_hi
    ? item.statvidya_mapping_rationale_hi
    : item.statvidya_mapping_rationale;

  // Check if learner has a gap in any of the target competencies
  const relevantGaps = profile.competencies.filter((comp) =>
    item.targetCompetencies.includes(comp.id)
  );

  const primaryCompetencyId = item.targetCompetencies[0] || 'comp-capi';

  const typeLabels: Record<string, { en: string; hi: string; color: string }> = {
    workshop: { en: 'Virtual Workshop', hi: 'वर्चुअल कार्यशाला', color: 'bg-emerald-500/12 text-emerald-700' },
    training_programme: { en: 'Training Programme', hi: 'प्रशिक्षण कार्यक्रम', color: 'bg-blue-500/12 text-blue-700' },
    residential_course: { en: 'Residential Course', hi: 'आवासीय पाठ्यक्रम', color: 'bg-purple-500/12 text-purple-700' },
    field_manual: { en: 'Statutory Field Manual', hi: 'वैधानिक फील्ड मैनुअल', color: 'bg-[#1C4CA1]/10 text-[#1C4CA1]' },
    technical_protocol: { en: 'Technical Protocol', hi: 'तकनीकी प्रोटोकॉल', color: 'bg-[#FFA72F]/15 text-[#FFA72F]' },
    classification_compendium: { en: 'Classification Standard', hi: 'वर्गीकरण निर्देशिका', color: 'bg-amber-500/12 text-amber-800' },
    igot_demo: { en: 'iGOT Demo Module', hi: 'कर्मयोगी डेमो मॉड्यूल', color: 'bg-slate-500/12 text-slate-700' },
  };

  const currentType = typeLabels[item.source_type] || { en: 'Learning Resource', hi: 'शिक्षण संसाधन', color: 'bg-slate-100 text-slate-700' };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link
          href="/pathways"
          className="inline-flex items-center gap-1 hover:text-[#1C4CA1] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isHindi ? 'सभी शिक्षण संसाधन पर वापस' : 'Back to Learning Hub'}</span>
        </Link>
        <span>/</span>
        <span className="text-[#1F273A] truncate">{title}</span>
      </div>

      {/* Hero Card */}
      <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Top Badges Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D8DFEE]">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentType.color}`}>
              {isHindi ? currentType.hi : currentType.en}
            </span>

            {item.provenance === 'VERIFIED_OFFICIAL' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#1C4CA1]/10 text-[#1C4CA1]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{isHindi ? 'सत्यापित आधिकारिक स्रोत' : 'Verified Official Source'}</span>
              </span>
            ) : item.provenance === 'PROPOSED_FRAMEWORK' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFA72F]/15 text-amber-800">
                <FileEdit className="h-3.5 w-3.5" />
                <span>{isHindi ? 'प्रस्तावित FRAC ढांचा' : 'FRAC Competency Framework'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#1164BE]/10 text-[#1164BE]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isHindi ? 'मान्यता प्राप्त पाठ्यचर्या' : 'Accredited Curriculum'}</span>
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#EDF0F7] text-[#1F273A]">
              {item.language}
            </span>
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            {item.official_circular_ref && (
              <span className="bg-[#EDF0F7] px-2.5 py-1 rounded-lg border border-[#D8DFEE]">
                Ref: {item.official_circular_ref}
              </span>
            )}
          </div>
        </div>

        {/* Title & Provider */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F273A] tracking-tight leading-snug">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[#FFA72F] font-semibold">
            <Building2 className="h-4 w-4 shrink-0 text-[#1C4CA1]" />
            <span>{provider}</span>
          </div>
        </div>

        {/* Key Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#EDF0F7] p-4 rounded-2xl border border-[#D8DFEE] text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">
              {isHindi ? 'अवधि / विस्तार' : 'Duration / Scope'}
            </span>
            <strong className="text-[#1F273A] font-semibold">
              {item.duration || (isHindi ? 'स्व-अध्ययन' : 'Self-Paced')}
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">
              {isHindi ? 'प्रारूप' : 'Format'}
            </span>
            <strong className="text-[#1F273A] font-semibold">{item.content_type}</strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">
              {isHindi ? 'स्रोत डोमेन' : 'Official Domain'}
            </span>
            <strong className="text-[#1C4CA1] font-semibold font-mono">{item.source_domain}</strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">
              {isHindi ? 'सत्यापन तिथि' : 'Verified On'}
            </span>
            <strong className="text-[#1F273A] font-semibold font-mono">{item.last_verified_at}</strong>
          </div>
        </div>

        {/* Detailed Overview */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#1F273A]">
            {isHindi ? 'संक्षिप्त विवरण एवं विषय-वस्तु' : 'Official Description & Overview'}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Topics Covered */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {isHindi ? 'शामिल प्रमुख विषय (कवर किए गए विषय)' : 'Key Topics Covered'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {item.topics.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#D8DFEE] text-xs font-medium text-[#1F273A]"
              >
                ✓ {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Government Role Relevance */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {isHindi ? 'लक्षित सरकारी कैडर एवं पद' : 'Target Government Cadres & Roles'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {item.government_role_relevance.map((role, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-[#1C4CA1]/10 text-xs font-semibold text-[#1C4CA1]"
              >
                🏛️ {role}
              </span>
            ))}
          </div>
        </div>

        {/* Competency Gap Alignment Box */}
        <div className="rounded-2xl border-2 border-[#1C4CA1]/20 bg-[#1C4CA1]/5 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-[#1C4CA1]" />
                <h3 className="text-sm font-bold text-[#1F273A]">
                  {isHindi ? 'FRAC क्षमता मैपिंग एवं प्रासंगिकता' : 'FRAC Competency Alignment'}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mappingRationale}
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-muted-foreground border border-[#D8DFEE] shrink-0">
              StatVidya Mapping
            </span>
          </div>

          {/* Active Gaps Comparison */}
          {relevantGaps.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#1C4CA1]/20">
              <span className="text-xs font-bold text-[#FFA72F] block">
                {isHindi ? 'आपके प्रोफाइल में सक्रिय अंतराल:' : 'Active Gaps Addressed for Your Profile:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relevantGaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="p-3 rounded-xl bg-white border border-[#D8DFEE] flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#1F273A] block font-semibold">
                        {isHindi && gap.name_hi ? gap.name_hi : gap.name}
                      </strong>
                      <span className="text-muted-foreground text-[11px] capitalize">
                        Priority: {gap.priority}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-muted-foreground">Current: <strong>L{gap.currentLevel}</strong></span>
                      <span className="text-[#FFA72F] mx-1">→</span>
                      <span className="text-[#1C4CA1] font-bold">Target: L{gap.targetLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Deck */}
        <div className="pt-4 border-t border-[#D8DFEE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1F273A] hover:bg-[#2C3B59] text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <span>{isHindi ? 'आधिकारिक स्रोत पोर्टल खोलें' : 'Open Official Source Portal'}</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <Link
            href={`/assessment/${primaryCompetencyId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1C4CA1] hover:bg-[#1164BE] text-white text-xs font-bold transition-all shadow-sm active:scale-98"
          >
            <PlayCircle className="h-4 w-4" />
            <span>{isHindi ? 'क्षमता का परीक्षण करें (मूल्यांकन दें)' : 'Test Competency / Take Diagnostic'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
