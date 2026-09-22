import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST as otpPOST } from '@/app/api/auth/otp/route';
import { NextRequest } from 'next/server';

describe('Security: OTP Hardening & Brute Force Prevention', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('enforces rate limiting on OTP requests (429 after 5 requests)', async () => {
    const identifier = 'ratelimit.target@mospi.gov.in';

    for (let i = 0; i < 5; i++) {
      const req = new NextRequest('http://localhost:3000/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', identifier }),
      });
      const res = await otpPOST(req);
      expect(res.status).toBe(200);
    }

    // 6th request must be rate-limited
    const blockedReq = new NextRequest('http://localhost:3000/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request', identifier }),
    });
    const blockedRes = await otpPOST(blockedReq);
    expect(blockedRes.status).toBe(429);
    const body = await blockedRes.json();
    expect(body.error).toContain('Too many OTP requests');
  });

  it('in production (DEMO_MODE=false), does NOT return demoOtp in request response', async () => {
    process.env.DEMO_MODE = 'false';

    const req = new NextRequest('http://localhost:3000/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request', identifier: 'prod.officer@nic.in' }),
    });

    const res = await otpPOST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.demoOtp).toBeUndefined();
  });

  it('in production (DEMO_MODE=false), rejects hardcoded "123456" OTP', async () => {
    process.env.DEMO_MODE = 'false';

    const req = new NextRequest('http://localhost:3000/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        identifier: 'prod.officer2@nic.in',
        otp: '123456',
      }),
    });

    const res = await otpPOST(req);
    expect(res.status).toBe(401);
  });

  it('prevents role escalation: new user registrations via OTP always receive role "learner"', async () => {
    process.env.DEMO_MODE = 'true';

    // Attacker tries to pass role: 'admin' during verification
    const req = new NextRequest('http://localhost:3000/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        identifier: 'new.investigator@mospi.gov.in',
        otp: '123456',
        role: 'admin', // FORGED ROLE
      }),
    });

    const res = await otpPOST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    // User must be created as learner regardless of client payload
    expect(body.user.app_metadata.role).toBe('learner');
  });
});
