'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { type GeneratedQuestion } from '@/services/mcqService';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Send,
  Check,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

import { useSafeLocale } from '@/lib/useSafeLocale';

export interface AnswerRecord {
  selectedIndex: number;
  isChecked: boolean;
}

interface DocumentPracticeCardProps {
  question: GeneratedQuestion;
  docTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onNextQuestion: () => void;
  isGeneratingNext: boolean;
  onStageToQueue: () => void;
  stagedToQueue: boolean;
  onApproveToBank?: () => void;
  approvedToBank?: boolean;
  // Multi-question batch navigation
  currentIndex?: number;
  totalCount?: number;
  onPreviousQuestion?: () => void;
  onJumpToQuestion?: (index: number) => void;
  sessionAnswers?: Record<number, AnswerRecord>;
  onRecordAnswer?: (qIndex: number, optIndex: number, checked: boolean) => void;
  onResetSession?: () => void;
}

export function DocumentPracticeCard({
  question,
  docTitle,
  difficulty,
  onNextQuestion,
  isGeneratingNext,
  onStageToQueue,
  stagedToQueue,
  onApproveToBank,
  approvedToBank = false,
  currentIndex = 0,
  totalCount = 1,
  onPreviousQuestion,
  onJumpToQuestion,
  sessionAnswers,
  onRecordAnswer,
  onResetSession,
}: DocumentPracticeCardProps) {
  const systemLocale = useSafeLocale();
  const currentRecord = sessionAnswers?.[currentIndex];
  const [selectedOption, setSelectedOption] = useState<number | null>(
    currentRecord ? currentRecord.selectedIndex : null
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(
    currentRecord ? currentRecord.isChecked : false
  );
  const [langOverride, setLangOverride] = useState<'en' | 'hi' | null>(null);
  const lang = langOverride ?? (systemLocale === 'hi' ? 'hi' : 'en');
  const isHindi = lang === 'hi';

  const [showExplanation, setShowExplanation] = useState(
    currentRecord ? currentRecord.isChecked : false
  );

  const isCorrect = selectedOption === question.correctIndex;
  const currentStem = lang === 'en' ? (question.stemEn || question.stemHi) : (question.stemHi || question.stemEn);
  const currentOptions = lang === 'en' ? (question.optionsEn || question.optionsHi) : (question.optionsHi || question.optionsEn);
  const currentRationale = lang === 'en' ? (question.rationaleEn || question.rationaleHi) : (question.rationaleHi || question.rationaleEn);

  const handleSelect = (idx: number) => {
    if (!isSubmitted) {
      setSelectedOption(idx);
      onRecordAnswer?.(currentIndex, idx, false);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    setShowExplanation(true);
    onRecordAnswer?.(currentIndex, selectedOption, true);
  };

  const hasNext = totalCount > 1 && currentIndex < totalCount - 1;
  const hasPrevious = totalCount > 1 && currentIndex > 0;

  // Calculate score across batch
  const answeredCount = Object.keys(sessionAnswers || {}).filter(
    (k) => sessionAnswers?.[Number(k)]?.isChecked
  ).length;

  return (
    <Card className="border-stone-200 bg-white shadow-md rounded-2xl overflow-hidden animate-in fade-in-50 duration-300">
      {/* Header Banner */}
      <CardHeader className="border-b border-stone-100 bg-stone-50/70 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Sparkles className="h-3 w-3 text-emerald-700" />
                {isHindi ? 'AI अभ्यास स्टेशन' : 'AI Practice Station'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 font-semibold uppercase tracking-wider">
                {difficulty === 'easy' ? (isHindi ? 'सरल अंशांकन' : 'Easy Calibration') : difficulty === 'hard' ? (isHindi ? 'कठिन अंशांकन' : 'Hard Calibration') : (isHindi ? 'मध्यम अंशांकन' : 'Medium Calibration')}
              </span>
              <span className="text-xs text-stone-500 font-medium truncate max-w-xs sm:max-w-md">
                • {isHindi ? 'आधार:' : 'Grounded in:'} <strong>{docTitle}</strong>
              </span>
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-stone-900 pt-1">
              {isHindi ? 'स्व-गति ज्ञान जांच' : 'Self-Paced Knowledge Check'}
            </CardTitle>
            <CardDescription className="text-xs text-stone-600">
              {isHindi
                ? 'आधिकारिक दिशानिर्देशों के आधार पर सर्वोत्तम उत्तर चुनें। कोई समय सीमा या नकारात्मक अंकन नहीं।'
                : 'Select the best answer based on the official guidelines. No timer or scoring penalties.'}
            </CardDescription>
          </div>

          {/* Language Switcher */}
          <div className="flex rounded-xl bg-stone-200/70 p-1 border border-stone-300/80 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setLangOverride('en')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                lang === 'en'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLangOverride('hi')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                lang === 'hi'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Batch Stepper Bar (if multiple questions) */}
        {totalCount > 1 && (
          <div className="pt-4 mt-2 border-t border-stone-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">
                {isHindi ? 'प्रश्न' : 'Question'} <strong className="text-[#1C4CA1]">{currentIndex + 1}</strong> {isHindi ? 'कुल' : 'of'}{' '}
                <strong>{totalCount}</strong>
              </span>
              <span className="text-stone-500">
                {isHindi ? 'प्रगति:' : 'Progress:'} {answeredCount}/{totalCount} {isHindi ? 'पूर्ण' : 'Completed'}
              </span>
            </div>

            {/* Pagination Bubbles */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {Array.from({ length: totalCount }).map((_, idx) => {
                const record = sessionAnswers?.[idx];
                const isCurrent = idx === currentIndex;
                const isAnswered = record?.isChecked;

                let bubbleStyle = 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200';
                if (isCurrent) {
                  bubbleStyle = 'bg-[#1C4CA1] text-white border-[#1C4CA1] ring-2 ring-[#1C4CA1]/30';
                } else if (isAnswered) {
                  bubbleStyle = 'bg-emerald-600 text-white border-emerald-600';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => onJumpToQuestion?.(idx)}
                    className={`h-7 w-7 rounded-lg text-xs font-bold border transition flex items-center justify-center cursor-pointer ${bubbleStyle}`}
                    title={isHindi ? `प्रश्न ${idx + 1} पर जाएं` : `Go to question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-5 sm:p-7 space-y-6">
        {/* Question Stem */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-stone-500" />
              {isHindi ? 'परिचालन प्रश्न (हिन्दी)' : 'Operational Question (English)'}
            </span>
            {totalCount > 1 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                {isHindi ? `प्रश्न #${currentIndex + 1}` : `Item #${currentIndex + 1}`}
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-stone-900 leading-relaxed">
            {currentStem}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
            <span>{isHindi ? 'एक विकल्प का चयन करें:' : 'Select one answer choice:'}</span>
            {isSubmitted && (
              <span
                className={`text-xs font-bold flex items-center gap-1 ${
                  isCorrect ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> {isHindi ? 'सही उत्तर!' : 'Correct Answer!'}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" /> {isHindi ? 'नीचे दिए गए प्रोटोकॉल की समीक्षा करें' : 'Review Protocol Below'}
                  </>
                )}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {currentOptions.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isChosen = selectedOption === idx;
              const isTargetAnswer = idx === question.correctIndex;

              let cardStyle =
                'border-stone-200 hover:border-stone-400 bg-white text-stone-800 hover:bg-stone-50/50';
              let badgeStyle = 'bg-stone-100 text-stone-700 border-stone-200';

              if (!isSubmitted) {
                if (isChosen) {
                  cardStyle =
                    'border-[#1C4CA1] ring-2 ring-[#1C4CA1]/20 bg-[#1C4CA1]/5 text-stone-950 font-medium';
                  badgeStyle = 'bg-[#1C4CA1] text-white border-[#1C4CA1]';
                }
              } else {
                if (isTargetAnswer) {
                  cardStyle =
                    'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 text-emerald-950 font-semibold';
                  badgeStyle = 'bg-emerald-700 text-white border-emerald-700';
                } else if (isChosen && !isTargetAnswer) {
                  cardStyle =
                    'border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/80 text-rose-950 font-medium';
                  badgeStyle = 'bg-rose-600 text-white border-rose-600';
                } else {
                  cardStyle = 'border-stone-200 bg-white/60 text-stone-400 opacity-70';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelect(idx);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none ${cardStyle}`}
                >
                  <span
                    className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold shrink-0 border mt-0.5 transition ${badgeStyle}`}
                  >
                    {letter}
                  </span>

                  <span className="flex-1 text-sm sm:text-base leading-snug">{opt}</span>

                  {isSubmitted && isTargetAnswer && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 self-center">
                      {isHindi ? 'सत्यापित उत्तर' : 'Correct Key'}
                    </span>
                  )}

                  {isSubmitted && isChosen && !isTargetAnswer && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 shrink-0 self-center">
                      {isHindi ? 'आपका चयन' : 'Your Choice'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls: Navigation, Check Answer, Next */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasPrevious && (
              <button
                onClick={onPreviousQuestion}
                className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <ChevronLeft className="h-4 w-4" />
                {isHindi ? 'पिछला' : 'Previous'}
              </button>
            )}

            {!isSubmitted ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#1C4CA1] hover:bg-[#1164BE] disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isHindi ? 'उत्तर जांचें' : 'Check Answer'}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : hasNext ? (
              <button
                onClick={onNextQuestion}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#1C4CA1] hover:bg-[#1164BE] text-white text-sm font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isHindi ? 'अगला प्रश्न' : 'Next Question'}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={onResetSession || onNextQuestion}
                disabled={isGeneratingNext}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#1C4CA1] hover:bg-[#1164BE] text-white text-sm font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isGeneratingNext ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {isHindi ? 'पीडीएफ से निर्माण हो रहा है...' : 'Generating from PDF...'}
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    {isHindi ? 'पूर्ण एवं पुनः अभ्यास करें' : 'Complete & Practice Again'}
                  </>
                )}
              </button>
            )}

            {isSubmitted && (
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
              >
                {showExplanation
                  ? (isHindi ? 'व्याख्या छिपाएं' : 'Hide Explanation')
                  : (isHindi ? 'व्याख्या देखें' : 'View Explanation')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>{isHindi ? 'MoSPI संज्ञानात्मक मूल्यांकन इंजन' : 'MoSPI Cognitive Assessment Engine'}</span>
            <span>•</span>
            <span>{isHindi ? 'सहमति:' : 'Consensus:'} {(question.consensusScore * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Pedagogical Explanation Drawer / Accordion */}
        {showExplanation && (
          <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-5 space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <BookOpen className="h-4 w-4 text-amber-700" />
              <span>{isHindi ? 'MoSPI प्रोटोकॉल व्याख्या और उद्धरण' : 'MoSPI Protocol Explanation & Citation'}</span>
            </div>

            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-normal">
              {currentRationale}
            </p>

            <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
              <div>
                <strong>{isHindi ? 'उद्धरण संदर्भ:' : 'Citation Anchor:'}</strong> {question.citation}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {stagedToQueue ? (
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> {isHindi ? 'समीक्षा कतार में रखा गया' : 'Staged into Review Queue'}
                  </span>
                ) : (
                  <button
                    onClick={onStageToQueue}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-xs transition"
                  >
                    <Send className="h-3 w-3" /> {isHindi ? 'समीक्षा कतार में सहेजें' : 'Save to Review Queue'}
                  </button>
                )}

                {onApproveToBank && (
                  approvedToBank ? (
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Approved to Exam Bank
                    </span>
                  ) : (
                    <button
                      onClick={onApproveToBank}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Certify & Approve
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Staged Confirmation alert */}
        {(stagedToQueue || approvedToBank) && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {approvedToBank ? (
                  isHindi ? (
                    <>आइटम को औपचारिक MoSPI मूल्यांकनों के लिए <strong>प्रमाणित और लाइव परीक्षा बैंक में अनुमोदित</strong> किया गया है।</>
                  ) : (
                    <>Item <strong>certified & approved into live Exam Bank</strong> for official MoSPI assessments.</>
                  )
                ) : (
                  isHindi ? (
                    <>प्रश्न औपचारिक मूल्यांकन में शामिल करने हेतु <strong>संकाय समीक्षा कतार</strong> में सहेज लिया गया है।</>
                  ) : (
                    <>Item saved to <strong>Faculty Review Queue</strong> for inclusion in formal assessments.</>
                  )
                )}
              </span>
            </div>
            <Link
              href="/review-queue"
              prefetch={true}
              className="font-bold underline text-emerald-800 hover:text-emerald-950 shrink-0"
            >
              {isHindi ? 'कतार खोलें →' : 'Open Queue →'}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
