import { describe, it, expect, vi } from 'vitest';
import { POST as assessmentSyncPOST } from '@/app/api/assessment/sync/route';
import { DELETE as documentsDELETE } from '@/app/api/documents/route';
import { DocumentService } from '@/services/documentService';
import type { AppUser } from '@/lib/auth';

vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth')>();
  return {
    ...actual,
    getAuthenticatedUser: vi.fn(),
  };
});

vi.mock('@/services/documentService', () => ({
  DocumentService: {
    getDocuments: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

import { getAuthenticatedUser } from '@/lib/auth';

describe('Security: IDOR & Server-Authoritative Identity', () => {
  it('prevents IDOR in /api/assessment/sync by ignoring client user_id and binding to session', async () => {
    const authenticatedLearner: AppUser = {
      id: 'usr-legitimate-submitter',
      email: 'submitter@mospi.gov.in',
      user_metadata: { name: 'Legit Submitter' },
      app_metadata: { role: 'learner' },
    };
    vi.mocked(getAuthenticatedUser).mockResolvedValue(authenticatedLearner);

    // Attacker sends forged victim user_id in JSON payload
    const payload = {
      local_id: 'loc-idor-test-01',
      competency_id: 'comp-capi',
      user_id: 'usr-victim-target', // FORGED USER ID
      final_level: 'L2',
      answers: { q1: '1', q2: '0' },
      branch_path: 'L2_L3',
    };

    const req = new Request('http://localhost:3000/api/assessment/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res = await assessmentSyncPOST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    // Server must attribute sync strictly to authenticated user, overriding forged ID
    expect(data.user_id).toBe('usr-legitimate-submitter');
    expect(data.user_id).not.toBe('usr-victim-target');
  });

  it('prevents IDOR in DELETE /api/documents by blocking non-admin trainers from deleting others documents', async () => {
    const trainerUser: AppUser = {
      id: 'usr-trainer-alice',
      email: 'alice@mospi.gov.in',
      app_metadata: { role: 'trainer' },
    };
    vi.mocked(getAuthenticatedUser).mockResolvedValue(trainerUser);

    // Document belongs to trainer Bob
    vi.mocked(DocumentService.getDocuments).mockResolvedValue([
      {
        id: 'doc-bob-secret',
        title: 'Bob Schedule Manual',
        filename: 'bob_schedule.pdf',
        sizeBytes: 1024,
        uploadedAt: new Date().toISOString(),
        chunkCount: 1,
        targetCompetencies: ['comp-capi'],
        status: 'INDEXED',
        userId: 'usr-trainer-bob', // Owned by Bob!
      },
    ]);

    const req = new Request('http://localhost:3000/api/documents?id=doc-bob-secret', {
      method: 'DELETE',
    });

    const res = await documentsDELETE(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain('permission');
    expect(DocumentService.deleteDocument).not.toHaveBeenCalled();
  });

  it('allows admins to delete any document regardless of ownership', async () => {
    const adminUser: AppUser = {
      id: 'usr-admin-director',
      email: 'director@mospi.gov.in',
      app_metadata: { role: 'admin' },
    };
    vi.mocked(getAuthenticatedUser).mockResolvedValue(adminUser);
    vi.mocked(DocumentService.deleteDocument).mockResolvedValue(true);

    const req = new Request('http://localhost:3000/api/documents?id=doc-bob-secret', {
      method: 'DELETE',
    });

    const res = await documentsDELETE(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(DocumentService.deleteDocument).toHaveBeenCalledWith('doc-bob-secret');
  });
});
