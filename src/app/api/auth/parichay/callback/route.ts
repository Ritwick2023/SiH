import { NextRequest, NextResponse } from 'next/server';
import { getDemoPersonaByEmail, DEMO_PERSONAS } from '@/lib/demoPersonas';
import { createSessionToken, type AppUser } from '@/lib/auth';

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
 * Jan-Parichay / MeriPehchaan OIDC Callback & Token Exchange Route
 * Exchanges authorization code for ID token and hydrates user session.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');
  const personaParam = searchParams.get('persona');

  let returnTo = '/dashboard';
  let requestedPersona = personaParam;
  let stateValid = true;

  if (stateParam) {
    try {
      const parsed = JSON.parse(Buffer.from(stateParam, 'base64url').toString('utf-8'));
      if (parsed.returnTo) returnTo = sanitizeReturnTo(parsed.returnTo);
      if (parsed.persona && !requestedPersona) requestedPersona = parsed.persona;

      // Validate state against stored cookie if present
      const cookieState = request.cookies.get('oidc_state')?.value;
      if (cookieState && parsed.rand && cookieState !== parsed.rand) {
        stateValid = false;
      }
    } catch {
      stateValid = false;
    }
  }

  if (!stateValid) {
    return NextResponse.json({ error: 'Invalid or forged OIDC state parameter' }, { status: 400 });
  }

  const simulatorEnabled = process.env.PARICHAY_SIMULATOR_ENABLED !== 'false';

  // Identify persona for session payload
  let persona = DEMO_PERSONAS[1]; // default Sunita Devi (FOD Investigator)
  if (requestedPersona) {
    const matched =
      DEMO_PERSONAS.find((p) => p.id === requestedPersona) ||
      getDemoPersonaByEmail(requestedPersona);
    if (matched) persona = matched;
  }

  let claims = {
    id: persona.id,
    sub: persona.id,
    name: persona.name,
    email: persona.email,
    role: persona.role,
    organization_id: persona.organization_id,
    cadre: persona.cadre,
    designation: persona.designation,
    preferred_language: persona.preferred_language || 'hi',
    department: persona.department,
    parichay_id:
      persona.id === 'demo-sunita'
        ? 'JPID-2024-FI-001'
        : persona.id === 'demo-amit'
        ? 'JPID-2024-JSO-002'
        : persona.id === 'demo-priya'
        ? 'JPID-2024-TR-003'
        : 'JPID-2024-AD-004',
    auth_provider: 'NIC_PARICHAY_OIDC',
    auth_time: new Date().toISOString(),
    ministry_code: 'MoSPI-028',
    verified_cadre: true,
  };

  // If real mode enabled, attempt token exchange
  if (!simulatorEnabled && code && process.env.PARICHAY_TOKEN_URL) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);

      const tokenRes = await fetch(process.env.PARICHAY_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: process.env.PARICHAY_CLIENT_ID || 'statvidya_sih_client',
          client_secret: process.env.PARICHAY_CLIENT_SECRET || '',
          redirect_uri:
            process.env.PARICHAY_REDIRECT_URI ||
            `${request.nextUrl.origin}/api/auth/parichay/callback`,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        if (tokenData.id_token) {
          const parts = tokenData.id_token.split('.');
          if (parts.length === 3) {
            const rawPayload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
            // Validate issuer and audience if configured
            const expectedIss = process.env.PARICHAY_ISSUER || 'https://accounts.india.gov.in';
            const expectedAud = process.env.PARICHAY_CLIENT_ID || 'statvidya_sih_client';

            if (rawPayload.iss && rawPayload.iss !== expectedIss) {
              return NextResponse.json({ error: 'Invalid ID token issuer' }, { status: 401 });
            }
            if (rawPayload.aud && rawPayload.aud !== expectedAud) {
              return NextResponse.json({ error: 'Invalid ID token audience' }, { status: 401 });
            }
            if (rawPayload.exp && rawPayload.exp < Math.floor(Date.now() / 1000)) {
              return NextResponse.json({ error: 'Expired ID token' }, { status: 401 });
            }

            claims = {
              ...claims,
              sub: rawPayload.sub || claims.sub,
              name: rawPayload.name || claims.name,
              email: rawPayload.email || claims.email,
              designation: rawPayload.designation || claims.designation,
              cadre: rawPayload.cadre || claims.cadre,
              ministry_code: rawPayload.ministry_code || 'MoSPI-028',
            };
          }
        }
      } else {
        // Fail closed in production mode
        return NextResponse.json({ error: 'OIDC token exchange failed' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'OIDC token verification failed' }, { status: 401 });
    }
  }

  const authenticatedUser: AppUser = {
    id: claims.id,
    email: claims.email,
    user_metadata: {
      name: claims.name,
      organization_id: claims.organization_id,
      preferred_language: claims.preferred_language,
      cadre: claims.cadre,
      designation: claims.designation,
      department: claims.department,
    },
    app_metadata: {
      role: claims.role,
    },
  };

  const sessionToken = await createSessionToken(authenticatedUser);
  const response = NextResponse.redirect(new URL(returnTo, request.url));

  // Set cryptographically signed HttpOnly session cookie
  response.cookies.set('auth_token', sessionToken, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Set demo_user cookie for backwards compatibility with existing tests
  response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(claims)), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    sameSite: 'lax',
  });

  response.cookies.set('locale', claims.preferred_language, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: 'lax',
  });

  // Clear one-time OIDC state & nonce cookies
  response.cookies.set('oidc_state', '', { path: '/', maxAge: 0 });
  response.cookies.set('oidc_nonce', '', { path: '/', maxAge: 0 });

  return response;
}
