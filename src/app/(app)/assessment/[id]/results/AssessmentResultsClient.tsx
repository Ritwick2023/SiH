'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  BarChart2, 
  BookOpen 
} from 'lucide-react';
import type { AppUser } from '@/lib/auth';

interface AssessmentResultsClientProps {
  competencyId: string;
  competencyName: string;
  competencyNameHi?: string;
  finalLevel: string;
  scorePercent: number;
  user?: AppUser | null;
}

export default function AssessmentResultsClient({
  competencyId,
  competencyName,
  competencyNameHi,
  finalLevel,
  scorePercent,
  user,
}: AssessmentResultsClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const isHindi = locale === 'hi' || user?.user_metadata?.preferred_language === 'hi';

  const displayName = isHindi ? competencyNameHi || competencyName : competencyName;
  const levelNumber = parseInt(finalLevel.replace(/\D/g, ''), 10) || 3;

  // Level description lookup
  const levelDescriptions: Record<number, { en: string; hi: string }> = {
    1: { en: 'Basic Awareness & Operational Recall', hi: 'बुनियादी जागरूकता और परिचालन स्मरण' },
    2: { en: 'Guided Field Execution under Supervision', hi: 'पर्यवेक्षण के तहत निर्देशित फ़ील्ड निष्पादन' },
    3: { en: 'Independent Validation & Operational Mastery', hi: 'स्वतंत्र सत्यापन और परिचालन निपुणता' },
    4: { en: 'Expert Troubleshooting, Auditing & Peer Mentoring', hi: 'विशेषज्ञ समस्या निवारण, ऑडिटिंग और मार्गदर्शन' },
    5: { en: 'Strategic Methodological Formulation', hi: 'रणनीतिक पद्धति निर्माण' },
  };

  const currentLevelDesc = levelDescriptions[levelNumber] || levelDescriptions[3];

  return (
    <div className="min-h-screen bg-[#F4F6FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-[#D8DFEE]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1C4CA1]" />
            <span>{isHindi ? 'मूल्यांकन परिणाम एवं साक्ष्य सत्यापन' : 'Assessment Result & Evidence Certification'}</span>
          </div>
          <span className="font-mono text-[11px] bg-[#1C4CA1]/10 text-[#1C4CA1] px-2.5 py-0.5 rounded-full font-bold">
            FRAC v2.4 • MoSPI
          </span>
        </div>

        {/* 1. Hero Celebration Card */}
        <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 sm:p-8 shadow-sm space-y-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C4CA1]/10 text-[#1C4CA1] text-xs font-bold tracking-wide">
                <ShieldCheck className="h-4 w-4 text-[#1C4CA1]" />
                <span>{isHindi ? 'आधिकारिक क्षमता स्तर प्रमाणित' : 'Official Competency Level Certified'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F273A] tracking-tight">
                {displayName}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                {isHindi
                  ? `बधाई! आपके फील्ड प्रदर्शन मूल्यांकन के आधार पर आपकी क्षमता को ${finalLevel} पर अपग्रेड कर दिया गया है।`
                  : `Congratulations! Based on your adaptive diagnostic performance, your verified competency has been promoted to ${finalLevel}.`}
              </p>
            </div>

            {/* Level Promotion Badge */}
            <div className="shrink-0 flex flex-col items-center justify-center p-5 rounded-2xl bg-[#1C4CA1] text-white shadow-md w-36 sm:w-40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA72F]">
                {isHindi ? 'प्रमाणित स्तर' : 'Verified Level'}
              </span>
              <span className="text-4xl font-black tracking-tight my-1">{finalLevel}</span>
              <span className="text-[11px] text-white/80 font-medium text-center line-clamp-1">
                {isHindi ? currentLevelDesc.hi : currentLevelDesc.en}
              </span>
            </div>
          </div>

          {/* Karma Points Award Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FFA72F]/20 flex items-center justify-center text-[#1F273A]">
                <Award className="h-5 w-5 text-[#FFA72F]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1F273A]">
                  {isHindi ? '+150 कर्म अंक (Karma Points) जोड़े गए' : '+150 Karma Points Credited'}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {isHindi
                    ? 'राष्ट्रीय कर्मयोगी e-HRMS / APAR रिकॉर्ड के साथ समन्वयित'
                    : 'Synchronized with National Karmayogi e-HRMS / APAR Dossier'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-[#1C4CA1] text-white">
              {scorePercent}% {isHindi ? 'प्राप्तांक' : 'Score'}
            </span>
          </div>
        </div>

        {/* 2. Diagnostic Topic Breakdown Card */}
        <div className="rounded-3xl bg-white border border-[#D8DFEE] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8DFEE]">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-[#1C4CA1]" />
              <h2 className="text-sm font-bold text-[#1F273A]">
                {isHindi ? 'विषय-वार नैदानिक विश्लेषण' : 'Topic-Wise Diagnostic Breakdown'}
              </h2>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              3 {isHindi ? 'मापदंड जाँचे गए' : 'Criteria Evaluated'}
            </span>
          </div>

          <div className="space-y-3">
            {/* Topic 1 */}
            <div className="p-3.5 rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F273A]">
                  {isHindi ? 'प्रोटोकॉल अनुपालन एवं ब्लॉक सीमांकन' : 'Protocol Adherence & Block Demarcation'}
                </span>
                <span className="font-bold text-[#1C4CA1] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 100%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#D8DFEE] overflow-hidden">
                <div className="h-full bg-[#1C4CA1] rounded-full w-full" />
              </div>
            </div>

            {/* Topic 2 */}
            <div className="p-3.5 rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F273A]">
                  {isHindi ? 'कैपी स्किप लॉजिक एवं सत्यापन' : 'CAPI Skip Logic & Validation'}
                </span>
                <span className="font-bold text-[#1C4CA1] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 80%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#D8DFEE] overflow-hidden">
                <div className="h-full bg-[#1C4CA1] rounded-full w-[80%]" />
              </div>
            </div>

            {/* Topic 3 */}
            <div className="p-3.5 rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1F273A]">
                  {isHindi ? 'डेटा संवीक्षा एवं विसंगति जांच' : 'Data Scrutiny & Outlier Checks'}
                </span>
                <span className="font-bold text-[#FFA72F] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 75%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#D8DFEE] overflow-hidden">
                <div className="h-full bg-[#FFA72F] rounded-full w-[75%]" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Next Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border border-[#D8DFEE] text-xs font-bold text-[#1F273A] hover:bg-[#EDF0F7] transition-colors cursor-pointer shadow-2xs text-center"
          >
            {isHindi ? '← डैशबोर्ड पर वापस जाएं' : '← Back to Dashboard'}
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.push('/skill-gap')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <span>{isHindi ? 'अपडेट किया गया रडार देखें' : 'View Updated Radar'}</span>
              <ArrowRight className="h-4 w-4 text-[#FFA72F]" />
            </button>

            <Link
              href={competencyId ? `/pathways?competency=${encodeURIComponent(competencyId)}` : '/pathways'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl bg-[#FFA72F]/15 border border-[#FFA72F]/30 text-xs font-bold text-[#1F273A] hover:bg-[#FFA72F]/25 transition-colors shadow-2xs"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#1C4CA1]" />
              <span>{isHindi ? 'अनुशंसित iGOT मॉड्यूल' : 'Recommended Pathways'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
