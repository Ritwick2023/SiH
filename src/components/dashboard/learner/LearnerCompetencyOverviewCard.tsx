'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface LearnerCompetencyOverviewCardProps {
  isHindi?: boolean;
}

export function LearnerCompetencyOverviewCard({ isHindi = false }: LearnerCompetencyOverviewCardProps) {
  const cardTitle = isHindi ? 'आपकी योग्यता का अवलोकन' : 'Your Competency Overview';
  const viewDetailsText = isHindi ? 'विवरण देखें →' : 'View Details →';
  const yourProficiencyText = isHindi ? 'आपकी दक्षता' : 'Your Proficiency';
  const expectedProficiencyText = isHindi ? 'अपेक्षित दक्षता' : 'Expected Proficiency';

  // 5 Axes matching the screenshot:
  // 1: Top: Data Analysis
  // 2: Top-Right: Statistical Methods
  // 3: Bottom-Right: Communication
  // 4: Bottom-Left: Policy Understanding
  // 5: Top-Left: Data Management
  const axes = [
    { label: isHindi ? 'डेटा विश्लेषण' : 'Data Analysis', angle: -Math.PI / 2 },
    { label: isHindi ? 'सांख्यिकीय विधियाँ' : 'Statistical Methods', angle: -Math.PI / 2 + (2 * Math.PI) / 5 },
    { label: isHindi ? 'संचार' : 'Communication', angle: -Math.PI / 2 + (4 * Math.PI) / 5 },
    { label: isHindi ? 'नीति समझ' : 'Policy Understanding', angle: -Math.PI / 2 + (6 * Math.PI) / 5 },
    { label: isHindi ? 'डेटा प्रबंधन' : 'Data Management', angle: -Math.PI / 2 + (8 * Math.PI) / 5 },
  ];

  // SVG Geometry
  const width = 360;
  const height = 240;
  const cx = width / 2;
  const cy = height / 2 + 5;
  const r = 80;

  // Grid levels (3 concentric pentagons)
  const gridLevels = [0.33, 0.66, 1.0];

  const getCoordinates = (valueNormalized: number, angle: number) => {
    const dist = valueNormalized * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  };

  // Values matching the visual in screenshot:
  // Your Proficiency: blue [Data Analysis: 0.85, Stat Methods: 0.70, Comm: 0.80, Policy: 0.60, Data Mgmt: 0.65]
  const yourValues = [0.85, 0.72, 0.82, 0.60, 0.68];
  // Expected Proficiency: orange [Data Analysis: 0.95, Stat Methods: 0.90, Comm: 0.85, Policy: 0.80, Data Mgmt: 0.88]
  const expectedValues = [0.95, 0.90, 0.85, 0.80, 0.88];

  const yourPolygon = yourValues
    .map((v, i) => {
      const { x, y } = getCoordinates(v, axes[i].angle);
      return `${x},${y}`;
    })
    .join(' ');

  const expectedPolygon = expectedValues
    .map((v, i) => {
      const { x, y } = getCoordinates(v, axes[i].angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-2xl bg-white border border-[#D8DFEE] p-5 shadow-xs flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <h2 className="font-extrabold text-base text-[#1F273A] tracking-tight">
          {cardTitle}
        </h2>
        <Link
          href="/skill-gap"
          prefetch={true}
          className="text-xs font-bold text-[#1C4CA1] hover:text-[#1164BE] hover:underline transition-colors flex items-center gap-1"
        >
          {viewDetailsText}
        </Link>
      </div>

      <span className="sr-only">Skills That Need Improvement</span>

      {/* SVG Spider Chart */}
      <div className="relative flex items-center justify-center w-full overflow-visible py-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[220px] overflow-visible"
        >
          {/* Concentric Pentagons */}
          {gridLevels.map((level, idx) => {
            const points = axes
              .map((a) => {
                const { x, y } = getCoordinates(level, a.angle);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={`grid-${idx}`}
                points={points}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis Spokes from center */}
          {axes.map((a, idx) => {
            const { x, y } = getCoordinates(1.0, a.angle);
            return (
              <line
                key={`spoke-${idx}`}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {/* Expected Proficiency Polygon (Orange) */}
          <polygon
            points={expectedPolygon}
            fill="#FFA72F"
            fillOpacity="0.12"
            stroke="#EA580C"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Your Proficiency Polygon (Blue) */}
          <polygon
            points={yourPolygon}
            fill="#1C4CA1"
            fillOpacity="0.18"
            stroke="#1C4CA1"
            strokeWidth="2"
          />

          {/* Vertex dots for Your Proficiency */}
          {yourValues.map((v, i) => {
            const { x, y } = getCoordinates(v, axes[i].angle);
            return (
              <circle
                key={`your-pt-${i}`}
                cx={x}
                cy={y}
                r="3.5"
                fill="#1C4CA1"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Labels for each axis */}
          {axes.map((a, idx) => {
            const { x, y } = getCoordinates(1.28, a.angle);
            let textAnchor: 'start' | 'middle' | 'end' = 'middle';
            if (a.angle > -Math.PI / 2 && a.angle < Math.PI / 2) {
              textAnchor = 'start';
            } else if (a.angle < -Math.PI / 2 || a.angle > Math.PI / 2) {
              textAnchor = 'end';
            }
            return (
              <text
                key={`label-${idx}`}
                x={x}
                y={idx === 0 ? y - 4 : y + 3}
                textAnchor={textAnchor}
                fontSize="9.5"
                fontWeight="600"
                fill="#475569"
                fontFamily="sans-serif"
              >
                {a.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend at bottom */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 mt-2 text-xs font-semibold select-none">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1C4CA1]" />
          <span className="text-[#1F273A]">{yourProficiencyText}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EA580C]" />
          <span className="text-slate-500">{expectedProficiencyText}</span>
        </div>
      </div>
    </div>
  );
}

export default LearnerCompetencyOverviewCard;
