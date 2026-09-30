'use client';

import React from 'react';
import Link from 'next/link';
import { useSafeLocale } from '@/lib/useSafeLocale';
import type { AppUser } from '@/lib/auth';
import { LearnerCoursesTable } from '@/components/dashboard/learner/LearnerCoursesTable';
import { KarmayogiPathwaysTrack } from '@/components/dashboard/learner/KarmayogiPathwaysTrack';
import { BookOpen, Compass, CheckCircle2, Clock, Award, ArrowRight } from 'lucide-react';

interface MyLearningClientProps {
  user: AppUser | null;
}

export default function MyLearningClient({ user }: MyLearningClientProps) {
  const locale = useSafeLocale(user?.user_metadata?.preferred_language || 'en');
  const isHindi = locale === 'hi';

  const userName = (user?.user_metadata?.name as string) || 'Learner';

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1C4CA1] to-[#1164BE] p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider text-white">
              {isHindi ? 'सक्रिय संवर्ग प्रशिक्षण' : 'Active Cadre Training'}
            </span>
            <span className="text-xs text-white/80">• MoSPI iGOT Karmayogi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isHindi ? `मेरा शिक्षण — ${userName}` : `My Learning — ${userName}`}
          </h1>
          <p className="text-sm text-white/90 mt-1 max-w-xl">
            {isHindi
              ? 'आपकी व्यक्तिगत सीखने की प्रगति, सक्रिय पाठ्यक्रम और एनएसएसटीए प्रशिक्षण मील के पत्थर।'
              : 'Track your personal learning progress, active course modules, and official NSSTA training milestones.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/pathways"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#1C4CA1] hover:bg-slate-50 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            <span>{isHindi ? 'समस्त पाठ्यक्रम कैटलॉग देखें' : 'Explore All Courses'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 4-Stat Progress Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#D8DFEE] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isHindi ? 'नामांकित पाठ्यक्रम' : 'Enrolled Courses'}
            </span>
            <BookOpen className="h-4 w-4 text-[#1C4CA1]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#1F273A] font-mono">5</div>
          <span className="text-[10px] text-emerald-600 font-bold">
            {isHindi ? 'आधिकारिक संवर्ग सूची' : 'Official Cadre Roster'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D8DFEE] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isHindi ? 'प्रगति पर' : 'In Progress'}
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#1F273A] font-mono">2</div>
          <span className="text-[10px] text-amber-700 font-bold">
            {isHindi ? 'सक्रिय अध्ययन सत्र' : 'Active Study Sessions'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D8DFEE] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isHindi ? 'पूर्ण मॉड्यूल' : 'Completed Modules'}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#1F273A] font-mono">1</div>
          <span className="text-[10px] text-emerald-600 font-bold">
            {isHindi ? 'प्रमाणित एवं सत्यापित' : 'Certified & Verified'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D8DFEE] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isHindi ? 'अर्जित कर्मा अंक' : 'Karma Points Earned'}
            </span>
            <Award className="h-4 w-4 text-[#FFA72F]" />
          </div>
          <div className="mt-2 text-2xl font-black text-[#1F273A] font-mono">+550</div>
          <span className="text-[10px] text-[#FFA72F] font-bold">
            {isHindi ? 'कर्मयोगी डिजिटल पासपोर्ट' : 'Karmayogi Passport'}
          </span>
        </div>
      </div>

      {/* Enrolled Courses Table */}
      <LearnerCoursesTable isHindi={isHindi} />

      {/* Pathways Track Milestones */}
      <KarmayogiPathwaysTrack isHindi={isHindi} />
    </div>
  );
}
