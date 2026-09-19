/**
 * src/app/(app)/assessment/[id]/AssessmentProgress.tsx
 *
 * Progress ring: Shows completion percentage through 3 stages
 */

interface AssessmentProgressProps {
  progress: number; // 0–1
  isHindi?: boolean;
}

export default function AssessmentProgress({ progress, isHindi }: AssessmentProgressProps) {
  const percentage = Math.round(progress * 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${(progress * 283).toFixed(2)} 283`}
            className="text-primary transition-all duration-300"
          />
        </svg>
        {/* Center percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground">{percentage}%</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">{isHindi ? 'प्रगति' : 'Progress'}</p>
    </div>
  );
}
