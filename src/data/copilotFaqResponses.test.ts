import { describe, it, expect } from 'vitest';
import { matchPreMadeFaq, COPILOT_PREMADE_FAQS } from './copilotFaqResponses';

describe('copilotFaqResponses', () => {
  it('has core and navigation pre-made FAQs', () => {
    expect(COPILOT_PREMADE_FAQS.length).toBeGreaterThanOrEqual(11);
  });

  it('matches all exact quick action prompts', () => {
    const prompts = [
      'What is my readiness index and how can I improve it?',
      'Show me my top competency gaps and what to do about them',
      'How do I start an assessment?',
      'Recommend iGOT courses for my skill gaps',
      'Explain the FRAC competency levels L1 to L5',
      'Give me a quick overview of all platform features',
    ];

    for (const prompt of prompts) {
      const result = matchPreMadeFaq(prompt);
      expect(result).toBeTruthy();
      expect(result).toContain('###');
    }
  });

  it('matches case-insensitively and regex patterns', () => {
    expect(matchPreMadeFaq('what is my readiness?')).toContain('Readiness Index');
    expect(matchPreMadeFaq('explain the frac levels')).toContain('Mission Karmayogi');
    expect(matchPreMadeFaq('start assessment')).toContain('Starting an Adaptive Assessment');
    expect(matchPreMadeFaq('recommend courses')).toContain('Recommended iGOT Karmayogi Courses');
  });

  it('matches navigation queries instantly', () => {
    expect(matchPreMadeFaq('where can I find manuals?')).toContain('/documents');
    expect(matchPreMadeFaq('how does mcq generator work?')).toContain('/mcq-generator');
    expect(matchPreMadeFaq('what tests are available?')).toContain('/assignments');
    expect(matchPreMadeFaq('how does offline mode work?')).toContain('IndexedDB');
    expect(matchPreMadeFaq('where is my profile?')).toContain('/profile');
  });

  it('customizes greeting with user context', () => {
    const response = matchPreMadeFaq('What is my readiness index and how can I improve it?', {
      name: 'Priya Verma',
      designation: 'Senior Statistical Officer',
    });
    expect(response).toContain('Priya Verma');
    expect(response).toContain('Senior Statistical Officer');
  });

  it('returns a pre-made match for every question in FAQ_CATEGORIES', async () => {
    const { FAQ_CATEGORIES } = await import('./copilotFaqCategories');
    let totalQuestions = 0;
    const unmatched: string[] = [];

    for (const category of FAQ_CATEGORIES) {
      for (const q of category.questions) {
        totalQuestions++;
        const answer = matchPreMadeFaq(q.prompt);
        if (!answer) {
          unmatched.push(`[${category.title}] "${q.prompt}"`);
        }
      }
    }

    expect(unmatched).toEqual([]);
    expect(totalQuestions).toBe(54);
  });
});

