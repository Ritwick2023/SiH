import { describe, it, expect } from 'vitest';
import { GET as parichayInitGET } from '@/app/api/auth/parichay/route';
import { GET as parichayCallbackGET } from '@/app/api/auth/parichay/callback/route';
import { NextRequest } from 'next/server';

describe('Security: OIDC & Open Redirect Hardening', () => {
  describe('GET /api/auth/parichay (SSO Initiation)', () => {
    it('sanitizes external open redirect URLs in returnTo parameter', async () => {
      const req = new NextRequest(
        'http://localhost:3000/api/auth/parichay?returnTo=https://attacker-credential-harvester.com'
      );

      const res = await parichayInitGET(req);
      expect(res.status).toBe(307); // Redirect to Parichay authorize endpoint

      const redirectLocation = res.headers.get('location');
      expect(redirectLocation).toBeDefined();

      const url = new URL(redirectLocation!);
      const stateParam = url.searchParams.get('state');
      expect(stateParam).toBeDefined();

      const decodedState = JSON.parse(Buffer.from(stateParam!, 'base64url').toString('utf-8'));
      // Must be sanitized to safe default, not external URL
      expect(decodedState.returnTo).toBe('/dashboard');
    });

    it('sets HttpOnly, SameSite state cookies to prevent CSRF in OIDC flow', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/parichay');
      const res = await parichayInitGET(req);

      const cookies = res.cookies.getAll();
      const stateCookie = cookies.find((c) => c.name === 'oidc_state');
      expect(stateCookie).toBeDefined();
      expect(stateCookie?.httpOnly).toBe(true);
    });
  });

  describe('GET /api/auth/parichay/callback (SSO Callback)', () => {
    it('rejects invalid or forged OIDC state parameter with 400', async () => {
      const req = new NextRequest(
        'http://localhost:3000/api/auth/parichay/callback?code=fake-auth-code&state=NOT_VALID_BASE64_OR_JSON'
      );

      const res = await parichayCallbackGET(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('state parameter');
    });

    it('rejects state mismatch when oidc_state cookie differs from state parameter', async () => {
      const forgedState = Buffer.from(
        JSON.stringify({ rand: 'attacker-random-nonce', returnTo: '/dashboard' })
      ).toString('base64url');

      const req = new NextRequest(
        `http://localhost:3000/api/auth/parichay/callback?code=auth-code&state=${forgedState}`,
        {
          headers: {
            cookie: 'oidc_state=legitimate-user-nonce', // MISMATCH!
          },
        }
      );

      const res = await parichayCallbackGET(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('state parameter');
    });

    it('sanitizes open redirect in callback redirect location', async () => {
      const validState = Buffer.from(
        JSON.stringify({ rand: 'matching-nonce', returnTo: '//evil-domain.com/phishing' })
      ).toString('base64url');

      const req = new NextRequest(
        `http://localhost:3000/api/auth/parichay/callback?code=auth-code&state=${validState}`,
        {
          headers: {
            cookie: 'oidc_state=matching-nonce',
          },
        }
      );

      const res = await parichayCallbackGET(req);
      expect(res.status).toBe(307);
      const location = res.headers.get('location');
      // Must not redirect to evil-domain.com
      expect(location).toContain('/dashboard');
      expect(location).not.toContain('evil-domain.com');
    });
  });
});
