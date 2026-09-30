import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Sidebar } from './Sidebar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'nav.dashboard': 'Dashboard & Readiness',
      'nav.skillGap': 'FRAC Competency Gaps',
      'nav.assessment': 'Field & Desk Drills',
      'nav.quiz': 'Practice Quiz & MCQs',
      'nav.pathways': 'Karmayogi Pathways',
      'nav.profile': 'Official Cadre Profile',
      'nav.documents': 'MoSPI Manuals & Ingestion',
      'nav.mcqGenerator': 'AI Question Studio',
      'nav.reviewQueue': 'QA Triage Queue',
      'nav.facultyCommandDesk': 'Faculty Command Desk',
      'nav.traineeErrorAnalytics': 'Trainee Error Analytics',
      'nav.workforceCommand': 'Workforce Command',
      'nav.scrutinyCorrelation': 'Scrutiny Correlation',
      'nav.regionalOfficeHealth': 'Regional Office Health',
      'nav.nationalCompetencyMatrix': 'National Competency Matrix',
      'nav.statutoryAssessmentAudit': 'Statutory Assessment Audit',
    };
    return map[key] || key;
  },
  useLocale: () => 'en',
}));

describe('Sidebar Component', () => {
  it('renders default learner sidebar with cadre information, quiz, documents, and learning links', () => {
    const html = renderToString(<Sidebar initialRole="learner" />);
    expect(html).toContain('FRAC Competency Gaps');
    expect(html).toContain('Field &amp; Desk Drills');
    expect(html).toContain('Practice Quiz &amp; MCQs');
    expect(html).toContain('MoSPI Manuals &amp; Ingestion');
    expect(html).toContain('Karmayogi Pathways');

    // Should NOT contain faculty QA triage tools
    expect(html).not.toContain('QA Triage Queue');
  });

  it('renders trainer sidebar with NSSTA Faculty identity and QA tools', () => {
    const html = renderToString(<Sidebar initialRole="trainer" />);
    expect(html).toContain('NSSTA Faculty');
    expect(html).toContain('QA Triage Queue');
    expect(html).toContain('AI Question Studio');
    expect(html).toContain('MoSPI Manuals');

    // Should NOT contain learner pathways
    expect(html).not.toContain('Karmayogi Pathways');
  });

  it('renders admin sidebar with Executive Command identity and governance tools', () => {
    const html = renderToString(<Sidebar initialRole="admin" />);
    expect(html).toContain('Executive Command');
    expect(html).toContain('Workforce Command');
    expect(html).toContain('Regional Office Health');

    // Should NOT contain trainer creation tools
    expect(html).not.toContain('AI Question Studio');
  });

  it('renders with auto-collapse rail by default and supports mouse interaction', () => {
    const html = renderToString(<Sidebar initialRole="learner" />);
    // Verify rail spacer and main navigation aside exist
    expect(html).toContain('Sidebar Navigation');
    expect(html).toContain('md:w-18');
    expect(html).toContain('Auto-expand');
    expect(html).toContain('Pin sidebar open');
  });

  it('expands on mouseenter and collapses on mouseleave in DOM environment', async () => {
    // @ts-expect-error test flag
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    const { createRoot } = await import('react-dom/client');
    const { act } = await import('react');
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<Sidebar initialRole="learner" />);
    });

    const aside = container.querySelector('aside[aria-label="Sidebar Navigation"]');
    expect(aside).not.toBeNull();
    // Initially collapsed (md:w-18)
    expect(aside?.className).toContain('md:w-18');

    // Trigger mouse enter via mouseenter and mouseover
    await act(async () => {
      aside?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }));
      aside?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
    });

    // Now expanded (md:w-64)
    expect(aside?.className).toContain('md:w-64');

    // Trigger mouse leave
    await act(async () => {
      aside?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false, cancelable: true }));
      aside?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    // Now collapsed back to md:w-18
    expect(aside?.className).toContain('md:w-18');

    // Click pin button to pin open
    const pinBtn = container.querySelector('button[title*="Pin sidebar open"]') as HTMLButtonElement | null;
    expect(pinBtn).not.toBeNull();
    await act(async () => {
      pinBtn?.click();
    });

    // When pinned, it is expanded even when mouse is not hovering
    expect(aside?.className).toContain('md:w-64');

    root.unmount();
    container.remove();
  });
});

