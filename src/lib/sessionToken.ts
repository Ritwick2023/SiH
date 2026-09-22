import type { UserRole } from './types';

export interface AppUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    organization_id?: string;
    preferred_language?: string;
    cadre?: string;
    designation?: string;
    department?: string;
    phone?: string;
    parichay_id?: string;
    isDemo?: boolean;
    [key: string]: unknown;
  };
  app_metadata?: {
    role?: UserRole | string;
    department?: string;
    [key: string]: unknown;
  };
}

export interface SessionPayload {
  sub: string;
  email?: string;
  name?: string;
  role: UserRole;
  organization_id?: string;
  cadre?: string;
  designation?: string;
  preferred_language?: string;
  department?: string;
  isDemo?: boolean;
  exp: number;
  iat: number;
}

const DEFAULT_SECRET = 'statvidya_super_secret_signing_key_change_in_production_2026';

function getAuthSecret(): string {
  if (typeof process !== 'undefined' && process.env?.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }
  return DEFAULT_SECRET;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(secret: string, usage: 'sign' | 'verify'): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  );
}

/**
 * Creates an HMAC-SHA256 signed session token using Web Crypto API (Edge & Node compatible).
 */
export async function createSessionToken(
  user: AppUser,
  expiresInSec: number = 60 * 60 * 24 * 7 // 7 days
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const role = (user.app_metadata?.role as UserRole) || 'learner';

  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.user_metadata?.name,
    role,
    organization_id: user.user_metadata?.organization_id,
    cadre: user.user_metadata?.cadre,
    designation: user.user_metadata?.designation,
    preferred_language: user.user_metadata?.preferred_language,
    department: user.user_metadata?.department,
    isDemo: user.user_metadata?.isDemo,
    iat: now,
    exp: now + expiresInSec,
  };

  const enc = new TextEncoder();
  const data = uint8ArrayToBase64Url(enc.encode(JSON.stringify(payload)));
  const secret = getAuthSecret();
  const key = await getCryptoKey(secret, 'sign');
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const signature = uint8ArrayToBase64Url(new Uint8Array(signatureBuffer));

  return `${data}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token using Web Crypto API (Edge & Node compatible).
 */
export async function verifySessionToken(token: string): Promise<AppUser | null> {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;

  try {
    const enc = new TextEncoder();
    const secret = getAuthSecret();
    const key = await getCryptoKey(secret, 'verify');
    const sigBytes = base64UrlToUint8Array(sig);
    const dataBytes = enc.encode(data);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes.buffer as ArrayBuffer, dataBytes.buffer as ArrayBuffer);
    if (!isValid) return null;

    const decodedStr = new TextDecoder().decode(base64UrlToUint8Array(data));
    const payload: SessionPayload = JSON.parse(decodedStr);

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired token
    }

    return {
      id: payload.sub,
      email: payload.email,
      user_metadata: {
        name: payload.name,
        organization_id: payload.organization_id,
        preferred_language: payload.preferred_language,
        cadre: payload.cadre,
        designation: payload.designation,
        department: payload.department,
        isDemo: payload.isDemo,
      },
      app_metadata: {
        role: payload.role || 'learner',
      },
    };
  } catch {
    return null;
  }
}
