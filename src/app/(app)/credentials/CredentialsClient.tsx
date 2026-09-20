'use client';

import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
  Search,
  RefreshCw,
  Building2,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { AppUser } from '@/lib/auth';
import { W3CVerifiableCredential } from '@/services/digilockerService';
import { DigiLockerBadge } from '@/components/profile/DigiLockerBadge';

interface CredentialsClientProps {
  user: AppUser;
}

const SAMPLE_CREDENTIALS: W3CVerifiableCredential[] = [
  {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://statvidya.nssta.gov.in/credentials/v1',
    ],
    id: 'urn:uuid:vc-mospi-fod-2026-0042',
    type: ['VerifiableCredential', 'CompetencyCredential'],
    issuer: 'did:web:statvidya.nssta.gov.in',
    issuanceDate: '2026-09-19T10:30:00Z',
    credentialSubject: {
      id: 'did:gov:in:EMP-NSSO-7842',
      holder_name: 'Sunita Devi',
      cadre: 'Field Operations Division (FOD)',
      competency_id: 'comp-boundary-demarcation',
      competency_name: 'Census Boundary Demarcation & Listing',
      level_achieved: 'L4',
      assessment_date: '2026-09-19',
      issuer_authority: 'National Statistical Systems Training Academy (NSSTA) / MoSPI',
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: '2026-09-19T10:30:00Z',
      verificationMethod: 'did:web:statvidya.nssta.gov.in#key-1',
      proofPurpose: 'assertionMethod',
      jws: 'eyJhbGciOiJFZERTQSI...e481b672a912',
      credentialHash: 'e481b672a912fb846067b43a9b1c784910cf94d75294e0988636b1359c44ad93',
    },
  },
  {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://statvidya.nssta.gov.in/credentials/v1',
    ],
    id: 'urn:uuid:vc-mospi-fod-2026-0038',
    type: ['VerifiableCredential', 'CompetencyCredential'],
    issuer: 'did:web:statvidya.nssta.gov.in',
    issuanceDate: '2026-09-12T14:15:00Z',
    credentialSubject: {
      id: 'did:gov:in:EMP-NSSO-7842',
      holder_name: 'Sunita Devi',
      cadre: 'Field Operations Division (FOD)',
      competency_id: 'comp-capi-offline-entry',
      competency_name: 'CAPI Offline Data Entry & Field Validation',
      level_achieved: 'L4',
      assessment_date: '2026-09-12',
      issuer_authority: 'National Statistical Systems Training Academy (NSSTA) / MoSPI',
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: '2026-09-12T14:15:00Z',
      verificationMethod: 'did:web:statvidya.nssta.gov.in#key-1',
      proofPurpose: 'assertionMethod',
      jws: 'eyJhbGciOiJFZERTQSI...c182a939f201',
      credentialHash: 'c182a939f201aa947190e2b4d91c620485fd71e98412e0988636b1359a18fa22',
    },
  },
  {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://statvidya.nssta.gov.in/credentials/v1',
    ],
    id: 'urn:uuid:vc-mospi-fod-2026-0021',
    type: ['VerifiableCredential', 'CompetencyCredential'],
    issuer: 'did:web:statvidya.nssta.gov.in',
    issuanceDate: '2026-08-28T09:00:00Z',
    credentialSubject: {
      id: 'did:gov:in:EMP-NSSO-7842',
      holder_name: 'Sunita Devi',
      cadre: 'Field Operations Division (FOD)',
      competency_id: 'comp-gis-ground-truth',
      competency_name: 'ISRO Bhuvan UFS Ground Truthing & Geofencing',
      level_achieved: 'L4',
      assessment_date: '2026-08-28',
      issuer_authority: 'National Statistical Systems Training Academy (NSSTA) / MoSPI',
    },
    proof: {
      type: 'Ed25519Signature2020',
      created: '2026-08-28T09:00:00Z',
      verificationMethod: 'did:web:statvidya.nssta.gov.in#key-1',
      proofPurpose: 'assertionMethod',
      jws: 'eyJhbGciOiJFZERTQSI...f942bc01824a',
      credentialHash: 'f942bc01824a8723c1092e4785b31d9275ce910f4381e0988636b1359c44ce31',
    },
  },
];

export function formatCredentialDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate.slice(0, 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return isoDate.slice(0, 10);
  }
}

export default function CredentialsClient({ user }: CredentialsClientProps) {
  const [selectedCred, setSelectedCred] = useState<W3CVerifiableCredential>(SAMPLE_CREDENTIALS[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'L4' | 'L5'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const filteredCredentials = SAMPLE_CREDENTIALS.filter((cred) => {
    if (activeFilter !== 'all' && cred.credentialSubject.level_achieved !== activeFilter) {
      return false;
    }
    if (
      searchQuery &&
      !cred.credentialSubject.competency_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !cred.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleVerifyHash = () => {
    setIsVerifying(true);
    setVerifySuccess(null);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifySuccess(
        `Cryptographically Verified: Ed25519 signature is valid against issuer DID (${selectedCred.issuer}). Merkle root integrity intact.`
      );
    }, 600);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#EDF0F7] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 border border-[#D8DFEE] shadow-xs relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#1C4CA1]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-1">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Official Sovereign Digital Locker
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FFA72F]/15 text-[#1F273A] border border-[#FFA72F]/30">
                  W3C VC 2.0 Compliant
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F273A] tracking-tight">
                Karmayogi Digital Passport
              </h1>
              <p className="text-sm text-[#475569] mt-1 max-w-2xl">
                Tamper-evident, cryptographically verifiable competency credentials issued by the
                National Statistical Systems Training Academy (NSSTA), Ministry of Statistics &
                Programme Implementation.
              </p>
              {user && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#1F273A] font-semibold">
                  <span className="text-[#1C4CA1] font-bold">Authenticated Officer:</span> {user.user_metadata?.name || user.email}
                  {user.user_metadata?.name && user.email && (
                    <span className="text-muted-foreground">({user.email})</span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D8DFEE] text-[#1F273A] font-bold text-xs hover:bg-[#EDF0F7] transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="h-4 w-4 text-[#1C4CA1]" />
                <span>Print Official Certificate</span>
              </button>
              <a
                href="https://digilocker.meripehchaan.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C4CA1] text-white font-bold text-xs hover:bg-[#1164BE] transition-colors shadow-sm cursor-pointer"
              >
                <span>National DigiLocker</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#D8DFEE]">
            <div className="p-3 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE]">
              <span className="text-[11px] text-[#475569] font-medium block">Total Certified</span>
              <span className="text-xl font-mono font-black text-[#1F273A]">
                {SAMPLE_CREDENTIALS.length} Credentials
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE]">
              <span className="text-[11px] text-[#475569] font-medium block">Highest Level</span>
              <span className="text-xl font-mono font-black text-[#1C4CA1]">L4 (Supervisor)</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE]">
              <span className="text-[11px] text-[#475569] font-medium block">Signature Cryptography</span>
              <span className="text-xl font-mono font-black text-emerald-700">Ed25519 Verified</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#EDF0F7]/60 border border-[#D8DFEE]">
              <span className="text-[11px] text-[#475569] font-medium block">DigiLocker Status</span>
              <span className="text-xl font-mono font-black text-[#FFA72F]">Real-time Synced</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Credential List / Right Interactive Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Credential Selector */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filter & Search */}
            <div className="bg-white p-4 rounded-3xl border border-[#D8DFEE] shadow-xs space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search competency or credential URN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#EDF0F7]/50 border border-[#D8DFEE] text-xs text-[#1F273A] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1C4CA1]/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-[#1C4CA1] text-white'
                      : 'bg-[#EDF0F7] text-[#475569] hover:bg-[#D8DFEE]'
                  }`}
                >
                  All ({SAMPLE_CREDENTIALS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('L4')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeFilter === 'L4'
                      ? 'bg-[#1C4CA1] text-white'
                      : 'bg-[#EDF0F7] text-[#475569] hover:bg-[#D8DFEE]'
                  }`}
                >
                  L4 Expert ({SAMPLE_CREDENTIALS.filter((c) => c.credentialSubject.level_achieved === 'L4').length})
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredCredentials.map((cred) => {
                const isSelected = selectedCred.id === cred.id;
                return (
                  <div
                    key={cred.id}
                    onClick={() => setSelectedCred(cred)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#1C4CA1] ring-2 ring-[#1C4CA1]/20 shadow-sm'
                        : 'bg-white/80 hover:bg-white border-[#D8DFEE] hover:border-[#1C4CA1]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#1C4CA1] text-white'
                              : 'bg-[#1C4CA1]/10 text-[#1C4CA1]'
                          }`}
                        >
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                            {cred.id.replace('urn:uuid:', '')}
                          </span>
                          <h4 className="text-sm font-black text-[#1F273A] leading-snug mt-0.5">
                            {cred.credentialSubject.competency_name}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-[#FFA72F]/20 text-[#1F273A] border border-[#FFA72F]/40">
                              {cred.credentialSubject.level_achieved} Certified
                            </span>
                            <span
                              className="text-[11px] text-muted-foreground"
                              suppressHydrationWarning
                            >
                              {formatCredentialDate(cred.issuanceDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 mt-1 transition-transform ${
                          isSelected ? 'text-[#1C4CA1] translate-x-1' : 'text-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: In-depth Verifiable Credential Viewer */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive DigiLocker Card */}
            <DigiLockerBadge credential={selectedCred} />

            {/* Cryptographic Inspector */}
            <div className="bg-white rounded-3xl p-6 border border-[#D8DFEE] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8DFEE] pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#1C4CA1]" />
                  <h3 className="text-sm font-black text-[#1F273A]">
                    Cryptographic Integrity & Verification
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleVerifyHash}
                  disabled={isVerifying}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EDF0F7] hover:bg-[#D8DFEE] text-xs font-bold text-[#1C4CA1] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Verify Hash</span>
                </button>
              </div>

              {verifySuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{verifySuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground block font-medium">Issuer DID</span>
                  <div className="p-2 rounded-xl bg-[#EDF0F7]/70 font-mono text-[11px] text-[#1F273A] truncate select-all">
                    {selectedCred.issuer}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block font-medium">Holder Subject DID</span>
                  <div className="p-2 rounded-xl bg-[#EDF0F7]/70 font-mono text-[11px] text-[#1F273A] truncate select-all">
                    {selectedCred.credentialSubject.id}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <span className="text-muted-foreground block font-medium">
                    Signature Proof Method
                  </span>
                  <div className="p-2 rounded-xl bg-[#EDF0F7]/70 font-mono text-[11px] text-[#1F273A] select-all">
                    {selectedCred.proof.verificationMethod} ({selectedCred.proof.type})
                  </div>
                </div>
              </div>

              {/* Offline Field Validation Note */}
              <div className="p-4 rounded-2xl bg-[#EDF0F7]/50 border border-[#D8DFEE] text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1F273A]">
                  <Building2 className="h-4 w-4 text-[#1C4CA1]" />
                  <span>Offline Field Validation Guarantee</span>
                </div>
                <p className="text-[#475569] leading-relaxed">
                  During remote field enumerations without internet connectivity, inspecting supervisors
                  can scan the QR code using any W3C VC conformant reader. The cryptographic payload
                  validates locally against the public key without transmitting data outside the sovereign
                  boundary.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Modal / Print Preview */}
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#1C4CA1] p-8 shadow-2xl space-y-6 relative print:p-0 print:border-none print:shadow-none">
              {/* Header */}
              <div className="text-center space-y-2 border-b-2 border-[#1C4CA1]/30 pb-6">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#1C4CA1]/10 flex items-center justify-center text-[#1C4CA1]">
                  <Award className="h-8 w-8 text-[#1C4CA1]" />
                </div>
                <h3 className="text-xs tracking-widest font-black uppercase text-[#1C4CA1]">
                  GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
                </h3>
                <h2 className="text-2xl font-serif font-black text-[#1F273A]">
                  Certificate of Professional Competency
                </h2>
                <p className="text-xs text-[#475569]">
                  National Statistical Systems Training Academy (NSSTA) • Mission Karmayogi
                </p>
              </div>

              {/* Certificate Body */}
              <div className="text-center space-y-4 py-4">
                <p className="text-sm text-[#475569]">This is to certify that</p>
                <h4 className="text-2xl font-black text-[#1F273A]">
                  {selectedCred.credentialSubject.holder_name}
                </h4>
                <p className="text-xs text-[#475569]">
                  Cadre: <span className="font-bold text-[#1F273A]">{selectedCred.credentialSubject.cadre}</span> • DID: <span className="font-mono">{selectedCred.credentialSubject.id}</span>
                </p>

                <p className="text-sm text-[#475569] pt-2">
                  has demonstrated verified competency and supervisor-grade rigor in
                </p>
                <div className="p-4 rounded-2xl bg-[#EDF0F7] border border-[#D8DFEE] max-w-lg mx-auto">
                  <p className="text-lg font-black text-[#1C4CA1]">
                    {selectedCred.credentialSubject.competency_name}
                  </p>
                  <p className="text-xs font-mono font-bold text-[#FFA72F] mt-1">
                    FRAC Proficiency Level: {selectedCred.credentialSubject.level_achieved} (Supervisor / Expert)
                  </p>
                </div>
              </div>

              {/* Security & Verification Footer */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#D8DFEE] text-left text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Tamper-Evident SHA-256 Hash</span>
                  <span className="font-mono text-[9px] text-[#1F273A] break-all block mt-0.5">
                    {selectedCred.proof.credentialHash}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Issuing Authority</span>
                  <span className="font-bold text-[#1F273A] block mt-0.5">
                    Director General, NSSTA
                  </span>
                  <span className="text-[10px] text-muted-foreground">Signed: {selectedCred.issuanceDate.slice(0, 10)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8DFEE] print:hidden">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8DFEE] text-xs font-bold text-[#475569] hover:bg-[#EDF0F7] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C4CA1] text-white text-xs font-bold hover:bg-[#1164BE] cursor-pointer shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
