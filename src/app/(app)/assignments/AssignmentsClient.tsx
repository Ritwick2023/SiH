'use client';

/**
 * src/app/(app)/assignments/AssignmentsClient.tsx
 *
 * Lists all available assessments as cards.
 * Visual language mirrors PathwaysClient card grid.
 */

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSafeLocale } from '@/lib/useSafeLocale';
import { getAssessmentMetas } from '@/data/assessments';
import { ClipboardCheck, Clock, BookOpen, ChevronRight, Brain } from 'lucide-react';

const iconByIndex = [
  '📱', // CAPI Operations
  '🗺️', // Schedule 0.0 & UFS Demarcation
  '📊', // PLFS Survey
  '📋', // Statistical Scrutiny
  '🧩', // Problem Solving
  '🔍', // Critical Thinking
  '💬', // Communication
  '⚖️', // Decision Making
];

const accentByIndex = [
  { badge: 'bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20', btn: 'bg-[#1C4CA1] hover:bg-[#153a7b]' },
  { badge: 'bg-[#1164BE]/10 text-[#1164BE] border border-[#1164BE]/20', btn: 'bg-[#1164BE] hover:bg-[#0e529d]' },
  { badge: 'bg-[#FFA72F]/15 text-[#b86f0a] border border-[#FFA72F]/30', btn: 'bg-[#1C4CA1] hover:bg-[#153a7b]' },
  { badge: 'bg-[#1F273A]/10 text-[#1F273A] border border-[#1F273A]/20', btn: 'bg-[#1F273A] hover:bg-[#2C3B59]' },
];

export default function AssignmentsClient() {
  const t = useTranslations();
  const locale = useSafeLocale();
  const isHindi = locale === 'hi';
  const metas = getAssessmentMetas();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
            🏛️ MoSPI Statutory Assessments
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#1F273A]">
          {t('nav.assessment')}
        </h1>
        <p className="text-[#1F273A]/70">
          {isHindi
            ? 'नीचे दिए गए परीक्षणों में से एक चुनें। प्रत्येक परीक्षण का अपना टाइमर होता है जो केवल "परीक्षा शुरू करें" पर क्लिक करने के बाद प्रारंभ होता है।'
            : 'Select an assessment below. Each test has its own timer that begins only after you click "Start Test".'}
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isHindi ? 'उपलब्ध परीक्षण' : 'Available Tests', value: metas.length.toString(), color: 'text-[#1C4CA1]' },
          { label: isHindi ? 'प्रत्येक में प्रश्न' : 'Questions Each', value: '10', color: 'text-[#1164BE]' },
          { label: isHindi ? 'समय सीमा' : 'Time Limit', value: isHindi ? '5-10 मिनट' : '5-10 min', color: 'text-[#FFA72F]' },
          { label: isHindi ? 'प्रश्न प्रकार' : 'Question Type', value: isHindi ? 'बहुविकल्पीय' : 'MCQ', color: 'text-[#1F273A]' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white border border-[#D8DFEE] p-4 shadow-card hover:shadow-card-hover transition-all text-center"
          >
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Self-paced Quiz & Practice Station Banner */}
      <div className="rounded-2xl border border-[#D8DFEE] bg-linear-to-r from-[#EDF0F7] via-white to-[#EDF0F7] p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-[#1C4CA1]/10 flex items-center justify-center text-[#1C4CA1] shrink-0">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1F273A]">
                {isHindi ? 'स्व-गति अभ्यास एवं एमसीक्यू स्टेशन' : 'Self-Paced Practice & MCQ Station'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1C4CA1]/10 text-[#1C4CA1]">
                {isHindi ? 'MoSPI आधारित' : 'MoSPI Grounded'}
              </span>
            </div>
            <p className="text-xs text-[#1F273A]/70 mt-0.5">
              {isHindi
                ? 'मूल्यांकन से पहले आधिकारिक MoSPI मैनुअल (CAPI, अनुसूची 0.0, PLFS) से कस्टम अभ्यास प्रश्न उत्पन्न करें।'
                : 'Generate targeted practice questions and test knowledge from MoSPI field manuals before statutory assessments.'}
            </p>
          </div>
        </div>
        <Link
          href="/mcq-generator"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#153a7b] transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span>{isHindi ? 'अभ्यास स्टेशन खोलें' : 'Launch Practice Station'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Assessment Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1F273A]">
          {isHindi ? 'उपलब्ध मूल्यांकन' : 'Available Assessments'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metas.map((meta, idx) => {
            const accent = accentByIndex[idx % accentByIndex.length];
            const durationMins = Math.round(meta.durationSeconds / 60);
            const title = (isHindi && meta.title_hi) ? meta.title_hi : meta.title;
            const description = (isHindi && meta.description_hi) ? meta.description_hi : meta.description;

            return (
              <div
                key={meta.id}
                className="rounded-2xl bg-white border border-[#D8DFEE] p-6 shadow-card hover:shadow-card-hover transition-all group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl" role="img" aria-label={title}>
                        {iconByIndex[idx % iconByIndex.length]}
                      </span>
                      <h3 className="text-xl font-bold text-[#1F273A] group-hover:text-[#1C4CA1] transition-colors">
                        {title}
                      </h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${accent.badge}`}>
                      <ClipboardCheck className="w-3 h-3" />
                      {isHindi ? 'बहुविकल्पीय' : meta.type}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#1F273A]/70 leading-relaxed mb-5">
                  {description}
                </p>

                {/* Meta Pills */}
                <div className="flex items-center gap-4 text-sm text-[#1F273A]/70 mb-6">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#1C4CA1]" />
                    <span className="font-medium text-[#1F273A]">{meta.totalQuestions}</span> {isHindi ? 'प्रश्न' : 'Questions'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#1C4CA1]" />
                    <span className="font-medium text-[#1F273A]">{durationMins}</span> {isHindi ? 'मिनट' : 'Minutes'}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  id={`take-assessment-${meta.id}`}
                  href={`/assessment/${meta.id}/instructions`}
                  prefetch={true}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-xs active:scale-95 ${accent.btn}`}
                >
                  {isHindi ? 'मूल्यांकन प्रारंभ करें' : 'Take Assessment'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] px-5 py-4 text-sm text-[#1F273A]/80">
        <p>
          <strong className="text-[#1F273A]">{isHindi ? 'नोट:' : 'Note:'}</strong>{' '}
          {isHindi
            ? 'प्रत्येक मूल्यांकन के लिए टाइमर निर्देश पढ़ने और "परीक्षा शुरू करें" पर क्लिक करने के बाद ही शुरू होता है। आप अंतिम सबमिशन से पहले अपने उत्तरों की समीक्षा कर सकते हैं।'
            : 'The timer for each assessment begins only after you read the instructions and click Start Test. You can review your answers before final submission.'}
        </p>
      </div>
    </div>
  );
}
