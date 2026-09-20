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

  it('renders cadre tags to clarify role ownership for competencies and pages', () => {
    const html = renderToString(<GlobalSearchModal isOpen={true} onClose={() => {}} isHindi={false} />);
    expect(html).toContain('Field Investigator');
    expect(html).toContain('JSO Cadre');
    expect(html).toContain('NSSTA Faculty');
    expect(html).toContain('MoSPI HQ Command');
  });
});
