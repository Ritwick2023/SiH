'use client';

import React from 'react';
import Link from 'next/link';
import {
  Target,
  ChevronRight,
  Calendar,
  Award,
  CheckCircle2,
  ShieldCheck,
  BarChart2,
} from 'lucide-react';

interface LearnerRightSidebarDeckProps {
  isHindi?: boolean;
}

export function LearnerRightSidebarDeck({ isHindi = false }: LearnerRightSidebarDeckProps) {
  const nextStepTitle = isHindi ? 'अगला कदम' : 'Next Step';
  const nextStepDesc = isHindi
    ? 'नमूनाकरण विधियों में अपनी दक्षता में सुधार करने के लिए अपना अगला मूल्यांकन पूरा करें।'
    : 'Complete your next assessment to improve your proficiency in Sampling Methods.';
  const startAssessmentBtn = isHindi ? 'मूल्यांकन शुरू करें →' : 'Start Assessment →';

  const upcomingDeadlinesTitle = isHindi ? 'आगामी समय सीमा' : 'Upcoming Deadlines';
  const recentAchievementsTitle = isHindi ? 'हाल की उपलब्धियां' : 'Recent Achievements';
  const viewAllText = isHindi ? 'सभी देखें →' : 'View All →';

  const deadlines = [
    {
      id: 'sampling',
      title: isHindi ? 'नमूनाकरण विधियाँ मूल्यांकन' : 'Sampling Methods Assessment',
      due: isHindi ? '3 दिनों में देय' : 'Due in 3 days',
      isUrgent: true,
    },
    {
      id: 'datavis',
      title: isHindi ? 'डेटा विज़ुअलाइज़ेशन क्विज़' : 'Data Visualization Quiz',
      due: isHindi ? '5 दिनों में देय' : 'Due in 5 days',
      isUrgent: false,
    },
    {
      id: 'policy',
      title: isHindi ? 'नीति विश्लेषण असाइनमेंट' : 'Policy Analysis Assignment',
      due: isHindi ? '1 सप्ताह में देय' : 'Due in 1 week',
      isUrgent: false,
    },
  ];

  const achievements = [
    {
      id: 'col-basics',
      icon: CheckCircle2,
      iconColor: 'text-[#16A34A]',
      iconBg: 'bg-[#DCFCE7]',
      title: isHindi ? 'पूर्ण: डेटा संग्रह मूल बातें' : 'Completed: Data Collection Basics',
      time: isHindi ? '2 दिन पहले' : '2 days ago',
    },
    {
      id: 'badge-lit',
      icon: ShieldCheck,
      iconColor: 'text-[#1C4CA1]',
      iconBg: 'bg-[#DBEAFE]',
      title: isHindi ? 'नया बैज अर्जित किया: डेटा साक्षरता' : 'Earned a new badge Data Literacy',
      time: isHindi ? '1 सप्ताह पहले' : '1 week ago',
    },
    {
      id: 'level-3',
      icon: BarChart2,
      iconColor: 'text-[#7C3AED]',
      iconBg: 'bg-[#EDE9FE]',
      title: isHindi ? 'स्तर 3 तक पहुंचे' : 'Reached Level 3',
      time: isHindi ? 'दक्षता मील का पत्थर • 2 सप्ताह पहले' : 'Proficiency milestone • 2 weeks ago',
    },
  ];

  return (
    <div className="space-y-4 select-none">
      {/* 1. Next Step Card */}
      <div className="rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-white border border-[#FED7AA] p-4.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#FFEDD5] flex items-center justify-center text-[#EA580C]">
              <Target className="h-4 w-4" />
            </div>
            <h3 className="font-extrabold text-sm text-[#9A3412]">
              {nextStepTitle}
            </h3>
          </div>
          <ChevronRight className="h-4 w-4 text-[#F97316]" />
        </div>
        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
          {nextStepDesc}
        </p>
        <Link
          href="/assignments"
          prefetch={true}
          className="mt-3.5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer active:scale-98"
        >
          <span>{startAssessmentBtn}</span>
        </Link>
      </div>

      {/* 2. Upcoming Deadlines Card */}
      <div className="rounded-2xl bg-white border border-[#D8DFEE] p-4.5 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <h3 className="font-extrabold text-xs text-[#1F273A]">
              {upcomingDeadlinesTitle}
            </h3>
          </div>
          <Link
            href="/assignments"
            prefetch={true}
            className="text-[11px] font-bold text-[#1C4CA1] hover:underline"
          >
            {viewAllText}
          </Link>
        </div>

        <div className="mt-3 space-y-3">
          {deadlines.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5">
              <div
                className={`mt-0.5 h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${
                  item.isUrgent ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#1C4CA1]'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1 leading-snug">
                <p className="text-xs font-bold text-[#1F273A] truncate">
                  {item.title}
                </p>
                <p
                  className={`text-[11px] font-medium mt-0.5 ${
                    item.isUrgent ? 'text-red-500 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {item.due}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Achievements Card */}
      <div className="rounded-2xl bg-white border border-[#D8DFEE] p-4.5 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="font-extrabold text-xs text-[#1F273A]">
              {recentAchievementsTitle}
            </h3>
          </div>
          <Link
            href="/credentials"
            prefetch={true}
            className="text-[11px] font-bold text-[#1C4CA1] hover:underline"
          >
            {viewAllText}
          </Link>
        </div>

        <div className="mt-3 space-y-3">
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-2.5">
                <div
                  className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1 leading-snug">
                  <p className="text-xs font-bold text-[#1F273A] truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LearnerRightSidebarDeck;
