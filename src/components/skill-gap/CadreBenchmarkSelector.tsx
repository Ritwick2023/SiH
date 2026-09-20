'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Award } from 'lucide-react';

interface CadreBenchmarkSelectorProps {
  selectedCadre: string;
  onSelectCadre: (cadreKey: string) => void;
  isHindi: boolean;
}

export function CadreBenchmarkSelector({
  selectedCadre,
  onSelectCadre,
  isHindi,
}: CadreBenchmarkSelectorProps) {
  const t = useTranslations('skillGap');

  const cadres = [
    {
      id: 'demo-sunita',
      code: 'FOD',
      title: isHindi ? 'NSSO FOD (क्षेत्रीय संचालन)' : 'NSSO FOD (Field Operations)',
      role: isHindi ? 'फील्ड अन्वेषक / अधीक्षक' : 'Field Investigator / Superintendent',
      matchPercent: 78,
      transferableCount: 6,
      upskillingCount: 2,
    },
    {
      id: 'demo-amit',
      code: 'SSS',
      title: isHindi ? 'SSS (अधीनस्थ सांख्यिकी सेवा)' : 'SSS (Subordinate Statistical Service)',
      role: isHindi ? 'कनिष्ठ / वरिष्ठ सांख्यिकी अधिकारी' : 'Junior / Senior Statistical Officer',
      matchPercent: 72,
      transferableCount: 5,
      upskillingCount: 3,
    },
    {
      id: 'demo-priya',
      code: 'ISS',
      title: isHindi ? 'ISS (भारतीय सांख्यिकी सेवा)' : 'ISS (Indian Statistical Service)',
      role: isHindi ? 'सहायक / उप निदेशक' : 'Assistant / Deputy Director',
      matchPercent: 48,
      transferableCount: 3,
      upskillingCount: 5,
    },
  ];

  const currentCadreData = cadres.find((c) => c.id === selectedCadre) ?? cadres[1];

  return (
    <div className="rounded-3xl bg-white p-6 border border-[#D8DFEE] shadow-xs space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div>
          <h3 className="text-sm font-bold text-[#1F273A] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#B45309]" />
            {t('cadreBenchmark.title')}
          </h3>
          <p className="text-xs text-[#475569]">
            {t('cadreBenchmark.subtitle')}
          </p>
        </div>

        <div className="text-xs font-bold text-[#1C4CA1] bg-[#EDF0F7] px-3 py-1 rounded-lg border border-[#D8DFEE]">
          {isHindi ? 'सक्रिय बेंचमार्क: ' : 'Active Benchmark: '} {currentCadreData.code}
        </div>
      </div>

      {/* Segmented Cadre Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cadres.map((cadre) => {
          const isSelected = selectedCadre === cadre.id;

          return (
            <button
              key={cadre.id}
              onClick={() => onSelectCadre(cadre.id)}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-white border-2 border-[#1C4CA1] ring-2 ring-[#1C4CA1]/15 shadow-sm'
                  : 'bg-[#F8FAFC] border-border hover:bg-[#EDF0F7] hover:border-[#1C4CA1]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                  isSelected 
                    ? 'bg-[#1C4CA1] text-white' 
                    : 'bg-slate-200 text-[#1F273A]'
                }`}>
                  {cadre.code}
                </span>
                <span className="text-xs font-mono font-bold text-[#1C4CA1]">
                  {cadre.matchPercent}% Match
                </span>
              </div>

              <div className="font-bold text-sm text-[#1F273A] truncate">
                {cadre.title}
              </div>
              <div className="text-xs text-[#475569] truncate mb-3">
                {cadre.role}
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold pt-2 border-t border-[#E2E8F0]">
                <span className="text-emerald-700">
                  ✓ {cadre.transferableCount} Transferable
                </span>
                <span className="text-amber-800">
                  ↑ {cadre.upskillingCount} Need Upskill
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
