import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import LoginForm from './LoginForm';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock next-intl with en and hi dictionaries
const enTranslations: Record<string, string> = {
  goBack: 'Go Back',
  welcomeBack: 'Welcome Back',
  emailLogin: 'Email Login',
  otpLogin: 'OTP Login',
  useOtpInstead: 'Use OTP Login instead',
  useEmailInstead: 'Use Email Login instead',
  emailAddress: 'Email Address',
  continue: 'Continue',
  phoneOrEmail: 'Email / Mobile number',
  requestOtp: 'Request OTP',
  registerHere: 'Register here',
  noAccount: "Don't have an account?",
  password: 'Password',
  captcha: 'Security Captcha',
  captchaPlaceholder: 'Enter text',
  refreshCaptcha: 'Refresh Captcha',
  forgotPassword: 'Forgot password?',
  signIn: 'Sign In',
};

const currentLocale = 'en';
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => enTranslations[key] || key,
  useLocale: () => currentLocale,
}));

describe('LoginForm Component & UX', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders exactly one Go Back button and NO redundant X or Home navigation buttons', () => {
    const html = renderToString(<LoginForm />);

    // Must contain Go Back button
    expect(html).toContain('Go Back');

    // Must NOT contain redundant Home link or X close button
    expect(html).not.toContain('>Home<');
    expect(html).not.toContain('title="Go to Home"');
    expect(html).not.toContain('title="Close and go back"');
  });

  it('defaults to Email Login as primary authentication method with Password and Captcha fields', () => {
    const html = renderToString(<LoginForm />);

    // Email Login must be prominent
    expect(html).toContain('Email Login');
    expect(html).toContain('Email Address');
    expect(html).toContain('type="email"');

    // Password field must be present
    expect(html).toContain('Password');
    expect(html).toContain('type="password"');

    // Security Captcha must be present
    expect(html).toContain('Security Captcha');
    expect(html).toContain('7K9P2');

    // Must have secondary switch option to OTP
    expect(html).toContain('Use OTP Login instead');
  });

  it('preserves Parichay and fast-track evaluator persona credentials', () => {
    const html = renderToString(<LoginForm />);

    expect(html).toContain('Parichay SSO (NIC)');
    expect(html).toContain('MoSPI Intranet SSO');
    expect(html).toContain('Sunita Devi');
    expect(html).toContain('Amit Sharma');
    expect(html).toContain('Dr. Priya');
    expect(html).toContain('Rajesh Kumar');
  });
});
