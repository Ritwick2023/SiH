'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { FAQ_CATEGORIES } from '@/data/copilotFaqCategories';

interface CopilotFaqBrowserProps {
  isHindi: boolean;
  onSelectQuestion: (prompt: string) => void;
}

export function CopilotFaqBrowser({ isHindi, onSelectQuestion }: CopilotFaqBrowserProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleCategory = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#F2E6D8] to-[#F2E6D8]/80 backdrop-blur-sm px-3.5 py-2.5 border-b border-[#BF9B7A]/20">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#555934]/15">
            <MessageCircleQuestion className="h-3.5 w-3.5 text-[#555934]" />
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-[#2d1f17] leading-tight">
              {isHindi ? 'ज्ञान आधार' : 'Knowledge Base'}
            </h3>
            <p className="text-[10px] text-[#705849]">
              {isHindi ? '54 पूर्व-लिखित उत्तर • तुरंत जवाब' : '54 instant answers • tap any question'}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Accordion */}
      <div className="px-2 py-2 space-y-1">
        {FAQ_CATEGORIES.map((cat) => {
          const isExpanded = expandedId === cat.id;

          return (
            <div
              key={cat.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                background: isExpanded ? 'rgba(85, 89, 52, 0.06)' : 'transparent',
              }}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="flex w-full items-center gap-2 px-2.5 py-2 text-left transition-colors hover:bg-[#555934]/8 rounded-xl group"
              >
                <span className="text-sm leading-none">{cat.emoji}</span>
                <span className="flex-1 text-[12px] font-semibold text-[#2d1f17] group-hover:text-[#555934] transition-colors">
                  {isHindi ? cat.title_hi : cat.title}
                </span>
                <span className="flex h-4 min-w-[18px] items-center justify-center rounded-full bg-[#555934]/12 px-1 text-[9px] font-bold text-[#555934]">
                  {cat.questions.length}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#705849] shrink-0 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Questions List (expandable) */}
              <div
                className="overflow-hidden transition-all duration-250 ease-out"
                style={{
                  maxHeight: isExpanded ? `${cat.questions.length * 40 + 8}px` : '0px',
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div className="px-1.5 pb-1.5 space-y-0.5">
                  {cat.questions.map((q, qIdx) => (
                    <button
                      key={`${cat.id}-${qIdx}`}
                      onClick={() => onSelectQuestion(q.prompt)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] text-[#2d1f17] transition-all hover:bg-white hover:shadow-xs active:scale-[0.98] group/q"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#555934]/10 text-[9px] font-bold text-[#555934] shrink-0 group-hover/q:bg-[#555934] group-hover/q:text-white transition-colors">
                        {qIdx + 1}
                      </span>
                      <span className="flex-1 leading-snug group-hover/q:text-[#555934] transition-colors">
                        {isHindi ? q.label_hi : q.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom padding */}
      <div className="h-2" />
    </div>
  );
}
