import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { local_id, competency_id, user_id, final_level, answers, branch_path, created_at } = body;

    if (!local_id) {
      return NextResponse.json({ error: 'Missing required field: local_id' }, { status: 400 });
    }

    const serverAssessmentId = `srv-sync-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const submittedAt = new Date().toISOString();

    // Closed-Loop Outcome Attribution: Log assessment completion asynchronously
    const analyticsUrl = process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || 'http://localhost:8000';
    try {
      fetch(`${analyticsUrl}/api/v1/outcomes/log-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          official_id: user_id || 'anonymous',
          event_type: 'assessment_completed',
          competency_id: competency_id || 'unknown',
          theta_after: final_level === 'L5' ? 2.8 : (final_level === 'L4' ? 1.6 : (final_level === 'L3' ? 0.3 : -1.0)),
          metadata: { local_id, branch_path }
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking background log
    }

    // Task C4: Issue DigiLocker W3C Verifiable Credential if final_level is L4 or L5
    let credentialData = null;
    if (final_level === 'L4' || final_level === 'L5') {
      try {
        const { issueCompetencyCredential } = await import('@/services/digilockerService');
        const issueResult = await issueCompetencyCredential({
          employeeId: user_id || 'OFFICER-DEFAULT',
          holderName: user_id === 'demo-sunita' ? 'Sunita Devi' : (user_id === 'demo-amit' ? 'Amit Sharma' : 'MoSPI Statistical Officer'),
          cadre: 'Field Operations Division (FOD)',
          competencyId: competency_id || 'comp-boundary-demarcation',
          competencyName: 'Census Boundary Demarcation & Listing',
          levelAchieved: final_level,
        });
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
      user_id: user_id || 'unknown',
      final_level: final_level || 'L1',
      branch_path: branch_path || 'L1',
      answers_recorded: answers ? Object.keys(answers).length : 0,
      offline_created_at: created_at || submittedAt,
      sync_status: 'SYNCED',
      verifiable_credential: credentialData,
    });
  } catch (error) {
    console.error('Assessment sync error:', error);
    return NextResponse.json({ error: 'Failed to synchronize offline assessment' }, { status: 500 });
  }
}
