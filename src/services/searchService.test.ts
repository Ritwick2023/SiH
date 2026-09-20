import { describe, it, expect } from 'vitest';
import {
  computeStringSimilarity,
  checkDuplicate,
  indexQuestion,
  searchQuestions,
} from './searchService';

describe('SearchService - Question Deduplication', () => {
  it('computes character-level n-gram similarity correctly', () => {
    const s1 = 'What is the minimum battery percentage required for CAPI tablet?';
    const s2 = 'What is the minimum battery percentage required for CAPI tablet?';
    const s3 = 'What is the sampling weight multiplier for Schedule 0.0?';

    expect(computeStringSimilarity(s1, s2)).toBe(1.0);
    expect(computeStringSimilarity(s1, s3)).toBeLessThan(0.4);
  });

  it('detects duplicate question stems with >82% similarity', async () => {
    const duplicateStem =
      'When collecting household data in CAPI, what is the mandatory protocol before marking a household as temporarily absent?';
    const result = await checkDuplicate(duplicateStem, 'en');

    expect(result.isDuplicate).toBe(true);
    expect(result.maxSimilarity).toBeGreaterThanOrEqual(0.82);
    expect(result.similarQuestions.length).toBeGreaterThan(0);
  });

  it('permits novel non-duplicate questions', async () => {
    const novelStem = 'Explain the difference between stratified multi-stage cluster sampling in 2026 vs 1990.';
    const result = await checkDuplicate(novelStem, 'en');

    expect(result.isDuplicate).toBe(false);
    expect(result.maxSimilarity).toBeLessThan(0.82);
  });

  it('indexes and searches questions successfully', async () => {
    await indexQuestion('custom-q-1', 'How is household non-response handled in PLFS?', 'comp-survey');
    const matches = await searchQuestions('non-response', 'comp-survey');

    expect(matches).toBeDefined();
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0]).toContain('non-response');
  });
});
