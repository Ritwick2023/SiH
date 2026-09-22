import { describe, it, expect, vi } from 'vitest';
import { POST as documentUploadPOST } from '@/app/api/documents/upload/route';
import type { AppUser } from '@/lib/auth';

vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth')>();
  return {
    ...actual,
    getAuthenticatedUser: vi.fn(),
  };
});

import { getAuthenticatedUser } from '@/lib/auth';

describe('Security: Document Upload & Content Validation', () => {
  const trainerUser: AppUser = {
    id: 'trainer-01',
    email: 'trainer@mospi.gov.in',
    app_metadata: { role: 'trainer' },
  };

  function createUploadRequest(formData: FormData): Request {
    const req = new Request('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryTest' },
    });
    (req as unknown as { formData: () => Promise<FormData> }).formData = async () => formData;
    return req;
  }

  it('rejects unauthenticated upload requests with 401', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

    const formData = new FormData();
    formData.append('file', new File(['%PDF-1.4 test'], 'survey.pdf', { type: 'application/pdf' }));

    const req = createUploadRequest(formData);

    const res = await documentUploadPOST(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthorized role (learner) with 403', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue({
      id: 'learner-01',
      email: 'learner@mospi.gov.in',
      app_metadata: { role: 'learner' },
    });

    const formData = new FormData();
    formData.append('file', new File(['%PDF-1.4 test'], 'survey.pdf', { type: 'application/pdf' }));

    const req = createUploadRequest(formData);

    const res = await documentUploadPOST(req);
    expect(res.status).toBe(403);
  });

  it('rejects disallowed file extensions (e.g. .exe, .sh, .bat)', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue(trainerUser);

    const formData = new FormData();
    formData.append('file', new File(['binary content'], 'payload.exe', { type: 'application/octet-stream' }));

    const req = createUploadRequest(formData);

    const res = await documentUploadPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Unsupported file extension');
  });

  it('rejects spoofed PDF files that lack "%PDF-" magic bytes', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue(trainerUser);

    // File has .pdf extension and application/pdf MIME, but malicious shell script content
    const fakePdfContent = '#!/bin/bash\necho "Malicious Script Execution"';
    const formData = new FormData();
    formData.append(
      'file',
      new File([fakePdfContent], 'fake_manual.pdf', { type: 'application/pdf' })
    );

    const req = createUploadRequest(formData);

    const res = await documentUploadPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('magic header');
  });

  it('rejects oversized files exceeding 25MB limit', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue(trainerUser);

    // Mock File object with size > 25MB
    const oversizedFile = new File(['mock content'], 'large_manual.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(oversizedFile, 'size', { value: 26 * 1024 * 1024 });

    const formData = new FormData();
    formData.append('file', oversizedFile);

    const req = createUploadRequest(formData);

    const res = await documentUploadPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('File size exceeds maximum permitted limit');
  });
});
