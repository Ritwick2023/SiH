import { describe, it, expect, vi } from 'vitest';
import { POST as mcqGeneratePOST } from '@/app/api/mcq/generate/route';
import { POST as copilotPOST } from '@/app/api/copilot/route';
import { NextRequest } from 'next/server';
import type { AppUser } from '@/lib/auth';

vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth')>();
  return {
    ...actual,
    getAuthenticatedUser: vi.fn(),
  };
});

vi.mock('@/services/mcqService', () => ({
  MCQService: {
    generateBatchMCQ: vi.fn().mockResolvedValue([
      { id: 'q1', text: 'Sample Question', options: ['A', 'B'], correctAnswer: 0 },
    ]),
    generateDynamicQuestions: vi.fn().mockResolvedValue([
      { id: 'q1', text: 'Sample Question', options: ['A', 'B'], correctAnswer: 0 },
    ]),
  },
}));

import { getAuthenticatedUser } from '@/lib/auth';

describe('Security: Expensive AI / Generation API Rate Limiting', () => {
  const testUser: AppUser = {
    id: 'user-rate-test-1',
    email: 'test@mospi.gov.in',
    app_metadata: { role: 'learner' },
  };

  describe('POST /api/mcq/generate', () => {
    it('requires authentication (returns 401 if unauthenticated)', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

      const req = new Request('http://localhost:3000/api/mcq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5, competencyId: 'comp-capi' }),
      });

      const res = await mcqGeneratePOST(req);
      expect(res.status).toBe(401);
    });

    it('enforces rate limit of 20 requests per minute', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(testUser);

      // Issue 20 allowed requests
      for (let i = 0; i < 20; i++) {
        const req = new Request('http://localhost:3000/api/mcq/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count: 1, competencyId: 'comp-capi' }),
        });
        const res = await mcqGeneratePOST(req);
        expect(res.status).toBe(200);
      }

      // 21st request must be rate limited with 429
      const blockedReq = new Request('http://localhost:3000/api/mcq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 1, competencyId: 'comp-capi' }),
      });
      const blockedRes = await mcqGeneratePOST(blockedReq);
      expect(blockedRes.status).toBe(429);
      const data = await blockedRes.json();
      expect(data.error).toContain('Too many MCQ generation requests');
    });
  });

  describe('POST /api/copilot', () => {
    it('requires authentication (returns 401 if unauthenticated)', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'What is Schedule 0.0?' }] }),
      });

      const res = await copilotPOST(req);
      expect(res.status).toBe(401);
    });

    it('enforces rate limit of 30 requests per minute', async () => {
      const copilotUser: AppUser = {
        id: 'user-copilot-rate-2',
        email: 'copilot.user@mospi.gov.in',
        app_metadata: { role: 'learner' },
      };
      vi.mocked(getAuthenticatedUser).mockResolvedValue(copilotUser);

      // Issue 30 requests
      for (let i = 0; i < 30; i++) {
        const req = new NextRequest('http://localhost:3000/api/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'Tell me about CAPI' }],
          }),
        });
        const res = await copilotPOST(req);
        // Either 200 (from FAQ matcher) or handled response
        expect(res.status).toBe(200);
      }

      // 31st request must return 429
      const blockedReq = new NextRequest('http://localhost:3000/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Tell me about CAPI' }],
        }),
      });
      const blockedRes = await copilotPOST(blockedReq);
      expect(blockedRes.status).toBe(429);
      const data = await blockedRes.json();
      expect(data.error).toContain('Too many Copilot requests');
    });
  });
});
