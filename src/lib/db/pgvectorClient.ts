/**
 * src/lib/db/pgvectorClient.ts
 *
 * Client for PostgreSQL 17 + pgvector semantic retrieval and RAG knowledge base.
 * Employs dual-mode resilient execution:
 * Calls the microservice / PostgreSQL embedding search; falls back to in-memory
 * FRAC_KNOWLEDGE_BASE within 1,500ms via executeWithFallback.
 */

import { executeWithFallback, getServiceUrl } from '../serviceUtils';
import { FRAC_KNOWLEDGE_BASE, type DocumentChunk } from '@/data/fracKnowledgeBase';

export type { DocumentChunk };

/**
 * In-memory keyword & lexical relevance search across the FRAC knowledge base.
 */
function localSemanticSearch(
  query: string,
  topK: number = 3,
  documentId?: string
): DocumentChunk[] {
  let pool = FRAC_KNOWLEDGE_BASE;
  if (documentId) {
    pool = pool.filter((c) => c.document_id === documentId);
    if (pool.length === 0) pool = FRAC_KNOWLEDGE_BASE;
  }

  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (terms.length === 0) {
    return pool.slice(0, topK);
  }

  const scored = pool.map((chunk) => {
    let score = 0;
    const textLower = chunk.chunk_text.toLowerCase();
    const titleLower = (chunk.section_title || '').toLowerCase();
    const docLower = chunk.document_id.toLowerCase();

    // Exact phrase match bonus
    if (textLower.includes(query.toLowerCase())) {
      score += 10;
    }

    for (const term of terms) {
      if (titleLower.includes(term)) score += 5;
      if (textLower.includes(term)) score += 2;
      if (docLower.includes(term)) score += 1;
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((item) => item.chunk);
}

/**
 * Performs semantic vector search against PostgreSQL pgvector or analytics microservice.
 * Falls back gracefully to local FRAC knowledge base on timeout or network unavailability.
 */
export async function semanticSearch(
  query: string,
  topK: number = 3,
  documentId?: string
): Promise<DocumentChunk[]> {
  const serviceUrl = getServiceUrl('NEXT_PUBLIC_ANALYTICS_SERVICE_URL', 'http://localhost:8000');

  return executeWithFallback(
    async () => {
      const res = await fetch(`${serviceUrl}/api/v1/documents/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          top_k: topK,
          document_id: documentId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Vector search endpoint returned status ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data.chunks) && data.chunks.length > 0) {
        return data.chunks as DocumentChunk[];
      }
      return localSemanticSearch(query, topK, documentId);
    },
    () => localSemanticSearch(query, topK, documentId),
    'pgvectorClient.semanticSearch',
    1500
  );
}

/**
 * Upserts a document chunk and its 384-dimensional embedding vector into the database.
 */
export async function upsertChunk(
  chunk: Omit<DocumentChunk, 'id'>,
  embedding: number[]
): Promise<void> {
  const serviceUrl = getServiceUrl('NEXT_PUBLIC_ANALYTICS_SERVICE_URL', 'http://localhost:8000');

  return executeWithFallback(
    async () => {
      const res = await fetch(`${serviceUrl}/api/v1/documents/chunks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: chunk.document_id,
          page_number: chunk.page_number,
          section_title: chunk.section_title,
          chunk_text: chunk.chunk_text,
          provenance: chunk.provenance,
          embedding,
        }),
      });

      if (!res.ok) {
        throw new Error(`Vector upsert endpoint returned status ${res.status}`);
      }
    },
    () => {
      // Local fallback: add to in-memory knowledge base if not already present
      const existing = FRAC_KNOWLEDGE_BASE.find(
        (c) => c.document_id === chunk.document_id && c.page_number === chunk.page_number
      );
      if (!existing) {
        FRAC_KNOWLEDGE_BASE.push({
          id: `chunk-mem-${Date.now()}`,
          ...chunk,
        });
      }
    },
    'pgvectorClient.upsertChunk',
    1500
  );
}
