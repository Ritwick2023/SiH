/**
 * src/app/(app)/assessment/[id]/AssessmentReview.tsx
 *
 * Review page: Shows final proficiency level and submitted answers
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AssessmentState } from '@/services/assessmentService';

interface AssessmentReviewProps {
  assessmentState: AssessmentState;
  competencyName: string;
  language: 'en' | 'hi';
  onSubmit: () => void;
}

const levelLabels: Record<string, { label: string; label_hi: string; description: string; description_hi: string; color: string }> = {
  L1: {
    label: 'Awareness',
    label_hi: 'प्रारंभिक ज्ञान',
    description: 'You have basic knowledge of this competency',
    description_hi: 'आपको इस दक्षता का बुनियादी ज्ञान है',
    color: 'bg-red-100 text-red-800',
  },
  L2: {
    label: 'Understanding',
    label_hi: 'समझ',
    description: 'You demonstrate understanding with guidance',
    description_hi: 'आप मार्गदर्शन के साथ समझ प्रदर्शित करते हैं',
    color: 'bg-orange-100 text-orange-800',
  },
  L3: {
    label: 'Proficiency',
    label_hi: 'प्रवीणता',
    description: 'You can apply this competency independently',
    description_hi: 'आप इस दक्षता को स्वतंत्र रूप से लागू कर सकते हैं',
    color: 'bg-yellow-100 text-yellow-800',
  },
  L4: {
    label: 'Advanced',
    label_hi: 'उन्नत',
    description: 'You demonstrate advanced expertise',
    description_hi: 'आप उन्नत विशेषज्ञता प्रदर्शित करते हैं',
    color: 'bg-lime-100 text-lime-800',
  },
  L5: {
    label: 'Mastery',
    label_hi: 'महारत',
    description: 'You have mastery and can mentor others',
    description_hi: 'आपके पास पूर्ण महारत है और आप दूसरों का मार्गदर्शन कर सकते हैं',
    color: 'bg-green-100 text-green-800',
  },
};

export default function AssessmentReview({
  assessmentState,
  competencyName,
  language,
  onSubmit,
}: AssessmentReviewProps) {
  if (!assessmentState.final_level || assessmentState.stage !== 'COMPLETE') {
    return null;
  }

  const finalLevelStr = assessmentState.final_level || 'L1';
  const levelKey = (finalLevelStr.startsWith('L') ? finalLevelStr : `L${finalLevelStr}`) as keyof typeof levelLabels;
  const levelInfo = levelLabels[levelKey] || levelLabels['L1'];
  const isHindi = language === 'hi';

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {isHindi ? 'मूल्यांकन पूर्ण' : 'Assessment Complete'}
        </h1>
        <p className="text-muted-foreground">
          {isHindi ? 'जमा करने से पहले अपने दक्षता स्तर की समीक्षा करें' : 'Review your proficiency level before submitting'}
        </p>
      </div>

      {/* Result Card */}
      <Card className="p-8 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {isHindi ? 'दक्षता' : 'Competency'}
          </p>
          <h2 className="text-2xl font-semibold mb-4">{competencyName}</h2>
        </div>

        {/* Proficiency Level */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            {isHindi ? 'आपका दक्षता स्तर' : 'Your Proficiency Level'}
          </p>
          <div className={`p-4 rounded-lg ${levelInfo.color}`}>
            <p className="text-2xl font-bold">{isHindi ? levelInfo.label_hi : levelInfo.label}</p>
            <p className="text-sm mt-2">{isHindi ? levelInfo.description_hi : levelInfo.description}</p>
          </div>
        </div>

        {/* Assessment Details */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isHindi ? 'मूल्यांकन प्रकार' : 'Assessment Type'}</span>
            <span className="font-medium">{isHindi ? 'अनुकूली (3-चरण शाखाकरण)' : 'Adaptive (3-Stage Branching)'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isHindi ? 'शाखा पथ' : 'Branch Path'}</span>
            <Badge variant="outline">{assessmentState.branch_path}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isHindi ? 'जमा किए गए उत्तर' : 'Answers Submitted'}</span>
            <span className="font-medium">
              {Object.keys(assessmentState.answers).length} {isHindi ? '(कुल 3)' : 'of 3'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{isHindi ? 'जमा करने का समय' : 'Submitted'}</span>
            <span className="font-medium text-xs">
              {new Date(assessmentState.completed_at || new Date().toISOString()).toLocaleString(
                isHindi ? 'hi-IN' : 'en-US'
              )}
            </span>
          </div>
        </div>
      </Card>

      {/* Submission Note */}
      <div className="p-4 bg-secondary rounded-lg text-sm">
        <p className="font-semibold mb-2">
          {isHindi ? 'आगे क्या होगा?' : 'What Happens Next?'}
        </p>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            {isHindi
              ? '✓ आपका दक्षता स्तर आपकी प्रोफ़ाइल में दर्ज किया जाएगा'
              : '✓ Your proficiency level will be recorded in your profile'}
          </li>
          <li>
            {isHindi
              ? '✓ अनुशंसित शिक्षण पथ अद्यतित किए जाएंगे'
              : '✓ Recommended learning pathways will be updated'}
          </li>
          <li>
            {isHindi
              ? '✓ आपकी प्रगति आपके विभाग को दिखाई देगी'
              : '✓ Your progress will be visible to your organization'}
          </li>
          {typeof navigator !== 'undefined' && !navigator.onLine && (
            <li>
              {isHindi
                ? '⚠️ ऑनलाइन होने पर यह मूल्यांकन स्वचालित रूप से सिंक हो जाएगा'
                : "⚠️ This assessment will sync once you're online"}
            </li>
          )}
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          onClick={onSubmit}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {isHindi ? 'जमा करें और आगे बढ़ें' : 'Submit & Continue'}
        </button>
      </div>
    </div>
  );
}
