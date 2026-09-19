import { describe, it, expect } from 'vitest';
import { semanticSearch, upsertChunk } from './pgvectorClient';

describe('pgvectorClient Dual-Mode Semantic Search', () => {
  it('returns relevant UFS boundary chunks for boundary queries', async () => {
    const results = await semanticSearch('UFS block boundary demarcation');
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].document_id).toContain('ufs');
    expect(results[0].chunk_text).toContain('boundary');
  });

  it('returns CAPI tablet operation chunks for offline sync queries', async () => {
    const results = await semanticSearch('CAPI tablet offline sync IndexedDB', 2);
    expect(results).toBeDefined();
    expect(results.length).toBeLessThanOrEqual(2);
    expect(results[0].chunk_text.toLowerCase()).toContain('capi');
  });

  it('filters results by documentId when requested', async () => {
    const results = await semanticSearch(
      'recall period',
      3,
      'doc-hces-consumption-manual-2024'
    );
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].document_id).toBe('doc-hces-consumption-manual-2024');
    expect(results[0].chunk_text).toContain('HCES');
  });

  it('upserts a chunk gracefully via local fallback when remote is unreachable', async () => {
    const newChunk = {
      document_id: 'doc-test-manual',
      page_number: 1,
      section_title: 'Test Section',
      chunk_text: 'Test chunk text for validation.',
      provenance: 'OFFICIAL_MOSPI_MANUAL',
    };
    const dummyEmbedding = new Array(384).fill(0.01);
    await expect(upsertChunk(newChunk, dummyEmbedding)).resolves.not.toThrow();
  });
});
