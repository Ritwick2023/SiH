import { describe, it, expect, vi } from 'vitest';
import { requireRole, requireAnyRole, requireOwnership, AuthError } from '@/lib/auth';
import type { AppUser } from '@/lib/auth';
import { POST as flagDepartmentPOST } from '@/app/api/admin/flag-department/route';
import { DELETE as documentsDELETE } from '@/app/api/documents/route';
import { POST as documentsUploadPOST } from '@/app/api/documents/upload/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth')>();
  return {
    ...actual,
    getAuthenticatedUser: vi.fn(),
  };
});

import { getAuthenticatedUser } from '@/lib/auth';

describe('Security: Authorization & RBAC', () => {
  const learnerUser: AppUser = {
    id: 'usr-learner-1',
    email: 'learner@mospi.gov.in',
    app_metadata: { role: 'learner' },
  };

  const trainerUser: AppUser = {
    id: 'usr-trainer-1',
    email: 'trainer@mospi.gov.in',
    app_metadata: { role: 'trainer' },
  };

  const adminUser: AppUser = {
    id: 'usr-admin-1',
    email: 'admin@mospi.gov.in',
    app_metadata: { role: 'admin' },
  };

  describe('In-Memory Assertion Utilities', () => {
    it('requireRole throws AuthError 403 on role mismatch', () => {
      expect(() => requireRole(learnerUser, 'admin')).toThrow(AuthError);
      try {
        requireRole(learnerUser, 'admin');
      } catch (e: unknown) {
        expect((e as AuthError).status).toBe(403);
      }
    });

    it('requireAnyRole accepts matching role and rejects non-matching', () => {
      expect(() => requireAnyRole(trainerUser, ['admin', 'trainer'])).not.toThrow();
      expect(() => requireAnyRole(learnerUser, ['admin', 'trainer'])).toThrow(AuthError);
    });

    it('requireOwnership allows resource owner and admin, rejects different user', () => {
      expect(() => requireOwnership(learnerUser, 'usr-learner-1')).not.toThrow();
      expect(() => requireOwnership(adminUser, 'usr-learner-1')).not.toThrow(); // Admin override
      expect(() => requireOwnership(learnerUser, 'usr-other-user')).toThrow(AuthError);
    });
  });

  describe('Endpoint Level RBAC Enforcement', () => {
    it('POST /api/admin/flag-department rejects learner with 403', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(learnerUser);

      const req = new NextRequest('http://localhost:3000/api/admin/flag-department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: 'FOD HQ' }),
      });

      const res = await flagDepartmentPOST(req);
      expect(res.status).toBe(403);
    });

    it('POST /api/admin/flag-department rejects trainer with 403', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(trainerUser);

      const req = new NextRequest('http://localhost:3000/api/admin/flag-department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: 'FOD HQ' }),
      });

      const res = await flagDepartmentPOST(req);
      expect(res.status).toBe(403);
    });

    it('DELETE /api/documents rejects learner with 403', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(learnerUser);

      const req = new Request('http://localhost:3000/api/documents?id=doc-123', {
        method: 'DELETE',
      });

      const res = await documentsDELETE(req);
      expect(res.status).toBe(403);
    });

    it('POST /api/documents/upload rejects learner with 403', async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(learnerUser);

      const formData = new FormData();
      formData.append('file', new File(['%PDF-1.4 test'], 'manual.pdf', { type: 'application/pdf' }));

      const req = new Request('http://localhost:3000/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const res = await documentsUploadPOST(req);
      expect(res.status).toBe(403);
    });
  });
});
