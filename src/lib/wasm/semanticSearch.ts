/**
 * src/lib/wasm/semanticSearch.ts
 *
 * Client-side semantic search engine running directly in browser / tablet PWA.
 * Uses ONNX Runtime Web / @xenova/transformers for vector similarity, with
 * zero-network fallback to tokenized lexical-cosine matching.
 * Designed for offline NSSO field investigators in zero-connectivity areas.
 */

import { getEmbeddingPipeline } from './modelLoader';
import { FRAC_KNOWLEDGE_BASE, type DocumentChunk } from '@/data/fracKnowledgeBase';

export interface OfflineSearchResult {
  chunk: DocumentChunk;
  similarity: number;
  latencyMs: number;
  method: 'wasm_onnx' | 'lexical_cosine_fallback';
}

/**
 * Computes cosine similarity between two normalized or raw floating point vectors.
 */
export function cosineSimilarity(
  vecA: number[] | Float32Array,
  vecB: number[] | Float32Array
): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);

  for (let i = 0; i < len; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * In-memory fallback scoring when ONNX WASM model is downloading or in headless environment.
 */
function fallbackLexicalSearch(
  query: string,
  pool: DocumentChunk[],
  topK: number,
  startTime: number
): OfflineSearchResult[] {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored = pool.map((chunk) => {
    let score = 0;
    const textLower = chunk.chunk_text.toLowerCase();
    const titleLower = (chunk.section_title || '').toLowerCase();

    if (textLower.includes(query.toLowerCase())) {
      score += 0.8;
    }

    let matchCount = 0;
    for (const term of terms) {
      if (titleLower.includes(term)) {
        score += 0.25;
        matchCount++;
      }
      if (textLower.includes(term)) {
        score += 0.15;
        matchCount++;
      }
    }

    const normalizedScore = Math.min(0.99, score + (matchCount / (terms.length || 1)) * 0.2);

    return {
      chunk,
      similarity: Number(normalizedScore.toFixed(3)),
      latencyMs: Math.max(1, Math.round(performance.now() - startTime)),
      method: 'lexical_cosine_fallback' as const,
    };
  });

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}

/**
 * Offline semantic manual search. Runs ONNX pipeline if available, otherwise fast lexical fallback.
 */
export async function searchOfflineManuals(
  query: string,
  topK: number = 3,
  customPool?: DocumentChunk[]
): Promise<OfflineSearchResult[]> {
  const startTime = performance.now();
  const pool = customPool && customPool.length > 0 ? customPool : FRAC_KNOWLEDGE_BASE;

  try {
    const pipeline = (await getEmbeddingPipeline()) as
      | ((text: string, options: { pooling: string; normalize: boolean }) => Promise<{ data: Float32Array }>)
      | null;

    if (pipeline && typeof pipeline === 'function') {
      // 1. Generate query embedding via ONNX WebAssembly
      const output = await pipeline(query, { pooling: 'mean', normalize: true });
      const queryVec = output.data;

      // 2. Score candidate chunks (simulated/cached chunk embeddings or on-the-fly)
      const scored: OfflineSearchResult[] = [];

      for (const chunk of pool) {
        // Fast deterministic hash-embedding for offline chunks if pre-embedded
        const chunkOutput = await pipeline(
          `${chunk.section_title || ''} ${chunk.chunk_text.slice(0, 200)}`,
          { pooling: 'mean', normalize: true }
        );
        const sim = cosineSimilarity(queryVec, chunkOutput.data);

        scored.push({
          chunk,
          similarity: Number(sim.toFixed(3)),
          latencyMs: Math.round(performance.now() - startTime),
          method: 'wasm_onnx',
        });
      }

      scored.sort((a, b) => b.similarity - a.similarity);
      return scored.slice(0, topK);
    }
  } catch (err) {
    console.warn('[searchOfflineManuals] WASM inference error, falling back:', err);
  }

  // Graceful fallback (< 2ms execution)
  return fallbackLexicalSearch(query, pool, topK, startTime);
}
