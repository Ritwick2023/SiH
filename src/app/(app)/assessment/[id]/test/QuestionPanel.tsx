/**
 * src/app/(app)/assessment/[id]/test/QuestionPanel.tsx
 *
 * Displays the current question and its answer options.
 * Uses radio-style interaction matching the existing AssessmentQuestion aesthetic.
 */

import React, { useState } from 'react';
import { useSafeLocale } from '@/lib/useSafeLocale';
import { Volume2, VolumeX } from 'lucide-react';
import { BhashiniService } from '@/services/bhashiniService';

interface QuestionPanelProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export default function QuestionPanel({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedAnswer,
  onSelectAnswer,
}: QuestionPanelProps) {
  const locale = useSafeLocale();
  const isHindi = locale === 'hi';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleReadAloud = async () => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    await BhashiniService.synthesize(questionText, isHindi ? 'hi' : 'en');
    const wordCount = questionText.split(/\s+/).length;
    const timeoutMs = Math.max(2500, wordCount * 300);
    setTimeout(() => setIsSpeaking(false), timeoutMs);
  };

  return (
    <div className="flex-1 px-4 sm:px-8 py-6 max-w-3xl mx-auto w-full">
      {/* Question heading with TTS read aloud */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {isHindi
              ? `प्रश्न ${questionNumber} / ${totalQuestions}`
              : `Question ${questionNumber} of ${totalQuestions}`}
          </p>
          <button
            type="button"
            onClick={handleReadAloud}
            title={isSpeaking ? 'Stop Reading / रोकें' : 'Read Question Aloud (Bhashini TTS) / प्रश्न सुनें'}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : 'bg-[#EDF0F7] text-[#1C4CA1] hover:bg-[#DCE1EC]'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-3.5 w-3.5 text-amber-700" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-[#1C4CA1]" />
            )}
            <span>{isSpeaking ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'सुनें' : 'Read Aloud')}</span>
          </button>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
          {questionText}
        </h2>
      </div>

      {/* Answer options */}
      <fieldset>
        <legend className="sr-only">
          {isHindi
            ? `प्रश्न ${questionNumber} के लिए अपना उत्तर चुनें`
            : `Select your answer for question ${questionNumber}`}
        </legend>
        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            return (
              <label
                key={idx}
                htmlFor={`option-${idx}`}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-14 ${
                  isSelected
                    ? 'border-[#555934] bg-[#555934]/10'
                    : 'border-border bg-white hover:border-[#BF9B7A] hover:bg-[#F2E6D8]/30'
                }`}
              >
                {/* Option letter circle */}
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors mt-0.5 ${
                    isSelected
                      ? 'border-[#555934] bg-[#555934] text-white'
                      : 'border-stone-300 bg-white text-stone-500'
                  }`}
                  aria-hidden="true"
                >
                  {OPTION_LABELS[idx] ?? idx + 1}
                </span>

                {/* Hidden native radio for accessibility */}
                <input
                  type="radio"
                  id={`option-${idx}`}
                  name="question-option"
                  value={idx}
                  checked={isSelected}
                  onChange={() => onSelectAnswer(idx)}
                  className="sr-only"
                />

                <span className="flex-1 text-sm sm:text-base font-medium text-foreground leading-relaxed">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
