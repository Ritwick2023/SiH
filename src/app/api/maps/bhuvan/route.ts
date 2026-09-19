import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * ISRO Bhuvan WMS Satellite Tile Proxy (PRD §15.4 & Task C5)
 * Proxies Bhuvan tile requests server-side to resolve browser CORS limitations
 * and provides instant SVG fallback tiles if remote NRSC servers are unreachable.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bbox = searchParams.get('bbox') || '85.130,25.590,85.145,25.605';
  const width = parseInt(searchParams.get('width') || '256', 10);
  const height = parseInt(searchParams.get('height') || '256', 10);
  const layer = searchParams.get('layer') || 'bhuvan:india_satellite';

  const bhuvanWmsUrl = process.env.BHUVAN_WMS_URL || 'https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const remoteUrl = new URL(bhuvanWmsUrl);
    remoteUrl.searchParams.set('SERVICE', 'WMS');
    remoteUrl.searchParams.set('VERSION', '1.1.1');
    remoteUrl.searchParams.set('REQUEST', 'GetMap');
    remoteUrl.searchParams.set('LAYERS', layer);
    remoteUrl.searchParams.set('SRS', 'EPSG:4326');
    remoteUrl.searchParams.set('BBOX', bbox);
    remoteUrl.searchParams.set('WIDTH', width.toString());
    remoteUrl.searchParams.set('HEIGHT', height.toString());
    remoteUrl.searchParams.set('FORMAT', 'image/png');

    const res = await fetch(remoteUrl.toString(), {
      headers: {
        Referer: 'https://bhuvan.nrsc.gov.in',
        Origin: 'https://bhuvan.nrsc.gov.in',
        'User-Agent': 'StatVidya-MoSPI-Training-Station/2.0',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok && res.headers.get('content-type')?.includes('image')) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': res.headers.get('content-type') || 'image/png',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        },
      });
    }
  } catch {
    // Graceful fallback to synthetic high-contrast satellite tile
  }

  // Generate synthetic satellite grid SVG tile with terrain styling
  const svgTile = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="terrainGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#243729" />
          <stop offset="50%" stop-color="#1b281f" />
          <stop offset="100%" stop-color="#121b15" />
        </radialGradient>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#2d4233" stroke-width="0.8" />
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#terrainGrad)" />
      <rect width="${width}" height="${height}" fill="url(#grid)" />
      <circle cx="${width / 2}" cy="${height / 2}" r="3" fill="#FFA72F" />
      <text x="${width / 2}" y="${height / 2 + 16}" font-family="monospace" font-size="9" fill="#94A3B8" text-anchor="middle">
        ISRO BHUVAN LISS-4
      </text>
      <text x="${width / 2}" y="${height / 2 + 28}" font-family="monospace" font-size="8" fill="#64748B" text-anchor="middle">
        ${bbox.split(',').slice(0, 2).join(', ')}
      </text>
    </svg>
  `.trim();

  return new NextResponse(svgTile, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
