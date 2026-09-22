import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';

export const dynamic = 'force-dynamic';

// Server-side cache to prevent duplicate credential issuance on retried syncs
const issuedCredentialsCache = new Set<string>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { local_id, competency_id, user_id, final_level, answers, branch_path, created_at } = body;

    if (!local_id) {
      return NextResponse.json({ error: 'Missing required field: local_id' }, { status: 400 });
    }

    // 1. Enforce Server-Authoritative Identity (Req #15)
    const authenticatedUser = await getAuthenticatedUser(request);
    let effectiveUserId: string;
    let effectiveUserName = 'MoSPI Statistical Officer';

    if (authenticatedUser) {
      // Identity MUST come from authenticated session, never client input
      effectiveUserId = authenticatedUser.id;
      effectiveUserName = authenticatedUser.user_metadata?.name || effectiveUserName;
    } else if (process.env.DEMO_MODE === 'true' || process.env.NODE_ENV === 'test') {
      // In demo or test mode, check allowlisted demo personas
      const matched = DEMO_PERSONAS.find((p) => p.id === user_id || p.email === user_id);
      if (matched) {
        effectiveUserId = matched.id;
        effectiveUserName = matched.name;
      } else {
        effectiveUserId = user_id || 'demo-sunita';
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to synchronize assessment' },
        { status: 401 }
      );
    }

    const serverAssessmentId = `srv-sync-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const submittedAt = new Date().toISOString();

    // 2. Validate Assessment Answers & Completion
    const answersRecorded = answers && typeof answers === 'object' ? Object.keys(answers).length : 0;

    // Server-authoritative level validation: Cannot claim L4 or L5 without recorded answers
    let verifiedLevel = final_level || 'L1';
    if ((verifiedLevel === 'L4' || verifiedLevel === 'L5') && answersRecorded < 2) {
      verifiedLevel = 'L1'; // Invalidate forged proficiency level
    }

    // 3. Closed-Loop Outcome Attribution: Log event asynchronously
    const analyticsUrl = process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || 'http://localhost:8000';
    try {
      fetch(`${analyticsUrl}/api/v1/outcomes/log-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.ANALYTICS_API_SECRET
            ? { Authorization: `Bearer ${process.env.ANALYTICS_API_SECRET}` }
            : {}),
        },
        body: JSON.stringify({
          official_id: effectiveUserId,
          event_type: 'assessment_completed',
          competency_id: competency_id || 'unknown',
          theta_after:
            verifiedLevel === 'L5' ? 2.8 : verifiedLevel === 'L4' ? 1.6 : verifiedLevel === 'L3' ? 0.3 : -1.0,
          metadata: { local_id, branch_path },
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking background log
    }

    // 4. Server-Authoritative DigiLocker Verifiable Credential Issuance (Req #16)
    let credentialData = null;
    const credentialKey = `${effectiveUserId}:${competency_id}:${local_id}`;

    if ((verifiedLevel === 'L4' || verifiedLevel === 'L5') && !issuedCredentialsCache.has(credentialKey)) {
      try {
        const { issueCompetencyCredential } = await import('@/services/digilockerService');
        const issueResult = await issueCompetencyCredential({
          employeeId: effectiveUserId,
          holderName: effectiveUserName,
          cadre: 'Field Operations Division (FOD)',
          competencyId: competency_id || 'comp-capi',
          competencyName: 'CAPI Field Enumeration & Survey Verification',
          levelAchieved: verifiedLevel,
        });

        issuedCredentialsCache.add(credentialKey);

        credentialData = {
          issued: true,
          credential_id: issueResult.credentialId,
          credential_hash: issueResult.credentialHash,
          status: issueResult.status,
        };
      } catch {
        // Non-blocking credential issuance
      }
    }

    return NextResponse.json({
      success: true,
      assessment_id: serverAssessmentId,
      submitted_at: submittedAt,
      local_id,
      competency_id: competency_id || 'unknown',
      user_id: effectiveUserId,
      final_level: verifiedLevel,
      branch_path: branch_path || 'L1',
      answers_recorded: answersRecorded,
      offline_created_at: created_at || submittedAt,
      sync_status: 'SYNCED',
      verifiable_credential: credentialData,
    });
  } catch (error) {
    console.error('Assessment sync error:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize offline assessment' },
      { status: 500 }
    );
  }
}
