import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import LearnerDashboard from './LearnerDashboard';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('LearnerDashboard Component', () => {
  const mockUserAmit = {
    id: 'demo-amit',
    email: 'amit.sharma@mospi.gov.in',
    user_metadata: {
      name: 'Amit Sharma',
      designation: 'Junior Statistical Officer',
      cadre: 'Subordinate Statistical Service (SSS)',
      preferred_language: 'en',
    },
    app_metadata: {
      role: 'learner',
    },
  };

  const mockUserSunita = {
    id: 'demo-sunita',
    email: 'sunita.devi@nsso.gov.in',
    user_metadata: {
      name: 'Sunita Devi',
      designation: 'Field Investigator',
      cadre: 'NSSO Field Operations Division',
      preferred_language: 'hi',
    },
    app_metadata: {
      role: 'learner',
    },
  };

  it('renders learner greeting for Amit Sharma', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Amit');
  });

  it('renders progress summary and recommended course strip', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Your Overall Progress');
    expect(html).toContain('Next Recommended Course');
  });

  it('renders FRAC priority competency gaps with activities and provenance', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Skills That Need Improvement');
  });

  it('renders Hindi strings and CAPI offline status for Sunita Devi', () => {
    const html = renderToString(<LearnerDashboard user={mockUserSunita} />);
    expect(html).toContain('Sunita');
    expect(html).toContain('आपकी कुल प्रगति');
  });

  it('renders the official MoSPI field manuals shelf and courses table', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Reference Documents');
    expect(html).toContain('My Courses');
  });

  it('renders workspace sections and practice drills deck', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Practice Quizzes');
    expect(html).toContain('Government Training Courses');
    expect(html).toContain('Reference Documents');
  });
});
