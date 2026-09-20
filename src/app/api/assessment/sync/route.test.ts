import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/assessment/sync', () => {
  it('successfully synchronizes an offline assessment payload', async () => {
    const payload = {
      local_id: 'loc-uuid-12345',
      competency_id: 'comp-capi',
      user_id: 'demo-sunita',
      final_level: 'L4',
      answers: { 'q1': '0', 'q2': '1' },
      branch_path: 'L4',
      created_at: new Date().toISOString(),
    };

    const req = new Request('http://localhost:3000/api/assessment/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.assessment_id).toMatch(/^srv-sync-/);
    expect(data.submitted_at).toBeDefined();
    expect(data.local_id).toBe('loc-uuid-12345');
    expect(data.competency_id).toBe('comp-capi');
    expect(data.final_level).toBe('L4');
    expect(data.answers_recorded).toBe(2);
    expect(data.verifiable_credential).toBeDefined();
    expect(data.verifiable_credential.issued).toBe(true);
    expect(data.verifiable_credential.credential_hash).toBeDefined();
  });

  it('returns 400 Bad Request if local_id is missing', async () => {
    const req = new Request('http://localhost:3000/api/assessment/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competency_id: 'comp-capi' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('local_id');
  });
});
