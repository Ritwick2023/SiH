'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, FileCheck, AlertCircle } from 'lucide-react';

export function AdminAiNarrativeBox() {
  const [copied, setCopied] = useState(false);
  const [staged, setStaged] = useState(false);

  const copyBriefing = () => {
    navigator.clipboard?.writeText(
      'AI Executive Intelligence Briefing: NSSO FOD Field Investigators exhibit high CAPI sync adoption, but Schedule 0.0 Census Boundary Demarcation remains a quality bottleneck in eastern zones. Recommend mandatory NSSTA hamlet-grouping refresher drills for Bihar and UP East ROs.'
    );
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
              AI Executive Intelligence Briefing
            </span>
            <span className="text-xs font-mono text-[#D8DFEE]/80">
              Week 36, 2026 Cycle
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
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#D8DFEE]" />
                <span>Copy Memo</span>
              </>
            )}
          </button>
        </div>

        {/* Narrative Title */}
        <div className="mt-5">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Field Operations Division (FOD) Quality &amp; Scrutiny Intelligence
          </h2>
          <p className="text-xs text-[#D8DFEE]/80 mt-1">
            Synthesized across 4,850 cadre assessments and 24,000 scrutinized field returns
          </p>
        </div>

        {/* Analytical Bullets */}
        <div className="mt-5 space-y-3.5 text-xs text-[#D8DFEE] leading-relaxed">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div>
              <strong className="text-white font-bold">CAPI Field Modernization: </strong>
              CAPI tablet synchronization adoption reached 84% across western and southern zones, lowering data transmission lag from 4.2 days to under 6 hours.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
            <div>
              <strong className="text-red-300 font-bold">Boundary Demarcation Quality Bottleneck: </strong>
              Schedule 0.0 listing scrutiny in FOD Bihar (19.8% error rate) and FOD UP East (15.4% error rate) exhibits critical hamlet-group omission risk under PRD §9.4.5 standards.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#FFA72F] mt-1.5 shrink-0" />
            <div>
              <strong className="text-[#FFA72F] font-bold">Econometric Outcome Correlation: </strong>
              Strong inverse correlation (r = -0.84, R² = 0.89) proves that advancing investigator demarcation competency from L1 to L3 eliminates over 6.4 percentage points of listing pre-scrutiny errors.
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Policy Action */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="h-4 w-4 text-[#FFA72F] shrink-0" />
          <span className="text-[#D8DFEE]">
            Recommended: Issue ministerial circular for targeted hamlet-group drills in Bihar &amp; UP East.
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
              <span>Directive Staged for ADG</span>
            </>
          ) : (
            <>
              <FileCheck className="h-3.5 w-3.5" />
              <span>Stage Directive</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
