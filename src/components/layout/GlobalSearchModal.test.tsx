import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { GlobalSearchModal } from './GlobalSearchModal';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('GlobalSearchModal Component', () => {
  it('does not render when isOpen is false', () => {
    const html = renderToString(<GlobalSearchModal isOpen={false} onClose={() => {}} />);
    expect(html).toBe('');
  });

  it('renders search input, category filters, and popular shortcuts when isOpen is true', () => {
    const html = renderToString(<GlobalSearchModal isOpen={true} onClose={() => {}} />);
    expect(html).toContain('Search competencies, manuals, questions, or pages...');
    expect(html).toContain('Competencies');
    expect(html).toContain('Field Manuals');
    expect(html).toContain('CAPI Tablet Operation');
    expect(html).toContain('PLFS Manual');
    expect(html).toContain('ESC');
  });

  it('renders Hindi labels when isHindi is true', () => {
    const html = renderToString(<GlobalSearchModal isOpen={true} onClose={() => {}} isHindi={true} />);
    expect(html).toContain('दक्षताएं, फील्ड मैनुअल, प्रश्न या पेज खोजें...');
    expect(html).toContain('दक्षताएं (FRAC)');
    expect(html).toContain('फील्ड मैनुअल');
    expect(html).toContain('CAPI टैबलेट संचालन एवं फील्ड सिंक');
    expect(html).toContain('फील्ड अन्वेषक');
  });

  it('renders cadre tags to clarify role ownership for competencies and pages when unconstrained', () => {
    const html = renderToString(<GlobalSearchModal isOpen={true} onClose={() => {}} isHindi={false} />);
    expect(html).toContain('Field Investigator');
    expect(html).toContain('JSO Cadre');
    expect(html).toContain('NSSTA Faculty');
    expect(html).toContain('MoSPI HQ Command');
  });

  it('restricts search results to learner-relevant items when userRole is learner', () => {
    const html = renderToString(
      <GlobalSearchModal isOpen={true} onClose={() => {}} userRole="learner" userCadre="Field Operations Division (FOD)" />
    );
    expect(html).toContain('CAPI Tablet Operation');
    expect(html).toContain('PLFS Manual');
    // Learner must NOT see trainer or admin-exclusive items
    expect(html).not.toContain('Faculty Question Review Queue');
    expect(html).not.toContain('Department Analytics & Outcomes Correlation');
    expect(html).not.toContain('NSSTA Faculty');
    expect(html).not.toContain('MoSPI HQ Command');
  });

  it('includes review queue and faculty tools when userRole is trainer', () => {
    const html = renderToString(
      <GlobalSearchModal isOpen={true} onClose={() => {}} userRole="trainer" />
    );
    expect(html).toContain('Faculty Question Review Queue');
    expect(html).toContain('NSSTA Faculty');
    // Trainer must NOT see admin-exclusive analytics
    expect(html).not.toContain('Department Analytics & Outcomes Correlation');
  });

  it('includes administrative intelligence items when userRole is admin', () => {
    const html = renderToString(
      <GlobalSearchModal isOpen={true} onClose={() => {}} userRole="admin" />
    );
    expect(html).toContain('Department Analytics');
    expect(html).toContain('MoSPI HQ Command');
  });
});
