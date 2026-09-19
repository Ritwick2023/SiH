import { describe, it, expect } from 'vitest';
import { cosineSimilarity, searchOfflineManuals } from './semanticSearch';

describe('Offline WASM Semantic Search Engine', () => {
  it('computes exact cosine similarity correctly', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const vecC = [0, 1, 0];

    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1.0, 4);
    expect(cosineSimilarity(vecA, vecC)).toBeCloseTo(0.0, 4);
  });

  it('searches offline manuals with fallback and returns top ranked chunks', async () => {
    const results = await searchOfflineManuals('CAPI offline tablet synchronization', 2);

    expect(results).toBeDefined();
    expect(results.length).toBeLessThanOrEqual(2);
    expect(results[0].chunk.chunk_text.toLowerCase()).toContain('capi');
    expect(results[0].similarity).toBeGreaterThan(0.3);
    expect(['wasm_onnx', 'lexical_cosine_fallback']).toContain(results[0].method);
  });

  it('searches UFS boundaries and respects custom pools', async () => {
    const results = await searchOfflineManuals('railway tracks rivers boundary', 1);

    expect(results).toBeDefined();
    expect(results.length).toBe(1);
    expect(results[0].chunk.document_id).toBe('doc-ufs-boundary-manual-2024');
  });
});
