import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ParichayLoginButton } from './ParichayLoginButton';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('ParichayLoginButton Component (Task C3)', () => {
  it('renders Jan-Parichay SSO button and Gov ID badge', () => {
    const html = renderToString(<ParichayLoginButton />);

    expect(html).toContain('Jan-Parichay SSO');
    expect(html).toContain('Gov ID');
    expect(html).toContain('button');
  });
});
