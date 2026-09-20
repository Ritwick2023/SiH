import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { FracSunburstHierarchy } from './FracSunburstHierarchy';

describe('FracSunburstHierarchy Component', () => {
  it('renders sunburst chart container and title successfully', () => {
    const html = renderToString(<FracSunburstHierarchy />);

    expect(html).toContain('Mission Karmayogi FRAC Competency Sunburst');
    expect(html).toContain('Interactive multi-cadre hierarchy');
    expect(html).toContain('Zoomable');
    expect(html).toContain('Hover or click any segment to inspect details');
    expect(html).toContain('<svg');
  });
});
