import { NextRequest, NextResponse } from 'next/server';
import { getDemoPersonaByEmail, DEMO_PERSONAS } from '@/lib/demoPersonas';
import { createSessionToken, type AppUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * NIC Jan-Parichay / MeriPehchaan Government SSO Mock Adapter
 * Simulates OIDC auth callback & JWT assertion exchange as specified in PRD §15.2
 * NOTE: Strictly isolated to DEMO_MODE or non-production environments.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' && process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ error: 'Mock SSO disabled in production' }, { status: 403 });
  }

  const email = request.nextUrl.searchParams.get('email') || 'sunita.devi@nsso.gov.in';
  const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'hi' | null;

  const persona = getDemoPersonaByEmail(email) || DEMO_PERSONAS[1]; // default Sunita Devi (NSSO FOD)

  const authenticatedUser: AppUser = {
    id: persona.id,
    email: persona.email,
    user_metadata: {
      name: persona.name,
      organization_id: persona.organization_id,
      preferred_language: lang || persona.preferred_language || 'hi',
      cadre: persona.cadre,
      designation: persona.designation,
      department: persona.department,
      isDemo: true,
    },
    app_metadata: {
      role: persona.role,
    },
  };

  const sessionToken = await createSessionToken(authenticatedUser);
  const response = NextResponse.redirect(new URL('/dashboard', request.url));

  // Set secure, HttpOnly session cookie
  response.cookies.set('auth_token', sessionToken, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Set demo_user cookie for UI evaluation
  response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(authenticatedUser)), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    sameSite: 'lax',
  });

  response.cookies.set('locale', authenticatedUser.user_metadata?.preferred_language || 'hi', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: 'lax',
  });

  return response;
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' && process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ error: 'Mock SSO disabled in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, parichayId, otp } = body;

    const persona = (email && getDemoPersonaByEmail(email)) || DEMO_PERSONAS[1];

    const authenticatedUser: AppUser = {
      id: persona.id,
      email: persona.email,
      user_metadata: {
        name: persona.name,
        organization_id: persona.organization_id,
        preferred_language: persona.preferred_language,
        cadre: persona.cadre,
        designation: persona.designation,
        department: persona.department,
        parichay_id: parichayId || 'JPID-2024-GOV-AUTH',
        isDemo: true,
      },
      app_metadata: {
        role: persona.role,
      },
    };

    const sessionToken = await createSessionToken(authenticatedUser);

    const response = NextResponse.json({
      success: true,
      message: 'Jan-Parichay SSO Authentication Verified',
      user: authenticatedUser,
      verified_otp: !!otp,
    });

    response.cookies.set('auth_token', sessionToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(authenticatedUser)), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid Parichay payload' }, { status: 400 });
  }
}
