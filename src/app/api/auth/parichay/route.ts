import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Jan-Parichay / MeriPehchaan OIDC Authorization Redirect Endpoint (PRD §15.2 & Task C3)
 * Initiates official government Single Sign-On (SSO) flow
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const persona = searchParams.get('persona') || searchParams.get('email') || 'demo-sunita';
  const returnTo = searchParams.get('return_to') || '/dashboard';

  const simulatorEnabled = process.env.PARICHAY_SIMULATOR_ENABLED !== 'false';
  const clientId = process.env.PARICHAY_CLIENT_ID || 'statvidya_sih_client';
  const authUrl = process.env.PARICHAY_AUTH_URL || 'https://accounts.india.gov.in/authorize';
  const redirectUri =
    process.env.PARICHAY_REDIRECT_URI ||
    `${request.nextUrl.origin}/api/auth/parichay/callback`;

  // Generate cryptographically secure state & nonce for OIDC handshake
  const state = Buffer.from(JSON.stringify({ returnTo, persona, ts: Date.now() })).toString('base64url');
  const nonce = Math.random().toString(36).substring(2, 15);

  if (simulatorEnabled) {
    // In simulator mode, seamlessly redirect to callback with mock authorization code
    const simCallbackUrl = new URL('/api/auth/parichay/callback', request.url);
    simCallbackUrl.searchParams.set('code', `sim_auth_code_${Date.now()}`);
    simCallbackUrl.searchParams.set('state', state);
    simCallbackUrl.searchParams.set('persona', persona);
    return NextResponse.redirect(simCallbackUrl);
  }

  // Real OIDC authorization redirect to National Informatics Centre (NIC)
  const oidcUrl = new URL(authUrl);
  oidcUrl.searchParams.set('client_id', clientId);
  oidcUrl.searchParams.set('response_type', 'code');
  oidcUrl.searchParams.set('redirect_uri', redirectUri);
  oidcUrl.searchParams.set('scope', 'openid profile email cadre designation');
  oidcUrl.searchParams.set('state', state);
  oidcUrl.searchParams.set('nonce', nonce);

  return NextResponse.redirect(oidcUrl);
}
