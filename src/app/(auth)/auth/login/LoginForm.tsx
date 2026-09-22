'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  ShieldCheck, 
  RefreshCw, 
  KeyRound, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  UserCheck 
} from 'lucide-react';
import { KarmayogiHorizontalLogo, KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';
import { ParichayLoginButton } from '@/components/auth/ParichayLoginButton';
import { getDemoPersonaByEmail } from '@/lib/demoPersonas';

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslations('auth');

  // Auth Mode: 'email' (default) | 'otp' (secondary)
  const [authMode, setAuthMode] = useState<'email' | 'otp'>('email');

  // Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7K9P2');

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput('');
  };

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpInfoMessage, setOtpInfoMessage] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Handle Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError(t('phoneOrEmail') + ' is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', identifier: identifier.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to dispatch OTP');
        return;
      }

      setOtpSent(true);
      setOtpInfoMessage(data.message || 'OTP dispatched to registered credentials');
      setOtpValue(data.demoOtp || '123456');
    } catch {
      setError('Network error connecting to official authentication service');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue.trim()) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          identifier: identifier.trim(),
          otp: otpValue.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid OTP');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Failed to complete verification');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Email Login (Requires Email, Password & Captcha)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = identifier.trim().toLowerCase();
    if (!cleanEmail) {
      setError(t('emailAddress') + ' is required');
      return;
    }
    if (!password.trim()) {
      setError(t('enterPasswordError'));
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setError(t('invalidCaptcha'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const matched = getDemoPersonaByEmail(cleanEmail);
      let emailToUse = cleanEmail;
      if (matched) {
        emailToUse = matched.email;
      } else if (cleanEmail.includes('sunita')) {
        emailToUse = 'sunita.devi@nsso.gov.in';
      } else if (cleanEmail.includes('priya')) {
        emailToUse = 'priya.verma@nssta.gov.in';
      } else if (cleanEmail.includes('rajesh')) {
        emailToUse = 'rajesh.kumar@mospi.gov.in';
      } else {
        emailToUse = 'amit.sharma@mospi.gov.in';
      }

      router.push(`/api/sso/demo-persona?email=${encodeURIComponent(emailToUse)}`);
    } catch {
      setError(t('error') || 'Authentication failed');
      setLoading(false);
    }
  };

  // 4. Parichay SSO Login Simulation
  const handleParichaySignIn = (personaEmail: string) => {
    setLoading(true);
    router.push(`/api/sso/parichay?email=${encodeURIComponent(personaEmail)}`);
  };

  // 5. Consolidated single Go Back handler: navigate back to portal home (/)
  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="w-full flex flex-col justify-between h-full">
      <div>
        {/* Top Navigation Row: Single Go Back Button + MoSPI Emblem Pill (No redundant Home or X) */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D8DFEE] bg-white hover:bg-[#EDF0F7] text-xs font-semibold text-[#1F273A] shadow-2xs transition-all hover:scale-102 active:scale-98 group cursor-pointer"
              title="Go back to previous page"
              aria-label={t('goBack')}
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#1C4CA1] group-hover:-translate-x-0.5 transition-transform" />
              <span>{t('goBack')}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D8DFEE] bg-white/80 backdrop-blur-xs text-[11px] font-semibold text-[#1C4CA1] shadow-2xs">
              <KarmayogiEmblemIcon className="h-4 w-4" />
              <span>MoSPI • NSSTA</span>
            </div>
          </div>
        </div>

        {/* Official Karmayogi Bharat Horizontal Logo Lockup */}
        <div className="mb-4">
          <KarmayogiHorizontalLogo className="h-10 sm:h-12 w-auto" />
        </div>

        {/* Editorial Heading */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F273A] tracking-tight font-sans">
            {t('welcomeBack')}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Sign in with government-approved credentials or Parichay SSO
          </p>
        </div>

        {/* Pill Mode Switcher (Email Login default, OTP Login secondary) */}
        <div className="inline-flex p-1 rounded-full bg-[#EDF0F7] border border-[#D8DFEE] mb-6 w-full max-w-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode('email');
              setError('');
              setOtpSent(false);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all text-center cursor-pointer ${
              authMode === 'email'
                ? 'bg-white text-[#1C4CA1] shadow-sm'
                : 'text-muted-foreground hover:text-[#1F273A]'
            }`}
          >
            {t('emailLogin')}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all text-center cursor-pointer ${
              authMode === 'otp'
                ? 'bg-white text-[#1C4CA1] shadow-sm'
                : 'text-muted-foreground hover:text-[#1F273A]'
            }`}
          >
            {t('otpLogin')}
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE A: EMAIL LOGIN (DEFAULT PRIMARY METHOD)                              */}
        {/* ========================================================================= */}
        {authMode === 'email' && (
          <div className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1F273A] mb-1.5 ml-1">
                  {t('emailAddress')}
                </label>
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@mospi.gov.in"
                  className="w-full h-12 px-5 rounded-2xl bg-white border border-[#D8DFEE] text-sm text-[#1F273A] placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-[#1C4CA1] focus:outline-none transition shadow-xs"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="text-xs font-semibold text-[#1F273A]">
                    {t('password')}
                  </label>
                  <a
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Please contact your Nodal Administrator or MoSPI IT Helpdesk (1800-111-555) to reset your password.');
                    }}
                    className="text-[11px] text-[#1C4CA1] hover:underline"
                  >
                    {t('forgotPassword')}
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-5 rounded-2xl bg-white border border-[#D8DFEE] text-sm text-[#1F273A] placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-[#1C4CA1] focus:outline-none transition shadow-xs"
                  required
                />
              </div>

              {/* Captcha */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-[#1F273A] mb-1.5 ml-1">
                  {t('captcha')}
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-11 px-4 bg-[#EDF0F7] border border-[#D8DFEE] rounded-2xl flex items-center justify-center font-mono text-base font-bold tracking-widest text-[#1F273A] select-none shadow-inner">
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="h-11 w-11 border border-[#D8DFEE] rounded-2xl flex items-center justify-center text-[#1C4CA1] hover:bg-[#EDF0F7] transition-colors cursor-pointer"
                    title={t('refreshCaptcha')}
                    aria-label={t('refreshCaptcha')}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    placeholder={t('captchaPlaceholder')}
                    maxLength={5}
                    className="flex-1 h-11 px-4 text-sm border border-[#D8DFEE] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1C4CA1] uppercase tracking-wider bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#1C4CA1] hover:bg-[#1164BE] active:scale-[0.99] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{t('signIn')}...</span>
                  </span>
                ) : (
                  <>
                    <span>{t('signIn')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Secondary Option Switcher: Use OTP Login instead */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('otp');
                  setError('');
                }}
                className="w-full py-2.5 px-4 rounded-full border border-[#D8DFEE] bg-white hover:bg-[#EDF0F7] text-xs font-semibold text-[#1C4CA1] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>{t('useOtpInstead')}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE B: OTP LOGIN (SECONDARY OPTION)                                      */}
        {/* ========================================================================= */}
        {authMode === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#1F273A] mb-1.5 ml-1">
                    {t('phoneOrEmail')}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Mobile number or you@mospi.gov.in"
                    className="w-full h-12 px-5 rounded-2xl bg-white border border-[#D8DFEE] text-sm text-[#1F273A] placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-[#1C4CA1] focus:outline-none transition shadow-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#1C4CA1] hover:bg-[#1164BE] active:scale-[0.99] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{t('requestingOtp')}</span>
                    </span>
                  ) : (
                    <>
                      <span>{t('requestOtp')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 bg-white p-5 rounded-2xl border border-[#D8DFEE] shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1C4CA1] flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>{t('enterOtp')}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-muted-foreground hover:text-[#1F273A] text-[11px] underline"
                  >
                    {t('change')}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {otpInfoMessage}
                </p>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="123456"
                    className="w-full h-12 tracking-[0.4em] text-center font-mono text-lg font-bold border border-[#D8DFEE] rounded-2xl bg-white text-[#1F273A] focus:outline-none focus:ring-2 focus:ring-[#1C4CA1]"
                    required
                  />
                  <div className="flex items-center justify-between mt-1.5 text-[11px]">
                    <span className="text-emerald-700 font-medium">Demo Auto-Fill: 123456</span>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      className="text-[#1C4CA1] hover:underline font-semibold"
                    >
                      {t('resendCode')}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#1C4CA1] hover:bg-[#1164BE] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Verifying...' : t('verifyAndProceed')}
                </button>
              </form>
            )}

            {/* Switch back to Email Login */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('email');
                  setError('');
                  setOtpSent(false);
                }}
                className="w-full py-2.5 px-4 rounded-full border border-[#D8DFEE] bg-white hover:bg-[#EDF0F7] text-xs font-semibold text-[#1C4CA1] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t('useEmailInstead')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D8DFEE]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-muted-foreground font-medium">{t('orContinueWith')}</span>
          </div>
        </div>

        {/* Jan-Parichay / MeriPehchaan Official SSO Button */}
        <div className="mb-3">
          <ParichayLoginButton />
        </div>

        {/* Pill Provider Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleParichaySignIn('sunita.devi@nsso.gov.in')}
            className="h-11 px-4 rounded-full border border-[#D8DFEE] bg-white hover:bg-[#EDF0F7] text-[#1F273A] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors group cursor-pointer"
          >
            <div className="h-5 w-5 rounded-full bg-[#FFA72F] flex items-center justify-center text-white shrink-0 text-[10px]">
              <KeyRound className="h-3 w-3" />
            </div>
            <span>Parichay SSO (NIC)</span>
          </button>

          <button
            type="button"
            onClick={() => handleParichaySignIn('amit.sharma@mospi.gov.in')}
            className="h-11 px-4 rounded-full border border-[#D8DFEE] bg-white hover:bg-[#EDF0F7] text-[#1F273A] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors group cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-[#1C4CA1]" />
            <span>MoSPI Intranet SSO</span>
          </button>
        </div>

        {/* SIH 26101 EVALUATOR 1-CLICK PERSONA CHIPS */}
        <div className="mt-6 pt-4 border-t border-dashed border-[#D8DFEE]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-[#1C4CA1] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#1C4CA1]" />
              <span>SIH Evaluator Fast-Track:</span>
            </span>
            <span className="text-[10px] text-muted-foreground">1-click role test</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <a
              href="/api/sso/demo-persona?email=sunita.devi%40nsso.gov.in&lang=hi"
              className="p-2 rounded-xl bg-white border border-[#D8DFEE] hover:border-[#1C4CA1] hover:bg-[#EDF0F7] transition-all text-center group shadow-2xs"
            >
              <div className="h-6 w-6 rounded-full bg-[#1C4CA1] text-white flex items-center justify-center mx-auto text-[9px] font-bold">
                SD
              </div>
              <p className="text-[11px] font-bold text-[#1F273A] mt-1 group-hover:text-[#1C4CA1] truncate">
                Sunita Devi
              </p>
              <p className="text-[9px] text-muted-foreground truncate">NSSO (Hindi)</p>
            </a>

            <a
              href="/api/sso/demo-persona?email=amit.sharma%40mospi.gov.in&lang=en"
              className="p-2 rounded-xl bg-white border border-[#D8DFEE] hover:border-[#1C4CA1] hover:bg-[#EDF0F7] transition-all text-center group shadow-2xs"
            >
              <div className="h-6 w-6 rounded-full bg-[#1164BE] text-white flex items-center justify-center mx-auto text-[9px] font-bold">
                AS
              </div>
              <p className="text-[11px] font-bold text-[#1F273A] mt-1 group-hover:text-[#1C4CA1] truncate">
                Amit Sharma
              </p>
              <p className="text-[9px] text-muted-foreground truncate">SSS JSO</p>
            </a>

            <a
              href="/api/sso/demo-persona?email=priya.verma%40nssta.gov.in&lang=en"
              className="p-2 rounded-xl bg-white border border-[#D8DFEE] hover:border-[#1C4CA1] hover:bg-[#EDF0F7] transition-all text-center group shadow-2xs"
            >
              <div className="h-6 w-6 rounded-full bg-[#FFA72F] text-white flex items-center justify-center mx-auto text-[9px] font-bold">
                PV
              </div>
              <p className="text-[11px] font-bold text-[#1F273A] mt-1 group-hover:text-[#1C4CA1] truncate">
                Dr. Priya
              </p>
              <p className="text-[9px] text-muted-foreground truncate">NSSTA Faculty</p>
            </a>

            <a
              href="/api/sso/demo-persona?email=rajesh.kumar%40mospi.gov.in&lang=en"
              className="p-2 rounded-xl bg-white border border-[#D8DFEE] hover:border-[#1C4CA1] hover:bg-[#EDF0F7] transition-all text-center group shadow-2xs"
            >
              <div className="h-6 w-6 rounded-full bg-[#1F273A] text-white flex items-center justify-center mx-auto text-[9px] font-bold">
                RK
              </div>
              <p className="text-[11px] font-bold text-[#1F273A] mt-1 group-hover:text-[#1C4CA1] truncate">
                Rajesh Kumar
              </p>
              <p className="text-[9px] text-muted-foreground truncate">Director</p>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-[#D8DFEE] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>
          {t('noAccount')}{' '}
          <Link href="/auth/signup" className="font-bold text-[#1C4CA1] hover:underline">
            {t('registerHere')}
          </Link>
        </p>

        <a href="#help" onClick={(e) => { e.preventDefault(); alert("Ministry of Statistics & Programme Implementation (MoSPI) Helpline: 1800-111-555"); }} className="text-[11px] text-muted-foreground hover:underline">
          {t('nodalHelpdesk')}
        </a>
      </div>
    </div>
  );
}
