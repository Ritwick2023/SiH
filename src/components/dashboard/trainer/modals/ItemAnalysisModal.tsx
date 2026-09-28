'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  BookOpen,
  Check,
  Edit3,
} from 'lucide-react';

export interface ItemAnalysisData {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  discriminationIndex: number; // e.g. 0.42
  facilityIndex: number; // e.g. 0.68
  distractorPercentages: number[]; // e.g. [14, 68, 12, 6]
  totalResponses: number; // e.g. 420
  competencyTag: string;
  sourceDoc: string;
  section: string;
  sourceSnippet: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface ItemAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemAnalysisData | null;
  onStatusChange?: (id: string, status: 'approved' | 'rejected') => void;
  isHindi?: boolean;
}

export function ItemAnalysisModal({
  isOpen,
  onClose,
  item,
  onStatusChange,
  isHindi = false,
}: ItemAnalysisModalProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleAction = (status: 'approved' | 'rejected') => {
    onStatusChange?.(item.id, status);
    setFeedback(
      status === 'approved'
        ? (isHindi ? 'प्रश्न आधिकारिक परीक्षा पूल के लिए स्वीकृत!' : 'Question approved for official exam bank!')
        : (isHindi ? 'संकाय व्यामोहक संशोधन के लिए प्रश्न चिह्नित किया गया।' : 'Question flagged for faculty distractor revision.')
    );
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1500);
  };

  const getDiscriminationLabel = (d: number) => {
    if (d >= 0.4)
      return {
        label: isHindi ? 'उत्कृष्ट विभेदक' : 'Excellent Discriminator',
        color: 'text-emerald-700 bg-emerald-500/15',
      };
    if (d >= 0.3)
      return {
        label: isHindi ? 'अच्छा विभेदक' : 'Good Discriminator',
        color: 'text-blue-700 bg-blue-500/15',
      };
    if (d >= 0.2)
      return {
        label: isHindi ? 'सीमांत विभेदक' : 'Marginal Discriminator',
        color: 'text-amber-700 bg-amber-500/15',
      };
    return {
      label: isHindi ? 'कमजोर विभेदक' : 'Poor Discriminator',
      color: 'text-red-700 bg-red-500/15',
    };
  };

  const dInfo = getDiscriminationLabel(item.discriminationIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#D8DFEE] flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#D8DFEE] bg-[#EDF0F7]/60">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20 font-mono">
                {item.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${dInfo.color}`}>
                {dInfo.label} (D={item.discriminationIndex.toFixed(2)})
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {isHindi ? 'सुगमता' : 'Facility'} p={item.facilityIndex.toFixed(2)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1F273A] tracking-tight">
              {isHindi ? 'मनोमितीय प्रश्न विश्लेषण' : 'Psychometric Item Analysis'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isHindi
                ? `एनएसएसओ आंचलिक प्रशिक्षण केंद्रों में ${item.totalResponses.toLocaleString()} प्रशिक्षुओं की प्रतिक्रियाओं पर आधारित`
                : `Based on ${item.totalResponses.toLocaleString()} trainee responses across NSSO Zonal Training Centres`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-[#D8DFEE] text-muted-foreground hover:bg-[#EDF0F7] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {feedback && (
          <div className="m-6 mb-0 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Question Stem */}
          <div className="p-4 rounded-xl bg-[#EDF0F7]/40 border border-[#D8DFEE] space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1C4CA1]">
              {isHindi ? 'मूल्यांकित प्रश्न' : 'Evaluated Question Stem'}
            </p>
            <p className="text-xs font-semibold text-[#1F273A] leading-relaxed">
              {item.stem}
            </p>
          </div>

          {/* Distractor Frequency Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <p className="font-bold text-[#1F273A]">
                {isHindi ? 'व्यामोहक आवृत्ति एवं चयन वितरण' : 'Distractor Frequency & Selection Spread'}
              </p>
              <span className="text-[10px] text-muted-foreground font-mono">
                {isHindi ? 'हरा = सही उत्तर' : 'Green = Correct Answer'}
              </span>
            </div>

            <div className="space-y-2.5">
              {item.options.map((option, idx) => {
                const isCorrect = idx === item.correctIndex;
                const pct = item.distractorPercentages[idx] ?? 0;
                const isWeakDistractor = !isCorrect && pct < 8;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs transition-all space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-[#1F273A]'
                        : 'bg-white border-[#D8DFEE] text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <span
                          className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#EDF0F7] text-muted-foreground border border-[#D8DFEE]'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={`font-medium ${isCorrect ? 'text-[#1F273A] font-semibold' : ''}`}>
                          {option}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono font-bold text-xs text-[#1F273A]">
                          {pct}%
                        </span>
                        {isWeakDistractor && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30">
                            {isHindi ? 'निम्न विभेदन' : 'Low Discrim.'}
                          </span>
                        )}
                        {isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#D8DFEE] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCorrect ? 'bg-emerald-600' : pct > 20 ? 'bg-amber-500' : 'bg-muted-foreground/50'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RAG Source Citation & Snippet */}
          <div className="p-4 rounded-xl bg-[#1F273A] text-white space-y-2 border border-[#2C3B59]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#FFA72F]" />
                <span className="font-bold text-[#FFA72F] text-[11px] uppercase tracking-wider">
                  {isHindi ? 'आधिकारिक MoSPI नियमावली उद्धरण' : 'Official MoSPI Manual Citation'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-300">
                {item.section}
              </span>
            </div>
            <p className="text-[11px] font-mono text-white font-semibold">
              {item.sourceDoc}
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-serif leading-relaxed text-slate-200">
              &quot;{item.sourceSnippet}&quot;
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#D8DFEE] bg-[#EDF0F7]/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#D8DFEE] text-xs font-bold text-muted-foreground hover:bg-[#EDF0F7] transition-colors cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAction('rejected')}
              className="px-3.5 py-2 rounded-xl bg-white border border-amber-500/40 text-amber-800 text-xs font-bold hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isHindi ? 'संशोधन के लिए चिह्नित करें' : 'Flag for Revision'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('approved')}
              className="px-4 py-2 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{isHindi ? 'परीक्षा पूल के लिए स्वीकृत करें' : 'Approve for Exam Pool'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemAnalysisModal;
