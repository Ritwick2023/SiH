'use client';

import React, { useState } from 'react';
import { Satellite, CheckCircle2, AlertTriangle, RotateCcw, Crosshair, Eye } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  lat: number;
  lng: number;
}

// Reference UFS Block Coordinates (Patna Rural CEB-042 Ground Truth)
const REFERENCE_BOUNDARY: Point[] = [
  { x: 80, y: 60, lat: 25.5975, lng: 85.136 },
  { x: 340, y: 75, lat: 25.5972, lng: 85.141 },
  { x: 310, y: 220, lat: 25.5935, lng: 85.1405 },
  { x: 70, y: 195, lat: 25.5938, lng: 85.1358 },
];

export function BhuvanUFSBlockMap() {
  const [userPoints, setUserPoints] = useState<Point[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [showReference, setShowReference] = useState(true);
  const [satelliteLayer, setSatelliteLayer] = useState<'liss4' | 'cartosat' | 'dem'>('liss4');
  const [lastClickCoords, setLastClickCoords] = useState<{ lat: string; lng: string } | null>(null);

  const canvasWidth = 420;
  const canvasHeight = 280;

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (userPoints.length >= 4 || isVerified) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvasWidth);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvasHeight);

    // Convert canvas coordinates to approximate GPS lat/lng
    const lat = +(25.598 - (y / canvasHeight) * 0.005).toFixed(5);
    const lng = +(85.135 + (x / canvasWidth) * 0.007).toFixed(5);

    setLastClickCoords({ lat: `${lat}° N`, lng: `${lng}° E` });
    setUserPoints((prev) => [...prev, { x, y, lat, lng }]);
  };

  const handleReset = () => {
    setUserPoints([]);
    setIsVerified(false);
    setAccuracyScore(null);
    setLastClickCoords(null);
  };

  const handleVerify = () => {
    if (userPoints.length < 4) return;

    // Compute centroid and vertex distance deviation against reference
    let totalDeviation = 0;
    userPoints.forEach((pt, idx) => {
      const ref = REFERENCE_BOUNDARY[idx];
      const dist = Math.sqrt(Math.pow(pt.x - ref.x, 2) + Math.pow(pt.y - ref.y, 2));
      totalDeviation += dist;
    });

    const avgDeviation = totalDeviation / 4;
    // Score out of 100 with exponential decay on pixel deviation
    const computedScore = Math.max(0, Math.min(100, Math.round(100 - avgDeviation * 1.6)));
    setAccuracyScore(computedScore);
    setIsVerified(true);
  };

  const toSvgPath = (points: Point[]) => {
    if (points.length === 0) return '';
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return points.length > 2 ? `${d} Z` : d;
  };

  return (
    <div className="rounded-3xl bg-white border border-[#EDF0F7] p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#EDF0F7]">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-[#1C4CA1]/10 flex items-center justify-center text-[#1C4CA1] shrink-0">
            <Satellite className="h-5 w-5 text-[#1C4CA1]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1F273A]">
                ISRO Bhuvan UFS Block Demarcation (PRD §15.4)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20">
                CEB-042 (Patna)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Interactive high-resolution satellite boundary training for Census Field Enumerators
            </p>
          </div>
        </div>

        {/* Layer Switcher */}
        <div className="flex items-center gap-1.5 bg-[#EDF0F7] p-1 rounded-xl text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setSatelliteLayer('liss4')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              satelliteLayer === 'liss4' ? 'bg-white text-[#1C4CA1] font-bold shadow-2xs' : 'text-muted-foreground'
            }`}
          >
            LISS-IV (5.8m)
          </button>
          <button
            type="button"
            onClick={() => setSatelliteLayer('cartosat')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              satelliteLayer === 'cartosat' ? 'bg-white text-[#1C4CA1] font-bold shadow-2xs' : 'text-muted-foreground'
            }`}
          >
            Cartosat-3
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="mt-4 relative rounded-2xl overflow-hidden border border-border bg-[#142319] shadow-inner select-none">
        {/* Background Satellite Grid Simulation */}
        <svg
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="w-full h-auto cursor-crosshair block"
          onClick={handleMapClick}
        >
          <defs>
            <radialGradient id="bhuvanTerrain" cx="45%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#1e3223" />
              <stop offset="60%" stopColor="#152419" />
              <stop offset="100%" stopColor="#0d1710" />
            </radialGradient>
            <pattern id="bhuvanGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#253a2b" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Terrain & Grid */}
          <rect width={canvasWidth} height={canvasHeight} fill="url(#bhuvanTerrain)" />
          <rect width={canvasWidth} height={canvasHeight} fill="url(#bhuvanGrid)" />

          {/* Topographical Landmarks (Roads / Canal / Railway) */}
          <path
            d="M 20 120 Q 150 140 400 90"
            stroke="#475569"
            strokeWidth="3"
            strokeDasharray="4 2"
            fill="none"
          />
          <path
            d="M 120 10 Q 140 180 160 270"
            stroke="#334155"
            strokeWidth="2"
            fill="none"
          />

          {/* Ground Truth Reference Boundary */}
          {showReference && (
            <g>
              <path
                d={toSvgPath(REFERENCE_BOUNDARY)}
                fill="#1C4CA1"
                fillOpacity="0.12"
                stroke="#1C4CA1"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              {REFERENCE_BOUNDARY.map((ref, idx) => (
                <circle
                  key={idx}
                  cx={ref.x}
                  cy={ref.y}
                  r="3.5"
                  fill="#1C4CA1"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />
              ))}
            </g>
          )}

          {/* User Demarcation Boundary */}
          {userPoints.length > 0 && (
            <g>
              <path
                d={toSvgPath(userPoints)}
                fill={isVerified ? (accuracyScore && accuracyScore >= 80 ? '#10B981' : '#F59E0B') : '#FFA72F'}
                fillOpacity={isVerified ? 0.25 : 0.15}
                stroke={isVerified ? (accuracyScore && accuracyScore >= 80 ? '#10B981' : '#F59E0B') : '#FFA72F'}
                strokeWidth="2.5"
              />
              {userPoints.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#FFA72F"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pt.x + 8}
                    y={pt.y + 4}
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    P{idx + 1}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>

        {/* Live Coordinates HUD Overlay */}
        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-2">
          <Crosshair className="h-3 w-3 animate-pulse" />
          <span>
            {lastClickCoords
              ? `${lastClickCoords.lat}, ${lastClickCoords.lng}`
              : 'CLICK TO PLACE CORNER BOUNDARY PEGS (4 REQ)'}
          </span>
        </div>

        {/* Reference Boundary Toggle Pill */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowReference(!showReference)}
            className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] text-white flex items-center gap-1 hover:bg-black/80 transition-colors cursor-pointer"
          >
            <Eye className="h-3 w-3 text-[#1C4CA1]" />
            <span>{showReference ? 'Hide Ground Truth' : 'Show Ground Truth'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar & Verification Status */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EDF0F7]">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#1F273A]">
            Pegs Placed: {userPoints.length}/4
          </span>
          {userPoints.length < 4 && (
            <span className="text-muted-foreground text-[11px]">
              (Place NW, NE, SE, SW corners to enclose UFS block)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#D8DFEE] bg-[#EDF0F7] hover:bg-[#D8DFEE]/60 text-xs font-bold text-[#1F273A] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Pegs</span>
          </button>

          <button
            type="button"
            onClick={handleVerify}
            disabled={userPoints.length < 4 || isVerified}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1C4CA1] hover:bg-[#153a7a] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verify Demarcation</span>
          </button>
        </div>
      </div>

      {/* Evaluation Results Banner */}
      {isVerified && accuracyScore !== null && (
        <div
          className={`mt-3 p-3.5 rounded-2xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
            accuracyScore >= 80
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {accuracyScore >= 80 ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {accuracyScore >= 80
                  ? `Demarcation Certified (${accuracyScore}% Ground Truth Alignment)`
                  : `Boundary Discrepancy (${accuracyScore}% Alignment)`}
              </span>
              <span className="text-[11px] opacity-85">
                {accuracyScore >= 80
                  ? 'Complies with Mission Karmayogi FRAC Level 4 (Census Boundary Demarcation & Listing) standards.'
                  : 'Marginal overlap detected on boundary edges. Re-adjust pegs within 15m ground tolerance.'}
              </span>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-xl font-mono font-black text-sm ${
              accuracyScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {accuracyScore >= 80 ? 'L4 PASS' : 'RETRY'}
          </span>
        </div>
      )}
    </div>
  );
}
