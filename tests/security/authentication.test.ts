import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSessionToken, verifySessionToken, getAuthenticatedUser } from '@/lib/auth';
import { NextRequest } from 'next/server';

describe('Security: Authentication Hardening', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('HMAC-SHA256 Session Tokens', () => {
    it('creates and successfully verifies valid session token', async () => {
      const token = await createSessionToken({
        id: 'usr-123',
        email: 'sunita@mospi.gov.in',
        user_metadata: { name: 'Sunita Devi' },
        app_metadata: { role: 'learner' },
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(2);

      const verified = await verifySessionToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.id).toBe('usr-123');
      expect(verified?.email).toBe('sunita@mospi.gov.in');
      expect(verified?.app_metadata?.role).toBe('learner');
    });

    it('rejects tampered token signature', async () => {
      const token = await createSessionToken({
        id: 'usr-123',
        email: 'sunita@mospi.gov.in',
        user_metadata: { name: 'Sunita Devi' },
        app_metadata: { role: 'learner' },
      });

      const [data, sig] = token.split('.');
      const tamperedToken = `${data}.${sig.slice(0, -4)}FAIL`;

      const verified = await verifySessionToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it('rejects tampered token payload data', async () => {
      const token = await createSessionToken({
        id: 'usr-123',
        email: 'sunita@mospi.gov.in',
        user_metadata: { name: 'Sunita Devi' },
        app_metadata: { role: 'learner' },
      });

      const [, sig] = token.split('.');
      // Tamper data to escalate role to admin
      const tamperedPayload = Buffer.from(
        JSON.stringify({ sub: 'usr-123', email: 'sunita@mospi.gov.in', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 })
      ).toString('base64url');
      const tamperedToken = `${tamperedPayload}.${sig}`;

      const verified = await verifySessionToken(tamperedToken);
      expect(verified).toBeNull();
    });
  });

  describe('Production vs Demo Mode Isolation', () => {
    it('completely ignores demo_user and demo_persona cookies when DEMO_MODE=false', async () => {
      process.env.DEMO_MODE = 'false';

      const req = new NextRequest('http://localhost:3000/api/dashboard', {
        headers: {
          cookie: 'demo_user=demo-sunita; demo_persona=demo-rajesh',
        },
      });

      const user = await getAuthenticatedUser(req);
      expect(user).toBeNull();
    });

    it('derives identity strictly from server allowlist in DEMO_MODE=true, ignoring arbitrary role JSON', async () => {
      process.env.DEMO_MODE = 'true';

      // Attacker crafts arbitrary role injection in demo_user cookie
      const maliciousCookie = encodeURIComponent(
        JSON.stringify({ id: 'demo-sunita', role: 'admin' })
      );

      const req = new NextRequest('http://localhost:3000/api/dashboard', {
        headers: {
          cookie: `demo_user=${maliciousCookie}`,
        },
      });

      const user = await getAuthenticatedUser(req);
      expect(user).not.toBeNull();
      expect(user?.id).toBe('demo-sunita');
      // Role must remain 'learner' from server DEMO_PERSONAS allowlist, not 'admin'
      expect(user?.app_metadata?.role).toBe('learner');
    });

    it('returns null for nonexistent persona IDs in DEMO_MODE=true', async () => {
      process.env.DEMO_MODE = 'true';

      const req = new NextRequest('http://localhost:3000/api/dashboard', {
        headers: {
          cookie: 'demo_user=hacker_arbitrary_user_id',
        },
      });

      const user = await getAuthenticatedUser(req);
      expect(user).toBeNull();
    });
  });
});
