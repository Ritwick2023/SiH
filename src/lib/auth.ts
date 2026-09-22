import { cookies, headers } from 'next/headers';
import { DEMO_PERSONAS } from './demoPersonas';
import type { UserRole } from './types';
import {
  createSessionToken,
  verifySessionToken,
  type AppUser,
  type SessionPayload,
} from './sessionToken';

export { createSessionToken, verifySessionToken, type AppUser, type SessionPayload };

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/**
 * getAuthenticatedUser — Central server-side authentication boundary.
 *
 * Rules:
 * 1. Checks cryptographically verified session token in Authorization header or auth_token cookie.
 * 2. In DEMO mode (DEMO_MODE === 'true'), accepts demo persona selection, but validates against
 *    a strict server-side allowlist. Never trusts client JSON for role or identity.
 * 3. In PRODUCTION mode (DEMO_MODE !== 'true'), demo cookies are completely IGNORED.
 * 4. Returns null if unauthenticated. Never silently defaults to an authenticated persona.
 */
export async function getAuthenticatedUser(req?: Request): Promise<AppUser | null> {
  // If a Request object is explicitly passed (e.g. in tests or middleware-adjacent calls), extract from it directly
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.slice(7).trim();
      const verified = await verifySessionToken(bearerToken);
      if (verified) return verified;
    }

    const cookieHeader = req.headers.get('cookie') || '';
    const cookiesMap = new Map<string, string>();
    cookieHeader.split(';').forEach((part) => {
      const [k, v] = part.trim().split('=');
      if (k && v) cookiesMap.set(k, v);
    });

    const sessionCookie = cookiesMap.get('auth_token') || cookiesMap.get('statvidya_session');
    if (sessionCookie) {
      const verified = await verifySessionToken(sessionCookie);
      if (verified) return verified;
    }

    if (process.env.DEMO_MODE === 'true') {
      const demoCookie = cookiesMap.get('demo_persona') || cookiesMap.get('demo_user');
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
          return {
            id: persona.id,
            email: persona.email,
            user_metadata: {
              name: persona.name,
              organization_id: 'mospi-fod',
              preferred_language: persona.preferred_language,
              cadre: persona.cadre,
              designation: persona.designation,
            },
            app_metadata: {
              role: persona.role,
              department: persona.department,
            },
          };
        }
      }
    }
  }

  let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
  let reqHeaders: Awaited<ReturnType<typeof headers>> | null = null;

  try {
    cookieStore = await cookies();
    reqHeaders = await headers();
  } catch {
    // Outside of Next.js server component / route handler request scope (e.g. unit tests)
    return null;
  }

  // 1. Check Bearer token in Authorization header
  const authHeader = reqHeaders?.get ? reqHeaders.get('authorization') : null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    const verified = await verifySessionToken(bearerToken);
    if (verified) return verified;
  }

  // 2. Check cryptographically signed session cookie (auth_token or statvidya_session)
  const sessionCookie =
    cookieStore?.get ? (cookieStore.get('auth_token')?.value || cookieStore.get('statvidya_session')?.value) : undefined;
  if (sessionCookie) {
    const verified = await verifySessionToken(sessionCookie);
    if (verified) return verified;
  }

  // 3. Demo Mode Isolation (ONLY active when DEMO_MODE=true)
  if (process.env.DEMO_MODE === 'true') {
    const demoCookie =
      cookieStore?.get ? (cookieStore.get('demo_persona')?.value || cookieStore.get('demo_user')?.value) : undefined;

    if (demoCookie) {
      let personaId = demoCookie;
      // If legacy JSON cookie, extract ONLY identifier to prevent role tampering
      if (demoCookie.startsWith('%7B') || demoCookie.startsWith('{')) {
        try {
          const parsed = JSON.parse(decodeURIComponent(demoCookie));
          personaId = parsed.id || parsed.email || '';
        } catch {
          personaId = '';
        }
      }

      // Strictly match against server-side allowlist
      const persona = DEMO_PERSONAS.find(
        (p) =>
          p.id === personaId ||
          (personaId && p.email.toLowerCase() === personaId.toLowerCase())
      );

      if (persona) {
        return {
          id: persona.id,
          email: persona.email,
          user_metadata: {
            name: persona.name,
            organization_id: persona.organization_id,
            preferred_language: persona.preferred_language,
            cadre: persona.cadre,
            designation: persona.designation,
            department: persona.department,
            isDemo: true,
          },
          app_metadata: {
            // Role is strictly derived from the server-side persona definition
            role: persona.role,
          },
        };
      }
    }
  }

  // No verified authentication
  return null;
}

/**
 * requireAuth — Requires an authenticated user or throws AuthError (401)
 */
export async function requireAuth(req?: Request): Promise<AppUser> {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }
  return user;
}

/**
 * requireRole — Asserts that the authenticated user possesses the specified role
 */
export function requireRole(user: AppUser, requiredRole: UserRole | string): void {
  const userRole = user.app_metadata?.role;
  if (userRole !== requiredRole) {
    throw new AuthError(`Forbidden: ${requiredRole} access required`, 403);
  }
}

/**
 * requireAnyRole — Asserts that the user possesses at least one of the allowed roles
 */
export function requireAnyRole(user: AppUser, allowedRoles: (UserRole | string)[]): void {
  const userRole = user.app_metadata?.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new AuthError(
      `Forbidden: Access requires one of [${allowedRoles.join(', ')}]`,
      403
    );
  }
}

/**
 * requireOwnership — Prevents IDOR by checking resource ownership or admin privilege
 */
export function requireOwnership(user: AppUser, resourceOwnerId: string): void {
  const isAdmin = user.app_metadata?.role === 'admin';
  if (user.id !== resourceOwnerId && !isAdmin) {
    throw new AuthError('Forbidden: You do not own this resource', 403);
  }
}
