import { NextRequest, NextResponse } from 'next/server';
import { getDemoPersonaByEmail } from '@/lib/demoPersonas';
import { createSessionToken, type AppUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' && process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ error: 'Demo persona switching disabled in production' }, { status: 403 });
  }

  const email = request.nextUrl.searchParams.get('email');
  const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'hi' | null;

  if (!email) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const persona = getDemoPersonaByEmail(email);

  if (!persona) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const userObj: AppUser = {
    id: persona.id,
    email: persona.email,
    user_metadata: {
      name: persona.name,
      organization_id: persona.organization_id,
      preferred_language: lang || persona.preferred_language,
      cadre: persona.cadre,
      designation: persona.designation,
      department: persona.department,
      isDemo: true,
    },
    app_metadata: {
      role: persona.role,
    },
  };

  const sessionToken = await createSessionToken(userObj);
  const response = NextResponse.redirect(new URL('/dashboard', request.url));

  // Set cryptographically signed HttpOnly session cookie
  response.cookies.set('auth_token', sessionToken, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Set demo cookies for backwards compatibility and UI evaluation
  response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(userObj)), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    sameSite: 'lax',
  });
  response.cookies.set('demo_persona', persona.id, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    sameSite: 'lax',
  });
  response.cookies.set('locale', lang || persona.preferred_language || 'en', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });

  return response;
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' && process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ error: 'Demo persona switching disabled in production' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, lang } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const persona = getDemoPersonaByEmail(email);

    if (!persona) {
      return NextResponse.json({ error: 'Unknown demo persona' }, { status: 404 });
    }

    const userObj: AppUser = {
      id: persona.id,
      email: persona.email,
      user_metadata: {
        name: persona.name,
        organization_id: persona.organization_id,
        preferred_language: lang || persona.preferred_language,
        cadre: persona.cadre,
        designation: persona.designation,
        department: persona.department,
        isDemo: true,
      },
      app_metadata: {
        role: persona.role,
      },
    };

    const sessionToken = await createSessionToken(userObj);

    const response = NextResponse.json({
      success: true,
      persona: userObj,
    });

    response.cookies.set('auth_token', sessionToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(userObj)), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: 'lax',
    });

    response.cookies.set('demo_persona', persona.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
