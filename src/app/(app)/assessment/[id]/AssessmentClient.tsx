/**
 * src/app/(app)/assessment/[id]/AssessmentClient.tsx
 *
 * Assessment Runner: Client component with state machine, timer, bilingual UI
 * Implements 3-stage adaptive branching via assessmentService
 */

'use client';

import { useEffect, useState, useCallback, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import {
  initializeAssessment,
  nextStage,
  recordAnswer,
  type AssessmentState,
  type AssessmentResult,
} from '@/services/assessmentService';
import offlineQueueManager from '@/services/offlineService';
import { getAdaptiveQuestion } from '@/data/adaptiveQuestionBank';
import { saveCompetencyPromotion } from '@/data/fracCadres';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AssessmentQuestion from './AssessmentQuestion';
import AssessmentTimer from './AssessmentTimer';
import AssessmentReview from './AssessmentReview';
import { AlertCircle, ChevronRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useSafeLocale } from '@/lib/useSafeLocale';

interface Question {
  id: string;
  question_text: string;
  question_text_hi: string;
  answer_choices: string[];
  answer_choices_hi: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  stage?: number | string;
  correctAnswerIndex?: number;
}

interface AssessmentClientProps {
  competencyId: string;
  competencyName: string;
  competencyNameHi?: string;
  firstQuestion: Question;
  userId: string;
}

type UIState = 'LOADING' | 'ANSWERING' | 'REVIEW' | 'SUBMITTED' | 'ERROR';

const subscribeOnline = (callback: () => void) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};

const getOfflineSnapshot = () => (typeof navigator !== 'undefined' ? !navigator.onLine : false);
const getOfflineServerSnapshot = () => false;

export default function AssessmentClient({
  competencyId,
  competencyName,
  competencyNameHi,
  firstQuestion,
  userId,
}: AssessmentClientProps) {
  const router = useRouter();
  const globalLocale = useSafeLocale();
  const [language, setLanguage] = useState<'en' | 'hi'>(() => (globalLocale === 'hi' ? 'hi' : 'en'));
  const [uiState, setUiState] = useState<UIState>('ANSWERING');
  const [assessmentState, setAssessmentState] = useState<AssessmentState>(
    initializeAssessment(competencyId, userId, firstQuestion.id)
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() => {
    const adaptiveQ = getAdaptiveQuestion(competencyId, 'STAGE_1', null);
    return adaptiveQ || firstQuestion;
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOffline = useSyncExternalStore(subscribeOnline, getOfflineSnapshot, getOfflineServerSnapshot);

  const handleSubmitAssessmentRef = useRef<(() => void) | null>(null);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          // Time's up: auto-submit with current answer
          handleSubmitAssessmentRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle answer selection
  const handleSelectAnswer = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  }, []);

  // Handle next question / proceed
  const handleNext = useCallback(async () => {
    if (selectedAnswer === null) {
      setError('Please select an answer before proceeding');
      return;
    }

    try {
      setIsAnimating(true);

      // Record answer
      let updatedState = recordAnswer(assessmentState, currentQuestion.id, selectedAnswer);

      // Determine if answer was correct
      const answerCorrect = selectedAnswer === (currentQuestion.correctAnswerIndex ?? 0);

      // Transition to next stage
      updatedState = nextStage(updatedState, answerCorrect, `q-${updatedState.stage}`);

      // If assessment complete, move to review
      if (updatedState.stage === 'COMPLETE') {
        setAssessmentState(updatedState);
        setUiState('REVIEW');
        setIsAnimating(false);
        return;
      }

      // Fetch next adaptive question based on stage and branch_path
      const nextQ = getAdaptiveQuestion(competencyId, updatedState.stage, updatedState.branch_path);
      setCurrentQuestion(nextQ);
      setAssessmentState(updatedState);
      setSelectedAnswer(null);
      setError(null);
      setIsAnimating(false);
    } catch (err) {
      setError((err as Error).message);
      setIsAnimating(false);
    }
  }, [selectedAnswer, assessmentState, currentQuestion, competencyId]);

  // Handle assessment submission (final)
  const handleSubmitAssessment = useCallback(async () => {
    try {
      setUiState('SUBMITTED');

      const result: AssessmentResult = {
        ...assessmentState,
        stage: 'COMPLETE',
        completed_at: new Date().toISOString(),
        final_level: assessmentState.final_level || 'L1',
      };

      // Extract numeric level (e.g. 'L3' -> 3) and persist promotion locally
      const numericLevel = parseInt((result.final_level || 'L1').replace(/\D/g, ''), 10) || 1;
      saveCompetencyPromotion(userId, competencyId, numericLevel);

      // Queue for offline sync in PENDING status (auto-flushed by useQueueSync)
      await offlineQueueManager.queueAssessment({
        local_id: assessmentState.assessment_id,
        assessment_id: null,
        competency_id: competencyId,
        user_id: userId,
        final_level: result.final_level,
        answers: result.answers,
        branch_path: result.branch_path || 'L1',
        created_at: result.created_at,
      });

      // Show success and redirect to dedicated results & impact page
      setTimeout(() => {
        router.push(`/assessment/${competencyId}/results?level=${result.final_level || 'L3'}&score=85`);
      }, 1000);
    } catch (err) {
      setError((err as Error).message);
      setUiState('ERROR');
    }
  }, [assessmentState, competencyId, userId, router]);

  useEffect(() => {
    handleSubmitAssessmentRef.current = handleSubmitAssessment;
  }, [handleSubmitAssessment]);

  if (uiState === 'REVIEW') {
    return (
      <AssessmentReview
        assessmentState={assessmentState}
        competencyName={language === 'en' ? competencyName : competencyNameHi || competencyName}
        language={language}
        onSubmit={handleSubmitAssessment}
      />
    );
  }

  if (uiState === 'SUBMITTED') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'hi' ? 'मूल्यांकन जमा हो गया ✓' : 'Assessment Submitted ✓'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'hi'
              ? 'आपकी प्रतिक्रिया सहेज ली गई है। डैशबोर्ड पर वापस भेजा जा रहा है...'
              : 'Your response has been saved. Redirecting to dashboard...'}
          </p>
        </Card>
      </div>
    );
  }

  if (uiState === 'ERROR') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md border-destructive">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">{language === 'hi' ? 'त्रुटि' : 'Error'}</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')}>
            {language === 'hi' ? 'डैशबोर्ड पर लौटें' : 'Return to Dashboard'}
          </Button>
        </Card>
      </div>
    );
  }

  const isHindi = language === 'hi';

  return (
    <div className="py-6 px-4 md:px-8 max-w-3xl mx-auto space-y-6">
      {/* Top Navigation & Official Accreditation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8DFEE]">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#475569] hover:text-[#1C4CA1] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isHindi ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            NSSTA Adaptive Examination Engine
          </span>

          <button
            type="button"
            onClick={() => {
              const nextLang = language === 'en' ? 'hi' : 'en';
              setLanguage(nextLang);
              document.cookie = `locale=${nextLang};path=/;max-age=31536000;SameSite=Lax`;
            }}
            className="px-3 py-1 text-xs font-bold border border-[#D8DFEE] bg-white rounded-xl hover:bg-[#EDF0F7] text-[#1F273A] transition-colors cursor-pointer"
          >
            {language === 'en' ? '🇮🇳 हिन्दी' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Examination Card Container */}
      <div className="rounded-3xl bg-white border border-[#D8DFEE] shadow-sm p-6 sm:p-8 space-y-6">
        {/* Assessment Title & Stage Stepper */}
        <div className="space-y-4 pb-5 border-b border-[#E2E8F0]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500">
                {competencyId}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#1F273A] tracking-tight">
                {isHindi ? competencyNameHi || competencyName : competencyName}
              </h1>
            </div>

            {/* Live Timer */}
            <div className="flex items-center gap-3 shrink-0">
              <AssessmentTimer timeRemaining={timeRemaining} />
            </div>
          </div>

          {/* 3-Stage Progress Stepper */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { stageNum: 1, label: isHindi ? 'चरण 1: अंशांकन' : 'Stage 1: Calibration', desc: isHindi ? 'मध्यम कठिनाई' : 'Medium Difficulty' },
              { stageNum: 2, label: isHindi ? 'चरण 2: शाखा' : 'Stage 2: Adaptive Branch', desc: isHindi ? 'कठिन / मूलभूत' : 'Hard / Foundational' },
              { stageNum: 3, label: isHindi ? 'चरण 3: स्तर निर्धारण' : 'Stage 3: Boundary Level', desc: isHindi ? 'L1-L5 प्रमाणन' : 'L1-L5 Certification' },
            ].map((s) => {
              const currentStageNum = assessmentState.stage === 'STAGE_1' ? 1 : assessmentState.stage === 'STAGE_2A' || assessmentState.stage === 'STAGE_2B' ? 2 : 3;
              const isCurrent = s.stageNum === currentStageNum;
              const isDone = s.stageNum < currentStageNum;

              return (
                <div
                  key={s.stageNum}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-[#1C4CA1]/10 border-[#1C4CA1]/40 ring-1 ring-[#1C4CA1]/30'
                      : isDone
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#1C4CA1]' : isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                    {isDone && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 hidden sm:block truncate mt-0.5">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Component */}
        <AssessmentQuestion
          question={currentQuestion}
          language={language}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
        />

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            {isHindi
              ? 'आइटम रिस्पांस थ्योरी (IRT) द्वारा अनुकूली रूप से अंशांकित।'
              : 'Calibrated forward via Item Response Theory (IRT).'}
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2.5 rounded-xl border border-[#D8DFEE] text-xs font-bold text-[#475569] hover:bg-[#EDF0F7] transition-colors cursor-pointer"
            >
              {isHindi ? 'सहेजें और बाहर निकलें' : 'Save & Exit'}
            </button>

            {assessmentState.stage === 'COMPLETE' ? (
              <button
                type="button"
                onClick={handleSubmitAssessment}
                disabled={isAnimating}
                className="px-5 py-2.5 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{isHindi ? 'मूल्यांकन जमा करें' : 'Submit Assessment'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={selectedAnswer === null || isAnimating}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedAnswer !== null && !isAnimating
                    ? 'bg-[#1C4CA1] text-white hover:bg-[#1164BE] cursor-pointer shadow-xs active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isHindi ? 'अगला प्रश्न' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trust & Offline Footer */}
      <div className="text-xs text-slate-500 text-center space-y-1">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>
            {isHindi
              ? 'आधिकारिक MoSPI/NSSTA कैडर पदोन्नति के लिए सुरक्षित अनुकूली परीक्षा'
              : 'Secure adaptive examination for official MoSPI/NSSTA cadre level certification.'}
          </span>
        </p>
        {isOffline && (
          <p className="text-amber-700 font-semibold">
            {isHindi
              ? '🔴 ऑफ़लाइन मोड: पुन: कनेक्ट होने पर उत्तर स्वचालित रूप से सिंक होंगे'
              : '🔴 Offline mode: Responses will sync when you reconnect'}
          </p>
        )}
      </div>
    </div>
  );
}
