import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, type AppUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      centerState,
      ministry,
      organisation,
      designation,
      email,
      name,
      phone,
      parichayId,
    } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid official email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const desigLower = (designation || '').toString().toLowerCase();
    const orgLower = (organisation || '').toString().toLowerCase();

    // Security Rule (Req #11): New registrations ALWAYS default to 'learner'.
    // Privileged roles (trainer/admin) can NEVER be self-assigned via designation or text input.
    const role = 'learner';

    // Set cadre and preferred language based on field division vs headquarters
    let cadre = 'NSSO Field Operations Division';
    let preferredLanguage: 'en' | 'hi' = 'en';

    if (desigLower.includes('investigator') || orgLower.includes('field') || orgLower.includes('fod')) {
      cadre = 'NSSO Field Operations Division';
      preferredLanguage = 'hi'; // Field investigators default to Hindi-first
    } else {
      cadre = 'Subordinate Statistical Service (SSS)';
      preferredLanguage = 'en';
    }

    const registeredUser: AppUser = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      user_metadata: {
        name: name || cleanEmail.split('@')[0].replace('.', ' ') || 'Statistical Officer',
        phone: phone || '',
        organization_id: orgLower.includes('nsso') ? 'org-nsso' : orgLower.includes('nssta') ? 'org-nssta' : 'org-mospi',
        cadre,
        designation: designation || 'Statistical Officer',
        preferred_language: preferredLanguage,
        department: organisation || 'MoSPI',
        ministry: ministry || 'Ministry of Statistics and Programme Implementation',
        center_state: centerState || 'Center',
        parichay_id: parichayId || `JPID-2024-${Date.now().toString().slice(-4)}`,
        registered_at: new Date().toISOString(),
      },
      app_metadata: {
        role, // strictly 'learner'
      },
    };

    const sessionToken = await createSessionToken(registeredUser);
    const isDemoMode = process.env.DEMO_MODE === 'true';

    const response = NextResponse.json({
      success: true,
      message: 'Official Government Registration Profile Created (Learner Cadre)',
      user: registeredUser,
    });

    // Set cryptographically signed HttpOnly session cookie
    response.cookies.set('auth_token', sessionToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    if (isDemoMode) {
      response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(registeredUser)), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        sameSite: 'lax',
      });
    }

    response.cookies.set('locale', preferredLanguage, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to process official registration' }, { status: 500 });
  }
}
