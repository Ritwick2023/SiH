import { CheckCircle2 } from 'lucide-react';

interface QuestionProps {
  question: {
    id: string;
    question_text: string;
    question_text_hi: string;
    answer_choices: string[];
    answer_choices_hi: string[];
  };
  language: 'en' | 'hi';
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
}

export default function AssessmentQuestion({
  question,
  language,
  selectedAnswer,
  onSelectAnswer,
}: QuestionProps) {
  const questionText = language === 'en' ? question.question_text : question.question_text_hi;
  const choices = language === 'en' ? question.answer_choices : question.answer_choices_hi;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[#1C4CA1]/10 text-[#1C4CA1] inline-block">
          {language === 'hi' ? 'आधिकारिक स्थिति परिदृश्य' : 'Official Case Scenario'}
        </span>
        <h2 className="text-lg sm:text-xl font-black text-[#1F273A] leading-relaxed">
          {questionText}
        </h2>
        <p className="text-xs text-muted-foreground">
          {language === 'hi'
            ? 'आगे बढ़ने के लिए सबसे उपयुक्त मानक परिचालन प्रोटोकॉल चुनें:'
            : 'Select the most appropriate standard operating protocol to proceed:'}
        </p>
      </div>

      {/* Answer Choices */}
      <div className="space-y-3" role="radiogroup" aria-label="Question choices">
        {choices.map((choice, index) => {
          const isSelected = selectedAnswer === index;
          const letter = letters[index] || String(index + 1);

          return (
            <div
              key={index}
              onClick={() => onSelectAnswer(index)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectAnswer(index);
                }
              }}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'border-[#1C4CA1] bg-[#1C4CA1]/5 shadow-xs ring-2 ring-[#1C4CA1]/20'
                  : 'border-[#D8DFEE] bg-white hover:border-[#1C4CA1]/40 hover:bg-[#F8FAFC]'
              }`}
            >
              {/* Option Letter Indicator */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-mono font-black transition-colors mt-0.5 ${
                  isSelected
                    ? 'bg-[#1C4CA1] text-white shadow-2xs'
                    : 'bg-[#EDF0F7] text-[#475569] border border-[#D8DFEE]'
                }`}
              >
                {letter}
              </div>

              {/* Choice Label */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm leading-relaxed block ${isSelected ? 'font-bold text-[#1F273A]' : 'text-[#334155]'}`}>
                  {choice}
                </span>
              </div>

              {/* Selection Check Indicator */}
              <div className="shrink-0 mt-0.5">
                {isSelected ? (
                  <CheckCircle2 className="h-5 w-5 text-[#1C4CA1]" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-300 bg-white" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
