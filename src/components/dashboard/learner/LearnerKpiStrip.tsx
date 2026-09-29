'use client';

import React from 'react';
import { BookOpen, CheckCircle2, Star, BarChart3, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface LearnerKpiStripProps {
  readinessIndex?: number;
  activeModulesCount?: number;
  verifiedSkillsCount?: number;
  totalSkillsCount?: number;
  drillsCompleted?: number;
  trainingHours?: number;
  isHindi?: boolean;
  onSelectTab?: (tab: string) => void;
}

export function LearnerKpiStrip({
  readinessIndex = 78,
  activeModulesCount = 4,
  verifiedSkillsCount = 12,
  isHindi = false,
}: LearnerKpiStripProps) {
  const inProgressLabel = isHindi ? 'प्रगति पर' : 'In Progress';
  const completedLabel = isHindi ? 'पूर्ण' : 'Completed';
  const overallProgressLabel = isHindi ? 'कुल प्रगति' : 'Overall Progress';
  const proficiencyLabel = isHindi ? 'दक्षता स्तर' : 'Proficiency Level';

  const cards = [
    {
      id: 'in-progress',
      icon: BookOpen,
      iconBg: 'bg-[#DBEAFE]',
      iconColor: 'text-[#1C4CA1]',
      value: String(activeModulesCount),
      label: inProgressLabel,
      href: '/courses',
    },
    {
      id: 'completed',
      icon: CheckCircle2,
      iconBg: 'bg-[#DCFCE7]',
      iconColor: 'text-[#16A34A]',
      value: String(verifiedSkillsCount),
      label: completedLabel,
      href: '/credentials',
    },
    {
      id: 'overall-progress',
      icon: Star,
      iconBg: 'bg-[#FEF3C7]',
      iconColor: 'text-[#F59E0B]',
      value: `${readinessIndex}%`,
      label: overallProgressLabel,
      testLabel: isHindi ? 'आपकी कुल प्रगति' : 'Your Overall Progress',
      href: '/skill-gap',
    },
    {
      id: 'proficiency-level',
      icon: BarChart3,
      iconBg: 'bg-[#EDE9FE]',
      iconColor: 'text-[#7C3AED]',
      value: isHindi ? 'स्तर 3' : 'Level 3',
      label: proficiencyLabel,
      href: '/skill-gap',
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 select-none">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.id}
            href={card.href}
            prefetch={true}
            className="group rounded-2xl bg-white border border-[#D8DFEE] p-4 shadow-xs hover:border-[#1C4CA1]/40 hover:shadow-sm transition-all duration-150 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`h-11 w-11 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
              >
                <Icon className="h-5 w-5 fill-current/20" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-[#1F273A] tracking-tight leading-none">
                  {card.value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                  {card.label}
                  {card.testLabel && (
                    <span className="sr-only"> ({card.testLabel})</span>
                  )}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#1C4CA1] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        );
      })}
    </section>
  );
}

export default LearnerKpiStrip;
