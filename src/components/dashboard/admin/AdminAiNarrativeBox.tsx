'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, FileCheck, AlertCircle } from 'lucide-react';

interface AdminAiNarrativeBoxProps {
  isHindi?: boolean;
}

export function AdminAiNarrativeBox({ isHindi = false }: AdminAiNarrativeBoxProps) {
  const [copied, setCopied] = useState(false);
  const [staged, setStaged] = useState(false);

  const copyBriefing = () => {
    const textToCopy = isHindi
      ? 'एआई कार्यकारी आसूचना विवरण: एनएसएसओ एफओडी क्षेत्र अन्वेषकों में कैपी तुल्यकालन अपनाना उच्च स्तर पर है, लेकिन पूर्वी क्षेत्रों में अनुसूची 0.0 जनगणना सीमा निर्धारण गुणवत्ता बाधा बना हुआ है। बिहार और यूपी पूर्व क्षेत्रीय कार्यालयों के लिए अनिवार्य एनएसएसटीए हेमलेट-समूह पुनश्चर्या अभ्यास की अनुशंसा की जाती है।'
      : 'AI Executive Intelligence Briefing: NSSO FOD Field Investigators exhibit high CAPI sync adoption, but Schedule 0.0 Census Boundary Demarcation remains a quality bottleneck in eastern zones. Recommend mandatory NSSTA hamlet-grouping refresher drills for Bihar and UP East ROs.';
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStageDirective = () => {
    setStaged(true);
    setTimeout(() => setStaged(false), 3500);
  };

  return (
    <div className="rounded-3xl bg-[#1F273A] text-white p-6 sm:p-7 shadow-lg border border-[#323F58] flex flex-col justify-between">
      <div>
        {/* Header Pill & Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFA72F]/20 text-[#FFA72F] border border-[#FFA72F]/30">
              <Sparkles className="h-3.5 w-3.5" />
              {isHindi ? 'एआई कार्यकारी आसूचना विवरण' : 'AI Executive Intelligence Briefing'}
            </span>
            <span className="text-xs font-mono text-[#D8DFEE]/80">
              {isHindi ? 'सप्ताह 36, 2026 चक्र' : 'Week 36, 2026 Cycle'}
            </span>
          </div>

          <button
            type="button"
            onClick={copyBriefing}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-xs font-medium text-[#EDF0F7] hover:bg-white/20 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">{isHindi ? 'कॉपी किया गया' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#D8DFEE]" />
                <span>{isHindi ? 'मेमो कॉपी करें' : 'Copy Memo'}</span>
              </>
            )}
          </button>
        </div>

        {/* Narrative Title */}
        <div className="mt-5">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isHindi
              ? 'क्षेत्र संचालन प्रभाग (FOD) गुणवत्ता एवं संवीक्षा आसूचना'
              : 'Field Operations Division (FOD) Quality & Scrutiny Intelligence'}
          </h2>
          <p className="text-xs text-[#D8DFEE]/80 mt-1">
            {isHindi
              ? '4,850 संवर्ग आकलनों और 24,000 संवीक्षित फील्ड विवरणों से संश्लेषित'
              : 'Synthesized across 4,850 cadre assessments and 24,000 scrutinized field returns'}
          </p>
        </div>

        {/* Analytical Bullets */}
        <div className="mt-5 space-y-3.5 text-xs text-[#D8DFEE] leading-relaxed">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div>
              <strong className="text-white font-bold">
                {isHindi ? 'कैपी फील्ड आधुनिकीकरण: ' : 'CAPI Field Modernization: '}
              </strong>
              {isHindi
                ? 'पश्चिमी और दक्षिणी क्षेत्रों में कैपी टैबलेट डेटा तुल्यकालन 84% तक पहुंच गया है, जिससे डेटा प्रेषण विलंब 4.2 दिनों से घटकर 6 घंटे से कम हो गया है।'
                : 'CAPI tablet synchronization adoption reached 84% across western and southern zones, lowering data transmission lag from 4.2 days to under 6 hours.'}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
            <div>
              <strong className="text-red-300 font-bold">
                {isHindi ? 'सीमा निर्धारण गुणवत्ता बाधा: ' : 'Boundary Demarcation Quality Bottleneck: '}
              </strong>
              {isHindi
                ? 'एफओडी बिहार (19.8% त्रुटि दर) और एफओडी यूपी पूर्व (15.4% त्रुटि दर) में अनुसूची 0.0 सूचीकरण संवीक्षा में गंभीर हेमलेट-समूह छूट का जोखिम पाया गया है।'
                : 'Schedule 0.0 listing scrutiny in FOD Bihar (19.8% error rate) and FOD UP East (15.4% error rate) exhibits critical hamlet-group omission risk under PRD §9.4.5 standards.'}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#FFA72F] mt-1.5 shrink-0" />
            <div>
              <strong className="text-[#FFA72F] font-bold">
                {isHindi ? 'अर्थमितीय परिणाम सहसंबंध: ' : 'Econometric Outcome Correlation: '}
              </strong>
              {isHindi
                ? 'मजबूत नकारात्मक सहसंबंध (r = -0.84, R² = 0.89) प्रमाणित करता है कि अन्वेषक सीमांकन क्षमता को L1 से L3 तक बढ़ाने से सूचीकरण पूर्व-संवीक्षा त्रुटियों में 6.4 प्रतिशत अंकों की कमी आती है।'
                : 'Strong inverse correlation (r = -0.84, R² = 0.89) proves that advancing investigator demarcation competency from L1 to L3 eliminates over 6.4 percentage points of listing pre-scrutiny errors.'}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Policy Action */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="h-4 w-4 text-[#FFA72F] shrink-0" />
          <span className="text-[#D8DFEE]">
            {isHindi
              ? 'अनुशंसा: बिहार और यूपी पूर्व में लक्षित हेमलेट-समूह अभ्यास के लिए मंत्रिस्तरीय परिपत्र जारी करें।'
              : 'Recommended: Issue ministerial circular for targeted hamlet-group drills in Bihar & UP East.'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleStageDirective}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
            staged
              ? 'bg-[#1C4CA1] text-white shadow-xs'
              : 'bg-[#FFA72F] text-[#1F273A] hover:bg-[#F4962F] shadow-sm'
          }`}
        >
          {staged ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#FFA72F]" />
              <span>{isHindi ? 'एडीजी के लिए निर्देश तैयार' : 'Directive Staged for ADG'}</span>
            </>
          ) : (
            <>
              <FileCheck className="h-3.5 w-3.5" />
              <span>{isHindi ? 'निर्देश तैयार करें' : 'Stage Directive'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
