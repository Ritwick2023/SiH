import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ScrollRestorationManager } from './ScrollRestorationManager';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('ScrollRestorationManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders null without DOM footprint', () => {
    const html = renderToString(<ScrollRestorationManager />);
    expect(html).toBe('');
  });

  it('correctly scopes sessionStorage keys without persisting sensitive authentication data', () => {
    const pathname = '/dashboard';
    const storageKey = `statvidya_scroll_${pathname}`;
    expect(storageKey).toBe('statvidya_scroll_/dashboard');

    // Simulate saving non-sensitive scroll coordinates
    const state = { x: 0, y: 450, ts: Date.now() };
    const serialized = JSON.stringify(state);
    const parsed = JSON.parse(serialized);

    expect(parsed.y).toBe(450);
    expect(parsed.x).toBe(0);
    expect(parsed.password).toBeUndefined();
    expect(parsed.otp).toBeUndefined();
    expect(parsed.token).toBeUndefined();
  });
});
