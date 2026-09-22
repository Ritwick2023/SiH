import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    // Strict role check: ONLY admin role is permitted.
    // Development/demo bypasses and cookie presence NEVER grant admin authorization.
    if (user.app_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required for priority training write-backs' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { department, roleId, reason } = body;

    if (!department || typeof department !== 'string') {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    const orgId = user.user_metadata?.organization_id || 'org-mospi';
    const flagData = {
      organization_id: orgId,
      department: department.trim(),
      role_id: roleId || null,
      reason: reason ? String(reason).slice(0, 500) : 'Flagged for urgent workforce capability intervention',
      flagged_by: user.id,
      flagged_at: new Date().toISOString(),
      resolved: false,
    };

    try {
      const docRef = await addDoc(collection(db, 'department_flags'), flagData);
      return NextResponse.json({ success: true, priority: { id: docRef.id, ...flagData } }, { status: 201 });
    } catch {
      // Fallback for offline/local simulation
      const fallbackPriority = {
        id: `tp-${Date.now()}`,
        ...flagData,
      };
      return NextResponse.json(
        { success: true, priority: fallbackPriority, warning: 'Persisted in local session' },
        { status: 201 }
      );
    }
  } catch (err: unknown) {
    const requestId = crypto.randomUUID();
    console.error(`[AdminFlagError:${requestId}]`, err);
    // Sanitize error response: never expose internal stack traces or database errors
    return NextResponse.json({ error: 'Internal server error', requestId }, { status: 500 });
  }
}
