import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/lib/types';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import { verifySessionToken } from '@/lib/sessionToken';

const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/dashboard': ['learner', 'trainer', 'admin'],
  '/skill-gap': ['learner', 'trainer', 'admin'],
  '/pathways': ['learner', 'trainer', 'admin'],
  '/profile': ['learner', 'trainer', 'admin'],
  '/assessment': ['learner', 'trainer', 'admin'],
  '/documents': ['learner', 'trainer', 'admin'],
  '/mcq-generator': ['trainer', 'admin'],
  '/review-queue': ['trainer', 'admin'],
  '/admin': ['admin'],
  '/onboarding': ['learner', 'trainer', 'admin'],
  '/credentials': ['learner', 'trainer', 'admin'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Origin & CSRF verification for mutating API calls
  if (pathname.startsWith('/api/')) {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');

      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          // Permit matching host or localhost in non-production
          const isAllowedHost =
            originHost === host ||
            (process.env.NODE_ENV !== 'production' &&
              (originHost.startsWith('localhost:') || originHost.startsWith('127.0.0.1:')));

          if (!isAllowedHost) {
            return NextResponse.json(
              { error: 'Forbidden: Cross-origin request rejected' },
              { status: 403 }
            );
          }
        } catch {
          return NextResponse.json(
            { error: 'Forbidden: Malformed Origin header' },
            { status: 403 }
          );
        }
      }
    }
    return NextResponse.next();
  }

  // Identity extraction via server-verified token or allowlisted DEMO_MODE persona
  let user: {
    id: string;
    email?: string;
    role: UserRole;
    organization_id?: string;
    preferred_language?: string;
  } | null = null;

  // 1. Verify cryptographic session token
  const sessionToken =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('statvidya_session')?.value;

  if (sessionToken) {
    const verified = await verifySessionToken(sessionToken);
    if (verified) {
      user = {
        id: verified.id,
        email: verified.email,
        role: (verified.app_metadata?.role as UserRole) || 'learner',
        organization_id: verified.user_metadata?.organization_id,
        preferred_language: verified.user_metadata?.preferred_language,
      };
    }
  }

  // 2. Demo mode isolation — only permitted if DEMO_MODE=true and persona is allowlisted
  if (!user && process.env.DEMO_MODE === 'true') {
    const demoCookie =
      request.cookies.get('demo_persona')?.value || request.cookies.get('demo_user')?.value;

    if (demoCookie) {
      let personaId = demoCookie;
      if (demoCookie.startsWith('%7B') || demoCookie.startsWith('{')) {
        try {
          const parsed = JSON.parse(decodeURIComponent(demoCookie));
          personaId = parsed.id || parsed.email || '';
        } catch {
          personaId = '';
        }
      }

      const persona = DEMO_PERSONAS.find(
        (p) =>
          p.id === personaId ||
          (personaId && p.email.toLowerCase() === personaId.toLowerCase())
      );

      if (persona) {
        user = {
          id: persona.id,
          email: persona.email,
          role: persona.role,
          organization_id: persona.organization_id,
          preferred_language: persona.preferred_language,
        };
      }
    }
  }

  const routePath = getRoutePath(pathname);
  const allowedRoles = PROTECTED_ROUTES[routePath];

  // If visiting a protected route without authentication, redirect to login
  if (allowedRoles) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url);
      if (pathname !== '/dashboard') {
        loginUrl.searchParams.set('returnTo', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Role-based authorization: redirect unauthorized roles to dashboard
    if (!allowedRoles.includes(user.role)) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Set verified user headers for downstream server components
  if (user) {
    response.headers.set('x-user-role', String(user.role));
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-org-id', user.organization_id || '');
  }

  // Locale determination
  const requestLocale = request.cookies.get('locale')?.value;
  const validLocale = requestLocale === 'en' || requestLocale === 'hi' ? requestLocale : null;
  const locale = validLocale || (user?.preferred_language === 'hi' ? 'hi' : 'en');

  if (requestLocale !== locale) {
    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

function getRoutePath(pathname: string): string {
  if (pathname.startsWith('/admin')) return '/admin';
  if (pathname.startsWith('/assessment')) return '/assessment';
  if (pathname.startsWith('/mcq-generator')) return '/mcq-generator';
  if (pathname.startsWith('/review-queue')) return '/review-queue';
  if (pathname.startsWith('/onboarding')) return '/onboarding';
  if (pathname.startsWith('/credentials')) return '/credentials';

  const clean = pathname.split('/')[1];
  if (!clean || clean === 'api') return pathname;

  return `/${clean}`;
}

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2|ttf|eot)).*)',
  ],
};
