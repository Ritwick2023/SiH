import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HlsVideoPlayer } from './HlsVideoPlayer';

describe('HlsVideoPlayer Component (Task D2)', () => {
  it('renders HLS video player with controls and adaptive quality indicator', () => {
    const html = renderToString(
      <HlsVideoPlayer
        title="NSS 78th Round Listing Training"
        courseId="c-1"
        competencyId="comp-1"
      />
    );

    expect(html).toContain('<video');
    expect(html).toContain('Auto (Adaptive)');
    expect(html).toContain('Play Video');
    expect(html).toContain('button');
  });
});
