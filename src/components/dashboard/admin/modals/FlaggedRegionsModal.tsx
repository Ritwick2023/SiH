'use client';

import React, { useState } from 'react';
import { X, Flag, Send, CheckCircle2 } from 'lucide-react';

interface FlaggedRegionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchIntervention?: (regionName: string) => void;
  isHindi?: boolean;
}

export function FlaggedRegionsModal({
  isOpen,
  onClose,
  onDispatchIntervention,
  isHindi = false,
}: FlaggedRegionsModalProps) {
  const [triaged, setTriaged] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleTriage = (roName: string) => {
    setTriaged((prev) => [...prev, roName]);
    if (onDispatchIntervention) {
      onDispatchIntervention(roName);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flagged-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-[#D8DFEE] shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-red-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <Flag className="h-6 w-6 text-[#FFA72F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white uppercase">
                  {isHindi ? 'संवर्ग संवीक्षा चेतावनी' : 'Cadre Scrutiny Alert'}
                </span>
              </div>
              <h2 id="flagged-modal-title" className="text-sm sm:text-base font-black tracking-wide text-white mt-0.5">
                {isHindi ? 'प्राथमिकता चिह्नित क्षेत्रीय कार्यालय (2 आरओ)' : 'Priority Flagged Regional Offices (2 ROs)'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isHindi ? 'मोडल बंद करें' : 'Close flagged modal'}
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-[#1F273A]">
          <p className="text-muted-foreground leading-relaxed">
            {isHindi
              ? 'निम्नलिखित दो क्षेत्रीय कार्यालय सांविधिक 12.0% संवीक्षा त्रुटि सीमा से अधिक हो गए हैं और 60.0% कार्यबल तत्परता से नीचे आ गए हैं, जिससे अनिवार्य कार्यकारी हस्तक्षेप आवश्यक हो गया है।'
              : 'The following two regional offices have exceeded the statutory 12.0% scrutiny error threshold and fallen below 60.0% workforce readiness, triggering mandatory executive intervention.'}
          </p>

          {/* Card 1: FOD Bihar */}
          <div className="p-4 rounded-xl bg-white border-2 border-red-500/30 space-y-3 shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 uppercase">
                  {isHindi ? 'गंभीर अंतर • पूर्वी प्रभाग' : 'Critical Gap • Eastern Zone'}
                </span>
                <h3 className="text-sm font-bold text-[#1F273A] mt-1">
                  {isHindi ? 'एफओडी बिहार क्षेत्रीय कार्यालय (पटना)' : 'FOD Bihar Regional Office (Patna)'}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {isHindi
                    ? '520 अधिकारी • 46% तत्परता (L1.2) • 19.8% संवीक्षा त्रुटि दर'
                    : '520 Officers • 46% Readiness (L1.2) • 19.8% Scrutiny Error Rate'}
                </p>
              </div>
              <div className="text-right font-mono shrink-0">
                <span className="text-lg font-black text-red-700">19.8%</span>
                <span className="text-[9px] text-muted-foreground block">
                  {isHindi ? 'त्रुटि दर' : 'Error Rate'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#EDF0F7]/50 border border-[#D8DFEE] text-[11px] text-muted-foreground space-y-1">
              <span className="font-bold text-[#1F273A] block">
                {isHindi ? 'प्रमुख त्रुटि कारक:' : 'Primary Error Driver:'}
              </span>
              <p>
                {isHindi
                  ? 'ग्रामीण बाढ़ क्षेत्रों में अनुसूची 0.0 सीईबी सूचीकरण सीमांकन; टोला-समूह पहचान में चूक।'
                  : 'Schedule 0.0 CEB listing demarcation in rural flood zones; hamlet-group identification bypass.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-muted-foreground">
                {isHindi ? 'कार्रवाई: एनएसएसटीए सीमांकन बूटकैंप' : 'Action: NSSTA Demarcation Bootcamp'}
              </span>
              {triaged.includes('FOD Bihar') ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isHindi ? 'हस्तक्षेप तैनात' : 'Intervention Dispatched'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleTriage('FOD Bihar')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-700 text-white font-bold text-xs hover:bg-red-800 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Send className="h-3 w-3" />
                  <span>{isHindi ? 'हस्तक्षेप तैनात करें' : 'Dispatch Intervention'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 2: FOD UP East */}
          <div className="p-4 rounded-xl bg-white border-2 border-amber-500/30 space-y-3 shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                  {isHindi ? 'उच्च जोखिम • मध्य-पूर्व प्रभाग' : 'High Risk • Central-East Zone'}
                </span>
                <h3 className="text-sm font-bold text-[#1F273A] mt-1">
                  {isHindi ? 'एफओडी यूपी पूर्व क्षेत्रीय कार्यालय (प्रयागराज)' : 'FOD UP East Regional Office (Prayagraj)'}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {isHindi
                    ? '610 अधिकारी • 54% तत्परता (L2.1) • 15.4% संवीक्षा त्रुटि दर'
                    : '610 Officers • 54% Readiness (L2.1) • 15.4% Scrutiny Error Rate'}
                </p>
              </div>
              <div className="text-right font-mono shrink-0">
                <span className="text-lg font-black text-amber-700">15.4%</span>
                <span className="text-[9px] text-muted-foreground block">
                  {isHindi ? 'त्रुटि दर' : 'Error Rate'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#EDF0F7]/50 border border-[#D8DFEE] text-[11px] text-muted-foreground space-y-1">
              <span className="font-bold text-[#1F273A] block">
                {isHindi ? 'प्रमुख त्रुटि कारक:' : 'Primary Error Driver:'}
              </span>
              <p>
                {isHindi
                  ? 'अनौपचारिक विनिर्माण उद्यमों में एनआईसी-2008 5-अंकीय औद्योगिक वर्गीकरण अस्पष्टता।'
                  : 'NIC-2008 5-digit industrial classification ambiguity in informal manufacturing enterprises.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-muted-foreground">
                {isHindi ? 'कार्रवाई: एनएसएसटीए आर्थिक कोडिंग क्लिनिक' : 'Action: NSSTA Economic Coding Clinic'}
              </span>
              {triaged.includes('FOD UP East') ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isHindi ? 'हस्तक्षेप तैनात' : 'Intervention Dispatched'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleTriage('FOD UP East')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C4CA1] text-white font-bold text-xs hover:bg-[#1164BE] transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Send className="h-3 w-3" />
                  <span>{isHindi ? 'हस्तक्षेप तैनात करें' : 'Dispatch Intervention'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#EDF0F7]/60 border-t border-[#D8DFEE] px-6 py-3 flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <span className="text-[11px]">
            {isHindi ? 'एनएससी प्रोटोकॉल के तहत प्रवर्तनीय निर्देश' : 'Directives enforceable under NSC Protocol'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[#D8DFEE] text-xs font-bold text-muted-foreground hover:bg-white transition-colors cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
