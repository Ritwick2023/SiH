'use client';

import React from 'react';
import type { DemoPersona } from '@/lib/types';
import { X, ShieldCheck, Download, Building, MapPin, Hash, UserCheck } from 'lucide-react';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';

interface OfficerDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: DemoPersona;
  isHindi?: boolean;
}

export function OfficerDossierModal({
  isOpen,
  onClose,
  persona,
  isHindi = false,
}: OfficerDossierModalProps) {
  if (!isOpen) return null;

  // Real MoSPI Cadre Metadata per persona
  const employeeCode =
    persona.role === 'admin'
      ? 'ISS-2012-0481'
      : persona.role === 'trainer'
        ? 'NSSTA-FAC-2018-019'
        : 'SSS-FOD-2021-7842';

  const postingStation =
    persona.role === 'admin'
      ? 'Sankhyiki Bhawan, New Delhi (HQ)'
      : persona.role === 'trainer'
        ? 'NSSTA Greater Noida Campus, UP'
        : 'FOD Regional Office, Patna (Bihar)';

  const cadreBatch =
    persona.role === 'admin'
      ? 'Indian Statistical Service • 2012 Batch'
      : persona.role === 'trainer'
        ? 'Senior Joint Director • MoSPI Faculty'
        : 'Subordinate Statistical Service • Batch 2021';

  const fracBaseline =
    persona.role === 'admin'
      ? 'Level 5 (Macro-Policy Authority)'
      : persona.role === 'trainer'
        ? 'Level 4 (Master Trainer & Evaluator)'
        : 'Level 3 (Senior Field Enumerator)';

  const payMatrix =
    persona.role === 'admin'
      ? 'Level 14 (Apex Senior Scale)'
      : persona.role === 'trainer'
        ? 'Level 12 (Selection Grade)'
        : 'Level 7 (Pay Matrix 7th CPC)';

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#D8DFEE] shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#1C4CA1] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <KarmayogiEmblemIcon className="h-7 w-7 text-[#FFA72F]" />
            </div>
            <div>
              <h2 id="dossier-modal-title" className="text-sm font-black tracking-wide uppercase text-[#FFA72F]">
                {isHindi ? 'भारत सरकार • आधिकारिक कैडर अभिलेख' : 'Government of India • Civil Service Dossier'}
              </h2>
              <p className="text-[11px] text-white/90">
                {isHindi
                  ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय'
                  : 'Ministry of Statistics & Programme Implementation (MoSPI)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dossier modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Identity Body */}
        <div className="p-6 space-y-5 bg-[#EDF0F7]/40">
          {/* Top Officer Row */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#D8DFEE] shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-[#1C4CA1] text-white flex items-center justify-center font-serif text-2xl font-black shadow-xs shrink-0">
              {persona.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-black text-[#1F273A] truncate">
                  {persona.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20 shrink-0">
                  {persona.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1164BE] mt-0.5">
                {persona.designation}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                <span className="font-mono font-bold text-[#1C4CA1]">{employeeCode}</span>
                <span>•</span>
                <span>{cadreBatch}</span>
              </div>
            </div>
          </div>

          {/* Dossier Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-[#D8DFEE] space-y-1">
              <div className="flex items-center gap-1.5 text-[#475569] text-[11px] font-bold">
                <Building className="h-3.5 w-3.5 text-[#1C4CA1]" />
                <span>{isHindi ? 'कैडर एवं सेवा' : 'Cadre & Service'}</span>
              </div>
              <p className="font-bold text-[#1F273A]">{persona.cadre}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#D8DFEE] space-y-1">
              <div className="flex items-center gap-1.5 text-[#475569] text-[11px] font-bold">
                <MapPin className="h-3.5 w-3.5 text-[#1C4CA1]" />
                <span>{isHindi ? 'वर्तमान पदस्थापना' : 'Current Posting'}</span>
              </div>
              <p className="font-bold text-[#1F273A] truncate">{postingStation}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#D8DFEE] space-y-1">
              <div className="flex items-center gap-1.5 text-[#475569] text-[11px] font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isHindi ? 'FRAC योग्यता आधार' : 'FRAC Competency Baseline'}</span>
              </div>
              <p className="font-bold text-emerald-700">{fracBaseline}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#D8DFEE] space-y-1">
              <div className="flex items-center gap-1.5 text-[#475569] text-[11px] font-bold">
                <Hash className="h-3.5 w-3.5 text-[#1C4CA1]" />
                <span>{isHindi ? 'वेतन मैट्रिक्स स्तर' : 'Pay Matrix Band'}</span>
              </div>
              <p className="font-bold text-[#1F273A]">{payMatrix}</p>
            </div>
          </div>

          {/* Verification Seal */}
          <div className="p-3.5 rounded-2xl bg-[#FFA72F]/15 border border-[#FFA72F]/35 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <UserCheck className="h-5 w-5 text-[#1C4CA1]" />
              <div>
                <p className="font-bold text-[#1F273A]">
                  {isHindi ? 'iGOT कर्मयोगी सत्यापित अधिकारी' : 'iGOT Karmayogi Verified Officer'}
                </p>
                <p className="text-[11px] text-[#475569]">
                  {isHindi ? 'केंद्रीय सांख्यिकी संगठन द्वारा प्रमाणित' : 'Statutory Central Statistical Registry Verified'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white text-[#1C4CA1] px-2 py-1 rounded-md border border-[#FFA72F]/40">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-[#D8DFEE] flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#FFA72F]" />
            <span>{isHindi ? 'पहचान पत्र डाउनलोड करें' : 'Download Service Card'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#D8DFEE] text-xs font-bold text-[#475569] hover:bg-[#EDF0F7] transition-colors cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
