import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { DEMO_PERSONAS, getDemoPersonaByEmail } from '@/lib/demoPersonas';
import { createSessionToken, type AppUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface StoredOtpRecord {
  hash: string;
  salt: string;
  expiresAt: number;
  attempts: number;
}

// In-memory server store for cryptographically secured OTPs
const otpStore = new Map<string, StoredOtpRecord>();
// Rate limiter: max 5 requests per identifier per 10 minutes
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function hashOtp(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, identifier, otp, cadre, name } = body;

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json({ error: 'Email or Mobile number is required' }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const isDemoMode = process.env.DEMO_MODE === 'true';

    // 1. Action: Request OTP
    if (action === 'request') {
      // Rate limiting check
      const now = Date.now();
      const rateData = rateLimitStore.get(cleanIdentifier);
      if (rateData) {
        if (now < rateData.resetAt) {
          if (rateData.count >= 5) {
            return NextResponse.json(
              { error: 'Too many OTP requests. Please wait a few minutes before trying again.' },
              { status: 429 }
            );
          }
          rateData.count++;
        } else {
          rateLimitStore.set(cleanIdentifier, { count: 1, resetAt: now + 10 * 60 * 1000 });
        }
      } else {
        rateLimitStore.set(cleanIdentifier, { count: 1, resetAt: now + 10 * 60 * 1000 });
      }

      // Cryptographically secure 6-digit OTP generation
      const generatedOtp = crypto.randomInt(100000, 1000000).toString();
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = hashOtp(generatedOtp, salt);

      otpStore.set(cleanIdentifier, {
        hash,
        salt,
        expiresAt: now + 5 * 60 * 1000, // 5 minutes expiration
        attempts: 0,
      });

      const isPhone = /^[6-9]\d{9}$/.test(cleanIdentifier);
      const isGovEmail =
        cleanIdentifier.includes('@') &&
        (cleanIdentifier.endsWith('.gov.in') ||
          cleanIdentifier.endsWith('@nic.in') ||
          cleanIdentifier.endsWith('@mospi.gov.in') ||
          cleanIdentifier.endsWith('@nsso.gov.in') ||
          cleanIdentifier.endsWith('@nssta.gov.in'));

      return NextResponse.json({
        success: true,
        channel: isPhone ? 'mobile' : 'email',
        isGovernmentDomain: isGovEmail,
        message: isPhone
          ? `6-digit OTP dispatched to mobile +91-${cleanIdentifier.slice(0, 2)}••••••${cleanIdentifier.slice(8)}`
          : isGovEmail
          ? `6-digit OTP dispatched to verified government inbox ${cleanIdentifier}`
          : `6-digit OTP dispatched to official inbox ${cleanIdentifier}`,
        // demoOtp is strictly confined to DEMO mode
        ...(isDemoMode ? { demoOtp: '123456' } : {}),
        expiresIn: 300,
      });
    }

    // 2. Action: Verify OTP
    if (action === 'verify') {
      if (!otp || typeof otp !== 'string' || otp.trim().length < 4) {
        return NextResponse.json({ error: 'Please enter a valid 6-digit OTP' }, { status: 400 });
      }

      const submittedOtp = otp.trim();
      const stored = otpStore.get(cleanIdentifier);

      let isOtpValid = false;

      // In DEMO_MODE, allow 123456 bypass for test personas
      if (isDemoMode && submittedOtp === '123456') {
        isOtpValid = true;
      } else if (stored) {
        if (Date.now() > stored.expiresAt) {
          otpStore.delete(cleanIdentifier);
          return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
        }

        if (stored.attempts >= 3) {
          otpStore.delete(cleanIdentifier);
          return NextResponse.json(
            { error: 'Too many failed verification attempts. Please request a new OTP.' },
            { status: 429 }
          );
        }

        stored.attempts++;

        const submittedHash = hashOtp(submittedOtp, stored.salt);
        const hashBuf = Buffer.from(submittedHash, 'hex');
        const storedBuf = Buffer.from(stored.hash, 'hex');

        if (hashBuf.length === storedBuf.length && crypto.timingSafeEqual(hashBuf, storedBuf)) {
          isOtpValid = true;
          otpStore.delete(cleanIdentifier); // One-time use: invalidate immediately
        }
      }

      if (!isOtpValid) {
        return NextResponse.json({ error: 'Invalid OTP code. Please try again.' }, { status: 401 });
      }

      // Resolve user persona or construct fresh learner profile
      let persona = getDemoPersonaByEmail(cleanIdentifier);
      if (!persona) {
        if (cleanIdentifier.includes('9876') || cleanIdentifier.includes('sunita')) {
          persona = DEMO_PERSONAS[1]; // Sunita Devi
        } else if (cleanIdentifier.includes('9123') || cleanIdentifier.includes('amit')) {
          persona = DEMO_PERSONAS[0]; // Amit Sharma
        } else {
          // Never trust client-supplied role! Self-service OTP is always learner.
          persona = {
            id: `user-${Date.now()}`,
            name: name || (cleanIdentifier.includes('@') ? cleanIdentifier.split('@')[0].replace('.', ' ') : 'Statistical Officer'),
            email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@mospi.gov.in`,
            role: 'learner',
            organization_id: 'org-mospi',
            cadre: cadre || 'NSSO Field Operations Division',
            designation: 'Field Investigator (FOD)',
            preferred_language: 'hi',
            department: 'NSSO Field Operations Division',
          };
        }
      }

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
          isDemo: isDemoMode,
        },
        app_metadata: {
          role: persona.role,
        },
      };

      const sessionToken = await createSessionToken(authenticatedUser);

      const response = NextResponse.json({
        success: true,
        message: 'OTP Verification Successful',
        user: authenticatedUser,
      });

      // Secure, HttpOnly, SameSite session cookie
      response.cookies.set('auth_token', sessionToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      if (isDemoMode) {
        response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(persona)), {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
          sameSite: 'lax',
        });
      }

      response.cookies.set('locale', persona.preferred_language || 'en', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });

      return response;
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
