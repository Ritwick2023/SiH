import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { BhuvanUFSBlockMap } from './BhuvanUFSBlockMap';

describe('BhuvanUFSBlockMap Component (Task C5)', () => {
  it('renders ISRO Bhuvan satellite interface and CEB-042 badge', () => {
    const html = renderToString(<BhuvanUFSBlockMap />);

    expect(html).toContain('ISRO Bhuvan UFS Block Demarcation');
    expect(html).toContain('CEB-042 (Patna)');
    expect(html).toContain('LISS-IV (5.8m)');
    expect(html).toContain('Cartosat-3');
    expect(html).toContain('Verify Demarcation');
  });

  it('renders SVG satellite map canvas and HUD', () => {
    const html = renderToString(<BhuvanUFSBlockMap />);

    expect(html).toContain('<svg');
    expect(html).toContain('CLICK TO PLACE CORNER BOUNDARY PEGS');
  });
});
