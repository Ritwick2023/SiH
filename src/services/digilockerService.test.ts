import { describe, it, expect } from 'vitest';
import {
  generateVerifiableCredential,
  computeCredentialHash,
  issueCompetencyCredential,
} from './digilockerService';

describe('DigiLocker W3C Verifiable Credential Service (Task C4)', () => {
  it('generates compliant W3C Verifiable Credential 2.0 object', async () => {
    const vc = await generateVerifiableCredential({
      employeeId: 'EMP-7842',
      holderName: 'Sunita Devi',
      cadre: 'Field Operations Division (FOD)',
      competencyId: 'comp-boundary-demarcation',
      competencyName: 'Census Boundary Demarcation & Listing',
      levelAchieved: 'L4',
    });

    expect(vc['@context']).toContain('https://www.w3.org/2018/credentials/v1');
    expect(vc.type).toContain('VerifiableCredential');
    expect(vc.type).toContain('CompetencyCredential');
    expect(vc.issuer).toBe('did:web:statvidya.nssta.gov.in');
    expect(vc.credentialSubject.id).toBe('did:gov:in:EMP-7842');
    expect(vc.credentialSubject.level_achieved).toBe('L4');
    expect(vc.proof.credentialHash).toBeDefined();
    expect(vc.proof.type).toBe('Ed25519Signature2020');
  });

  it('computes deterministic SHA-256 hash for identical subject', async () => {
    const subject = {
      id: 'did:gov:in:EMP-7842',
      holder_name: 'Sunita Devi',
      cadre: 'FOD',
      competency_id: 'comp-1',
      competency_name: 'Boundary Demarcation',
      level_achieved: 'L4',
      assessment_date: '2026-09-19',
      issuer_authority: 'NSSTA',
    };
    const date = '2026-09-19T00:00:00.000Z';

    const hash1 = await computeCredentialHash(subject, date);
    const hash2 = await computeCredentialHash(subject, date);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBeGreaterThan(10);
  });

  it('issues credential with local sovereign fallback when external API not configured', async () => {
    const result = await issueCompetencyCredential({
      employeeId: 'EMP-7842',
      holderName: 'Sunita Devi',
      cadre: 'FOD',
      competencyId: 'comp-boundary-demarcation',
      competencyName: 'Census Boundary Demarcation & Listing',
      levelAchieved: 'L4',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('LOCAL_SOVEREIGN_FALLBACK');
    expect(result.credentialId).toMatch(/^urn:uuid:/);
    expect(result.credentialHash).toBeDefined();
    expect(result.qrPayload).toContain('vc_id');
  });
});
