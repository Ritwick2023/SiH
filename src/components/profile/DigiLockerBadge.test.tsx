import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DigiLockerBadge } from './DigiLockerBadge';

describe('DigiLockerBadge Component (Task C4)', () => {
  it('renders DigiLocker Verifiable Credential badge with L4+ status', () => {
    const html = renderToString(<DigiLockerBadge />);

    expect(html).toContain('DigiLocker Verifiable Credential');
    expect(html).toContain('Verified L4+');
    expect(html).toContain('Census Boundary Demarcation &amp; Listing');
    expect(html).toContain('SHA-256 Tamper Proof Hash');
    expect(html).toContain('JSON-LD');
  });
});
