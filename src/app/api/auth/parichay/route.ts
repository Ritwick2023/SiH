import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const dynamic = 'force-dynamic';

function sanitizeReturnTo(returnTo: string | null): string {
  if (!returnTo || typeof returnTo !== 'string') return '/dashboard';
  const trimmed = returnTo.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\') || trimmed.includes(':')) {
    return '/dashboard';
  }
  const allowedPrefixes = [
    '/dashboard',
    '/profile',
    '/pathways',
    '/assessment',
    '/skill-gap',
    '/credentials',
    '/onboarding',
    '/assignments',
  ];
  const isAllowed = allowedPrefixes.some(
    (p) => trimmed === p || trimmed.startsWith(p + '/') || trimmed.startsWith(p + '?')
  );
  return isAllowed ? trimmed : '/dashboard';
}

/**
 * Jan-Parichay / MeriPehchaan OIDC Authorization Redirect Endpoint
 * Initiates official government Single Sign-On (SSO) flow
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const persona = searchParams.get('persona') || searchParams.get('email') || 'demo-sunita';
  const returnTo = sanitizeReturnTo(searchParams.get('return_to'));

  const simulatorEnabled = process.env.PARICHAY_SIMULATOR_ENABLED !== 'false';
  const clientId = process.env.PARICHAY_CLIENT_ID || 'statvidya_sih_client';
  const authUrl = process.env.PARICHAY_AUTH_URL || 'https://accounts.india.gov.in/authorize';
  const redirectUri =
    process.env.PARICHAY_REDIRECT_URI ||
    `${request.nextUrl.origin}/api/auth/parichay/callback`;

  // Generate cryptographically secure random state & nonce for OIDC handshake
  const stateRandom = crypto.randomBytes(24).toString('hex');
  const statePayload = {
    rand: stateRandom,
    returnTo,
    persona,
    ts: Date.now(),
  };
  const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url');
  const nonce = crypto.randomBytes(16).toString('hex');

  const response = simulatorEnabled
    ? (() => {
        // In simulator mode, redirect to callback with mock authorization code
        const simCallbackUrl = new URL('/api/auth/parichay/callback', request.url);
        simCallbackUrl.searchParams.set('code', `sim_auth_code_${Date.now()}`);
        simCallbackUrl.searchParams.set('state', state);
        simCallbackUrl.searchParams.set('persona', persona);
        return NextResponse.redirect(simCallbackUrl);
      })()
    : (() => {
        // Real OIDC authorization redirect to National Informatics Centre (NIC)
        const oidcUrl = new URL(authUrl);
        oidcUrl.searchParams.set('client_id', clientId);
        oidcUrl.searchParams.set('response_type', 'code');
        oidcUrl.searchParams.set('redirect_uri', redirectUri);
        oidcUrl.searchParams.set('scope', 'openid profile email cadre designation');
        oidcUrl.searchParams.set('state', state);
        oidcUrl.searchParams.set('nonce', nonce);
        return NextResponse.redirect(oidcUrl);
      })();

  // Store state and nonce in secure, HttpOnly, SameSite cookies for callback validation
  response.cookies.set('oidc_state', stateRandom, {
    path: '/',
    maxAge: 300, // 5 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  response.cookies.set('oidc_nonce', nonce, {
    path: '/',
    maxAge: 300,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return response;
}
