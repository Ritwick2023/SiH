'use client';

/**
 * src/app/(app)/assessment/[id]/test/TestResultsView.tsx
 *
 * Comprehensive Post-Assessment Results & Detailed Review Screen
 * Evaluates performance, displays MoSPI official citations, explains rationales,
 * awards Karma points, and links directly to Skill Gap & iGOT Pathways.
 */

import { useState } from 'react';
import Link from 'next/link';
import type { Assessment } from '@/data/assessments';
import type { ScoreResult } from '@/services/assessmentEngine';
import { useSafeLocale } from '@/lib/useSafeLocale';
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Check,
  AlertCircle,
} from 'lucide-react';

interface TestResultsViewProps {
  assessment: Assessment;
  score: ScoreResult;
  userAnswers: Record<string, number>;
  promotedLevel: number;
  onRetakeTest: () => void;
}

export default function TestResultsView({
  assessment,
  score,
  userAnswers,
  promotedLevel,
  onRetakeTest,
}: TestResultsViewProps) {
  const globalLocale = useSafeLocale();
  const [activeTab, setActiveTab] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [userOverrideLang, setUserOverrideLang] = useState<'en' | 'hi' | null>(null);

  const language = userOverrideLang ?? (globalLocale === 'hi' ? 'hi' : 'en');
  const isHindi = language === 'hi';
  const isPassed = score.percentageCorrect >= 70;
  const karmaPointsEarned = isPassed ? 50 : 20;

  const filteredQuestions = assessment.questions.filter((q) => {
    const isCorrect = userAnswers[q.id] === q.correctAnswer;
    if (activeTab === 'incorrect') return !isCorrect;
    if (activeTab === 'correct') return isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Celebration & Score Header */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8b9a6e]/15 text-[#5f6c48] mb-2">
              <Award className="w-3.5 h-3.5" />
              {isHindi ? 'आधिकारिक सांख्यिकी मूल्यांकन परिणाम' : 'Official MoSPI Assessment Result'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {isHindi && assessment.title_hi ? assessment.title_hi : assessment.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isHindi
                ? 'मिशन कर्मयोगी दिशानिर्देशों के तहत योग्यता मूल्यांकन संपन्न'
                : 'Competency Evaluation completed under Mission Karmayogi guidelines'}
            </p>
          </div>

          {/* Bilingual Toggle */}
          <button
            onClick={() => setUserOverrideLang(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
          >
            {language === 'en' ? '🇮🇳 हिन्दी में देखें' : '🇬🇧 Switch to English'}
          </button>
        </div>

        {/* Score Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl border border-border bg-stone-50/50 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isHindi ? 'स्कोर' : 'Score'}
            </p>
            <p className="text-3xl font-extrabold text-foreground mt-1 font-mono">
              {score.correct} / {score.total}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {score.percentageCorrect}% {isHindi ? 'सही' : 'Correct'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-stone-50/50 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isHindi ? 'परिणाम' : 'Result'}
            </p>
            <p className={`text-xl font-bold mt-1.5 ${isPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isPassed ? (isHindi ? 'सत्यापित ✓' : 'Verified ✓') : (isHindi ? 'प्रगति पर' : 'In Progress')}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isPassed ? (isHindi ? 'मानदंड पूर्ण' : 'Benchmark Met') : (isHindi ? 'समीक्षा आवश्यक' : 'Review Required')}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-stone-50/50 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isHindi ? 'प्राप्त स्तर' : 'Level Achieved'}
            </p>
            <p className="text-3xl font-extrabold text-primary mt-1 font-mono">
              L{promotedLevel}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isHindi ? 'दक्षता प्रोन्नत' : 'Proficiency Promoted'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-stone-50/50 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isHindi ? 'कर्म अंक' : 'Karma Points'}
            </p>
            <p className="text-3xl font-extrabold text-[#c9963a] mt-1 font-mono">
              +{karmaPointsEarned}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isHindi ? 'अपार मील का पत्थर' : 'APAR Milestone'}
            </p>
          </div>
        </div>

        {/* Achievement Banner */}
        <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 border ${
          isPassed
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          {isPassed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-sm">
            <p className="font-bold">
              {isPassed
                ? (isHindi
                    ? `बधाई हो! आपने स्तर ${promotedLevel} की दक्षता हासिल कर ली है।`
                    : `Congratulations! You have demonstrated Level ${promotedLevel} competency.`)
                : (isHindi
                    ? 'मूल्यांकन पूर्ण। शेष कमियों को दूर करने के लिए नीचे दिए गए प्रश्न स्पष्टीकरणों की समीक्षा करें।'
                    : 'Assessment complete. Review the question explanations below to target remaining gaps.')}
            </p>
            <p className="text-xs mt-0.5 opacity-90">
              {isHindi
                ? 'आपका FRAC योग्यता रिकॉर्ड स्वचालित रूप से अपडेट हो गया है और आपके व्यक्तिगत डैशबोर्ड के साथ समन्वयित है।'
                : 'Your FRAC Competency Record has been updated automatically and synchronized with your personal Dashboard.'}
            </p>
          </div>
        </div>
      </div>

      {/* Question Breakdown & Citations Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isHindi ? 'विस्तृत प्रश्न समीक्षा एवं संदर्भ' : 'Detailed Question Review & Citations'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isHindi
                ? 'आधिकारिक MoSPI संचालन नियमावली और राष्ट्रीय सांख्यिकीय मानकों पर आधारित उत्तरों की समीक्षा करें।'
                : 'Review answers grounded in official MoSPI Operational Manuals and National Statistical standards.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${activeTab === 'all' ? 'bg-white shadow-2xs text-foreground' : 'text-muted-foreground'}`}
            >
              {isHindi ? `सभी (${score.total})` : `All (${score.total})`}
            </button>
            <button
              onClick={() => setActiveTab('incorrect')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${activeTab === 'incorrect' ? 'bg-white shadow-2xs text-rose-700 font-bold' : 'text-muted-foreground'}`}
            >
              {isHindi ? `गलत (${score.total - score.correct})` : `Incorrect (${score.total - score.correct})`}
            </button>
            <button
              onClick={() => setActiveTab('correct')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${activeTab === 'correct' ? 'bg-white shadow-2xs text-emerald-700' : 'text-muted-foreground'}`}
            >
              {isHindi ? `सही (${score.correct})` : `Correct (${score.correct})`}
            </button>
          </div>
        </div>

        {/* Question Cards */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const userChoiceIndex = userAnswers[q.id];
            const isCorrect = userChoiceIndex === q.correctAnswer;
            const questionText = (language === 'hi' && q.question_hi) ? q.question_hi : q.question;
            const options = (language === 'hi' && q.options_hi) ? q.options_hi : q.options;

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-white'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {isHindi ? 'प्रश्न' : 'Q'}{assessment.questions.indexOf(q) + 1}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {isCorrect ? (isHindi ? 'सही' : 'Correct') : (isHindi ? 'गलत' : 'Incorrect')}
                    </span>
                  </div>
                </div>

                {/* Question Stem */}
                <h3 className="text-base font-semibold text-foreground mb-4 leading-relaxed">
                  {questionText}
                </h3>

                {/* Options List */}
                <div className="space-y-2 mb-4">
                  {options.map((option, optIdx) => {
                    const isSelected = userChoiceIndex === optIdx;
                    const isRightAnswer = q.correctAnswer === optIdx;

                    let optionStyle = 'border-border bg-white text-foreground/80';
                    if (isRightAnswer) {
                      optionStyle = 'border-emerald-400 bg-emerald-50/60 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border text-sm flex items-start gap-3 transition-colors ${optionStyle}`}
                      >
                        <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          isRightAnswer
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : isSelected
                            ? 'border-rose-600 bg-rose-600 text-white'
                            : 'border-stone-400 text-stone-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <div className="flex-1">
                          <span>{option}</span>
                          {isSelected && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {isHindi ? '(आपका उत्तर)' : '(Your Answer)'}
                            </span>
                          )}
                          {isRightAnswer && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              {isHindi ? '(सही उत्तर)' : '(Correct Answer)'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Grounding & Citation Note */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-[#8b9a6e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900">
                      {isHindi ? 'MoSPI नियमावली संदर्भ: ' : 'MoSPI Manual Reference: '}
                    </span>
                    <span>
                      {q.id.startsWith('capi')
                        ? (isHindi
                            ? 'CAPI संचालन प्रोटोकॉल 2024 (mospi.gov.in) — अध्याय 3: फील्ड प्रोटोकॉल और डेटा अखंडता'
                            : 'CAPI Operational Protocol 2024 (mospi.gov.in) — Chapter 3: Field Protocol & Data Integrity')
                        : q.id.startsWith('s0')
                        ? (isHindi
                            ? 'NSS फील्ड स्टाफ के लिए निर्देश भाग I — अध्याय 3: अनुसूची 0.0 परिवारों की सूची'
                            : 'NSS Instructions to Field Staff Vol. I — Chapter 3: Schedule 0.0 Listing of Households')
                        : q.id.startsWith('plfs')
                        ? (isHindi
                            ? 'आवधिक श्रम बल सर्वेक्षण दिशानिर्देश — खंड 2: सामान्य और साप्ताहिक गतिविधि स्थिति अवधारणाएं'
                            : 'Periodic Labour Force Survey Guidelines — Section 2: Usual & Weekly Activity Status Concepts')
                        : q.id.startsWith('scrutiny')
                        ? (isHindi
                            ? 'SSS संवर्ग के लिए सांख्यिकीय संवीक्षा नियमावली — अध्याय 4: संगति जांच और आउटलायर पहचान'
                            : 'Statistical Scrutiny Manual for SSS Cadre — Chapter 4: Consistency Checks & Outlier Detection')
                        : (isHindi
                            ? 'आधिकारिक सांख्यिकी प्रणाली मानक और निर्णय सिद्धांत'
                            : 'Official Statistical Systems Standards & Decision Principles')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer CTAs */}
      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onRetakeTest}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-stone-50 transition-colors w-full sm:w-auto justify-center cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          {isHindi ? 'पुनः मूल्यांकन दें' : 'Retake Assessment'}
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/skill-gap"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
          >
            {isHindi ? 'कौशल अंतर देखें' : 'View Skill Gap'}
          </Link>

          <Link
            href="/pathways"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1b365d] hover:bg-[#132742] text-white text-sm font-bold transition-colors shadow-xs"
          >
            {isHindi ? 'अनुशंसित मार्ग' : 'Recommended Pathways'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
