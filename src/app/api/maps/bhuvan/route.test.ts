import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as bhuvanProxy } from './route';

describe('ISRO Bhuvan WMS Proxy API (Task C5)', () => {
  it('returns SVG satellite fallback tile on proxy request', async () => {
    const req = new NextRequest('http://localhost:3000/api/maps/bhuvan?bbox=85.130,25.590,85.145,25.605&width=256&height=256');
    const res = await bhuvanProxy(req);

    expect(res.status).toBe(200);
    const contentType = res.headers.get('content-type');
    expect(contentType).toMatch(/(image\/svg\+xml|image\/png)/);

    if (contentType?.includes('svg')) {
      const text = await res.text();
      expect(text).toContain('ISRO BHUVAN');
    }
  });
});
