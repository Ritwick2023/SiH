import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as parichayInit } from './route';
import { GET as parichayCallback } from './callback/route';

describe('Jan-Parichay OIDC Auth Endpoints (Task C3)', () => {
  it('parichay initiation route redirects to callback in simulator mode', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/parichay?persona=demo-sunita&return_to=/dashboard');
    const res = await parichayInit(req);

    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/api/auth/parichay/callback');
    expect(location).toContain('code=sim_auth_code_');
  });

  it('parichay callback route sets user cookies and redirects to dashboard', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/parichay/callback?code=sim_auth_code_123&persona=demo-sunita');
    const res = await parichayCallback(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard');

    const demoUserCookie = res.cookies.get('demo_user');
    expect(demoUserCookie).toBeDefined();
    const parsedUser = JSON.parse(decodeURIComponent(demoUserCookie!.value));
    expect(parsedUser.name).toBe('Sunita Devi');
    expect(parsedUser.cadre).toContain('Field Operations Division');
    expect(parsedUser.auth_provider).toBe('NIC_PARICHAY_OIDC');
  });
});
