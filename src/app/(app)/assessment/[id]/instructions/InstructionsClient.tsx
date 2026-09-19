'use client';

/**
 * src/app/(app)/assessment/[id]/instructions/InstructionsClient.tsx
 *
 * Assessment instructions screen.
 * Timer has NOT started — sidebar/topbar are still visible.
 * Clicking "Start Test" navigates to the active test route.
 */

import { useRouter } from 'next/navigation';
import { useSafeLocale } from '@/lib/useSafeLocale';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  Eye,
  XCircle,
} from 'lucide-react';

interface InstructionsClientProps {
  assessmentId: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  totalQuestions: number;
  durationSeconds: number;
  type: string;
}

const INSTRUCTIONS_EN = [
  'Read each question carefully before selecting your answer.',
  'You can navigate between questions using the numbered boxes or the Previous / Next buttons.',
  'You can change your selected answer at any time before submitting.',
  'The timer begins only when you click "Start Test" and counts down continuously.',
  'The test ends automatically when the timer reaches 00:00.',
  'Click "End Test" to finish early. You will be asked to confirm.',
  'Review your answers before final submission — you can return to unanswered questions.',
];

const INSTRUCTIONS_HI = [
  'अपना उत्तर चुनने से पहले प्रत्येक प्रश्न को ध्यान से पढ़ें।',
  'आप क्रमांकित बॉक्स या पिछले / अगले बटन का उपयोग करके प्रश्नों के बीच नेविगेट कर सकते हैं।',
  'आप सबमिट करने से पहले किसी भी समय अपना चयनित उत्तर बदल सकते हैं।',
  'टाइमर केवल तब शुरू होता है जब आप "परीक्षा शुरू करें" पर क्लिक करते हैं और लगातार उल्टी गिनती करता है।',
  'टाइमर 00:00 पर पहुंचने पर परीक्षा स्वतः समाप्त हो जाती है।',
  'समय से पहले समाप्त करने के लिए "परीक्षा समाप्त करें" पर क्लिक करें। आपसे पुष्टि करने के लिए कहा जाएगा।',
  'अंतिम सबमिशन से पहले अपने उत्तरों की समीक्षा करें — आप अनुत्तरित प्रश्नों पर वापस लौट सकते हैं।',
];

export default function InstructionsClient({
  assessmentId,
  title,
  titleHi,
  description,
  descriptionHi,
  totalQuestions,
  durationSeconds,
  type,
}: InstructionsClientProps) {
  const router = useRouter();
  const locale = useSafeLocale();
  const isHindi = locale === 'hi';
  const durationMins = Math.round(durationSeconds / 60);

  const displayTitle = (isHindi && titleHi) ? titleHi : title;
  const displayDescription = (isHindi && descriptionHi) ? descriptionHi : description;
  const instructions = isHindi ? INSTRUCTIONS_HI : INSTRUCTIONS_EN;

  const statusLegend = [
    {
      label: isHindi ? 'अनदेखा' : 'Unseen',
      description: isHindi ? 'आपने अभी तक इस प्रश्न को नहीं देखा है।' : 'You have not yet visited this question.',
      colorClass: 'bg-white border-2 border-stone-300 text-stone-700',
    },
    {
      label: isHindi ? 'देखा गया' : 'Visited',
      description: isHindi ? 'आपने यह प्रश्न देखा लेकिन उत्तर नहीं दिया।' : 'You viewed this question but have not answered it.',
      colorClass: 'bg-rose-100 border-2 border-rose-400 text-rose-700',
    },
    {
      label: isHindi ? 'उत्तरित' : 'Answered',
      description: isHindi ? 'आपने इस प्रश्न का उत्तर चुन लिया है।' : 'You have selected an answer for this question.',
      colorClass: 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Back link */}
      <button
        onClick={() => router.push('/assignments')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        id="back-to-assignments"
      >
        <ArrowLeft className="w-4 h-4" />
        {isHindi ? 'मूल्यांकन सूची पर वापस जाएं' : 'Back to Assessments'}
      </button>

      {/* Title block */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{displayTitle}</h1>
        <p className="text-muted-foreground leading-relaxed">{displayDescription}</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: isHindi ? 'प्रश्न' : 'Questions', value: totalQuestions.toString() },
          { icon: Clock, label: isHindi ? 'मिनट' : 'Minutes', value: durationMins.toString() },
          { icon: CheckCircle, label: isHindi ? 'प्रकार' : 'Type', value: isHindi ? 'बहुविकल्पीय' : type },
          { icon: Eye, label: isHindi ? 'प्रयास' : 'Attempts', value: isHindi ? 'असीमित' : 'Unlimited' },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white p-4 text-center shadow-card hover:shadow-card-hover transition-all"
          >
            <Icon className="w-5 h-5 text-[#555934]" />
            <p className="text-xl font-bold text-foreground font-mono">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Instructions list */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {isHindi ? 'आरंभ करने से पहले' : 'Before You Begin'}
        </h2>
        <ul className="space-y-3">
          {instructions.map((instruction, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground">
              <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#555934]/15 text-[#555934] font-semibold text-xs mt-0.5">
                {i + 1}
              </span>
              {instruction}
            </li>
          ))}
        </ul>
      </div>

      {/* Question status colour legend */}
      <div className="rounded-2xl bg-white p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {isHindi ? 'प्रश्न स्थिति संकेत सूची' : 'Question Status Legend'}
        </h2>
        <div className="space-y-3">
          {statusLegend.map(({ label, description: desc, colorClass }) => (
            <div key={label} className="flex items-center gap-4">
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-sm font-bold ${colorClass}`}
                aria-label={label}
              >
                7
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important timer note */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
        <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800">
          <strong>{isHindi ? 'महत्वपूर्ण:' : 'Important:'}</strong>{' '}
          {isHindi
            ? 'जब तक आप नीचे "परीक्षा शुरू करें" पर क्लिक नहीं करते तब तक टाइमर शुरू नहीं होगा। आप इस स्क्रीन पर जितना चाहें उतना समय ले सकते हैं।'
            : 'The timer will not start until you click "Start Test" below. You can take as long as you need on this screen.'}
        </p>
      </div>

      {/* Start Test CTA */}
      <button
        id={`start-test-${assessmentId}`}
        onClick={() => router.push(`/assessment/${assessmentId}/test`)}
        className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#555934] hover:bg-[#3e4225] text-white font-bold text-lg py-4 transition-colors shadow-sm cursor-pointer"
      >
        <PlayCircle className="w-6 h-6" />
        {isHindi ? 'परीक्षा शुरू करें' : 'Start Test'}
      </button>
    </div>
  );
}
