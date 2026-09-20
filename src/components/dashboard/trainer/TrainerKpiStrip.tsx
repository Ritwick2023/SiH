'use client';

import React from 'react';
import { HelpCircle, CheckCircle2, FileStack, Users, TrendingUp } from 'lucide-react';

interface TrainerKpiStripProps {
  pendingReviewCount: number;
  approvedCount: number;
  ingestedManualsCount: number;
  assessedOfficersCount: number;
  avgPassRate: number;
}

export function TrainerKpiStrip({
  pendingReviewCount = 14,
  approvedCount = 342,
  ingestedManualsCount = 6,
  assessedOfficersCount = 1420,
  avgPassRate = 68,
}: TrainerKpiStripProps) {
  const kpis = [
    {
      id: 'pending',
      label: 'Pending Review',
      value: pendingReviewCount.toString(),
      subtext: 'Needs Faculty QA',
      icon: HelpCircle,
      bgColor: 'bg-[#FFA72F]/15',
      textColor: 'text-[#FFA72F]',
    },
    {
      id: 'approved',
      label: 'Approved Bank',
      value: approvedCount.toString(),
      subtext: 'Active in Assessment Pool',
      icon: CheckCircle2,
      bgColor: 'bg-emerald-500/15',
      textColor: 'text-emerald-700',
    },
    {
      id: 'manuals',
      label: 'Ingested Manuals',
      value: ingestedManualsCount.toString(),
      subtext: 'Official MoSPI SOPs',
      icon: FileStack,
      bgColor: 'bg-[#1164BE]/10',
      textColor: 'text-[#1164BE]',
    },
    {
      id: 'officers',
      label: 'Assessed Officers',
      value: assessedOfficersCount.toLocaleString(),
      subtext: 'Across FOD & SSS Cadres',
      icon: Users,
      bgColor: 'bg-[#1C4CA1]/10',
      textColor: 'text-[#1C4CA1]',
    },
    {
      id: 'passrate',
      label: 'Cohort Pass Rate',
      value: `${avgPassRate}%`,
      subtext: '+4.2% vs Previous Quarter',
      icon: TrendingUp,
      bgColor: 'bg-blue-500/15',
      textColor: 'text-blue-700',
    },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="rounded-2xl bg-white border border-[#D8DFEE] p-4 shadow-2xs hover:shadow-xs transition-all hover:scale-101 flex items-center gap-3.5 hover:border-[#1164BE]/40"
          >
            <div className={`h-11 w-11 rounded-2xl ${kpi.bgColor} flex items-center justify-center shrink-0`}>
              <Icon className={`h-5 w-5 ${kpi.textColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#475569] truncate leading-tight">
                {kpi.label}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1F273A] tracking-tight mt-0.5 font-mono">
                {kpi.value}
              </p>
              <p className="text-[10px] font-medium text-[#475569]/80 truncate">
                {kpi.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
