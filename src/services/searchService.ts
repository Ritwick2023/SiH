/**
 * src/services/searchService.ts
 *
 * Bilingual question deduplication and fuzzy search service.
 * Connects to Elasticsearch 8.x or falls back to local n-gram/Jaccard similarity.
 * Prevents question bank bloat by detecting duplicate items (> 82% similarity).
 */

import { executeWithFallback, getServiceUrl } from '@/lib/serviceUtils';
import { ADAPTIVE_QUESTIONS } from '@/data/adaptiveQuestionBank';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarQuestions: string[];
  maxSimilarity: number;
}

// In-memory question registry for local duplicate tracking
const LOCAL_QUESTION_REGISTRY: Array<{ id: string; stem: string; competencyId: string }> =
  Object.values(ADAPTIVE_QUESTIONS).flatMap((stageMap) =>
    Object.values(stageMap).map((q) => ({
      id: q.id,
      stem: q.question_text,
      competencyId: q.competencyId,
    }))
  );

/**
 * Computes character-level bi-gram Jaccard similarity between two strings
 * Handles both English and Devanagari Unicode scripts accurately.
 */
export function computeStringSimilarity(strA: string, strB: string): number {
  const normA = strA.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const normB = strB.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  // Generate character bi-grams
  const getBigrams = (s: string): Set<string> => {
    const bigrams = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) {
      bigrams.add(s.slice(i, i + 2));
    }
    return bigrams;
  };

  const setA = getBigrams(normA);
  const setB = getBigrams(normB);

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function localCheckDuplicate(questionStem: string): {
  isDuplicate: boolean;
  similarQuestions: string[];
  maxSimilarity: number;
} {
  const matches: Array<{ stem: string; sim: number }> = [];

  for (const item of LOCAL_QUESTION_REGISTRY) {
    const sim = computeStringSimilarity(questionStem, item.stem);
    if (sim >= 0.70) {
      matches.push({ stem: item.stem, sim });
    }
  }

  matches.sort((a, b) => b.sim - a.sim);
  const topMatches = matches.slice(0, 3);
  const highestSim = topMatches[0]?.sim || 0;

  return {
    isDuplicate: highestSim >= 0.82,
    similarQuestions: topMatches.map((m) => m.stem),
    maxSimilarity: Number(highestSim.toFixed(3)),
  };
}

/**
 * Checks whether a proposed question stem is duplicate or highly similar to an existing question.
 * Employs Elasticsearch bilingual fuzzy search with local Jaccard fallback.
 */
export async function checkDuplicate(
  questionStem: string,
  lang: 'en' | 'hi' = 'en'
): Promise<{
  isDuplicate: boolean;
  similarQuestions: string[];
  maxSimilarity: number;
}> {
  const index = lang === 'hi' ? 'statvidya_questions_hi' : 'statvidya_questions_en';
  const esUrl = getServiceUrl('ELASTICSEARCH_URL', 'http://localhost:9200');

  return executeWithFallback(
    async () => {
      const res = await fetch(`${esUrl}/${index}/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: {
            match: {
              stem: {
                query: questionStem,
                fuzziness: 'AUTO',
              },
            },
          },
          size: 3,
        }),
      });

      if (!res.ok) throw new Error(`Elasticsearch returned status ${res.status}`);
      const data = await res.json();
      const hits = data.hits?.hits || [];

      const maxScore = hits.length > 0 ? (hits[0]._score || 0) : 0;
      if (maxScore > 12.0) {
        const similarQuestions = hits.map((h: { _source?: { stem?: string } }) => h._source?.stem || '').filter(Boolean);
        return {
          isDuplicate: true,
          similarQuestions,
          maxSimilarity: 0.95,
        };
      }

      // Check local seed questions registry
      return localCheckDuplicate(questionStem);
    },
    () => localCheckDuplicate(questionStem),
    'searchService.checkDuplicate',
    1500
  );
}

/**
 * Indexes a verified question item into the search index.
 */
export async function indexQuestion(
  questionId: string,
  stem: string,
  competencyId: string
): Promise<void> {
  const esUrl = getServiceUrl('ELASTICSEARCH_URL', 'http://localhost:9200');

  return executeWithFallback(
    async () => {
      const res = await fetch(`${esUrl}/statvidya_questions_en/_doc/${questionId}?refresh=true`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stem,
          competency_id: competencyId,
          indexed_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error(`ES index returned status ${res.status}`);
      LOCAL_QUESTION_REGISTRY.push({ id: questionId, stem, competencyId });
    },
    () => {
      // Local fallback registry
      LOCAL_QUESTION_REGISTRY.push({
        id: questionId,
        stem,
        competencyId,
      });
    },
    'searchService.indexQuestion',
    1500
  );
}

/**
 * Searches questions in question bank by keyword or fuzzy matching.
 */
export async function searchQuestions(
  query: string,
  competencyId?: string
): Promise<string[]> {
  const esUrl = getServiceUrl('ELASTICSEARCH_URL', 'http://localhost:9200');

  return executeWithFallback(
    async () => {
      const queryBody: Record<string, unknown> = {
        bool: {
          must: [{ match: { stem: query } }],
          filter: competencyId ? [{ term: { competency_id: competencyId } }] : [],
        },
      };

      const res = await fetch(`${esUrl}/statvidya_questions_en/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryBody, size: 5 }),
      });

      if (!res.ok) throw new Error(`ES search returned status ${res.status}`);
      const data = await res.json();
      return (data.hits?.hits || []).map((h: { _source?: { stem?: string } }) => h._source?.stem || '');
    },
    () => {
      // Local search fallback
      const queryLower = query.toLowerCase();
      return LOCAL_QUESTION_REGISTRY
        .filter((item) => {
          if (competencyId && item.competencyId !== competencyId) return false;
          return item.stem.toLowerCase().includes(queryLower);
        })
        .slice(0, 5)
        .map((item) => item.stem);
    },
    'searchService.searchQuestions',
    1500
  );
}
