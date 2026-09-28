import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, createSessionToken, type AppUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, designation, department, cadre, preferred_language } = body;

    const updatedUser: AppUser = {
      ...currentUser,
      user_metadata: {
        ...(currentUser.user_metadata || {}),
        name: typeof name === 'string' && name.trim() ? name.trim() : currentUser.user_metadata?.name,
        designation:
          typeof designation === 'string' && designation.trim()
            ? designation.trim()
            : currentUser.user_metadata?.designation,
        department:
          typeof department === 'string' && department.trim()
            ? department.trim()
            : currentUser.user_metadata?.department,
        cadre: typeof cadre === 'string' && cadre.trim() ? cadre.trim() : currentUser.user_metadata?.cadre,
        preferred_language:
          preferred_language === 'en' || preferred_language === 'hi'
            ? preferred_language
            : currentUser.user_metadata?.preferred_language || 'en',
      },
      app_metadata: {
        ...(currentUser.app_metadata || {}),
      },
    };

    const sessionToken = await createSessionToken(updatedUser);
    const response = NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });

    // 1. Update cryptographically signed auth_token
    response.cookies.set('auth_token', sessionToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // 2. Update demo_user cookie to maintain client & demo state synchronization
    const demoPayload = {
      id: updatedUser.id,
      name: updatedUser.user_metadata?.name,
      email: updatedUser.email,
      role: updatedUser.app_metadata?.role || 'learner',
      designation: updatedUser.user_metadata?.designation,
      cadre: updatedUser.user_metadata?.cadre,
      organization_id: updatedUser.user_metadata?.organization_id || 'org-mospi',
      preferred_language: updatedUser.user_metadata?.preferred_language || 'en',
      department: updatedUser.user_metadata?.department,
    };

    response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(demoPayload)), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: 'lax',
    });

    // 3. Update locale cookie if language was explicitly provided
    if (preferred_language === 'en' || preferred_language === 'hi') {
      response.cookies.set('locale', preferred_language, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
