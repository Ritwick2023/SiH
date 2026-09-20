'use client';

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { SYNTHETIC_SURVEY_OUTCOMES, fetchLiveScrutinyCorrelation } from '@/data/surveyScrutinyMetrics';
import { type OutcomeCorrelationSeries } from '@/lib/types';
import { calculateLinearRegression } from '@/services/adminService';
import { ShieldAlert, Info, CheckCircle2, Building2, Users } from 'lucide-react';

export function OutcomeCorrelationChart() {
  const [seriesList, setSeriesList] = useState<OutcomeCorrelationSeries[]>(SYNTHETIC_SURVEY_OUTCOMES);
  const [activeMetricId, setActiveMetricId] = useState(SYNTHETIC_SURVEY_OUTCOMES[0].id);
  const [hoveredPoint, setHoveredPoint] = useState<OutcomeCorrelationSeries['dataPoints'][0] | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchLiveScrutinyCorrelation().then((data) => {
      if (isMounted && data) {
        setSeriesList(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedSeries =
    seriesList.find((s) => s.id === activeMetricId) ||
    seriesList[0];

  // Total sample size across all data points
  const totalSampleSize = selectedSeries.dataPoints.reduce((sum: number, p: { sampleSize?: number }) => sum + (p.sampleSize || 0), 0);

  // Convert data points to {x, y} for regression
  const regressionPoints = selectedSeries.dataPoints.map((p: { competencyLevel: number; errorRatePercent: number }) => ({
    x: p.competencyLevel,
    y: p.errorRatePercent,
  }));

  const regression = calculateLinearRegression(regressionPoints);

  // SVG Chart dimensions
  const svgWidth = 560;
  const svgHeight = 250;
  const padding = { top: 25, right: 35, bottom: 40, left: 45 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Domain & Range
  const minX = 1;
  const maxX = 5;
  const minY = 0;
  const maxY = 25;

  const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (y: number) => padding.top + plotHeight - ((y - minY) / (maxY - minY)) * plotHeight;

  // Calculate standard error of estimate for 95% Confidence Interval
  const n = regressionPoints.length;
  let standardError = 1.5;
  if (n > 2 && regression.isComputable) {
    const residualsSquared = regressionPoints.reduce((acc: number, pt: { x: number; y: number }) => {
      const predY = regression.slope * pt.x + regression.intercept;
      return acc + Math.pow(pt.y - predY, 2);
    }, 0);
    standardError = Math.sqrt(residualsSquared / (n - 2));
  }
  const ciMargin = 1.96 * standardError;

  // D3 Area and Line generator for 95% CI polygon and trendline
  const xValues = [1, 2, 3, 4, 5];
  const ciAreaGenerator = d3.area<number>()
    .x((x) => scaleX(x))
    .y0((x) => {
      const fitY = regression.isComputable ? regression.slope * x + regression.intercept : 20 - 4.5 * (x - 1);
      return scaleY(Math.min(maxY, Math.max(minY, fitY - ciMargin)));
    })
    .y1((x) => {
      const fitY = regression.isComputable ? regression.slope * x + regression.intercept : 20 - 4.5 * (x - 1);
      return scaleY(Math.min(maxY, Math.max(minY, fitY + ciMargin)));
    })
    .curve(d3.curveMonotoneX);

  const trendlineGenerator = d3.line<number>()
    .x((x) => scaleX(x))
    .y((x) => {
      const fitY = regression.isComputable ? regression.slope * x + regression.intercept : 20 - 4.5 * (x - 1);
      return scaleY(Math.min(maxY, Math.max(minY, fitY)));
    })
    .curve(d3.curveLinear);

  const ciPath = ciAreaGenerator(xValues) || '';
  const trendlinePath = trendlineGenerator(xValues) || '';

  return (
    <div className="rounded-3xl bg-white border border-[#EDF0F7] p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDF0F7]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1C4CA1]" />
              <h2 className="text-base sm:text-lg font-bold text-[#1F273A]">
                Survey Scrutiny Outcome Correlation (PRD §9.4.5)
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Empirical correlation between field competency levels and subsequent schedule scrutiny error rates
            </p>
          </div>

          {/* Provenance Badge */}
          <div className="flex items-center gap-2 shrink-0">
            {selectedSeries.provenance === 'LIVE_OLS_REGRESSION' ? (
              <span
                title="Live Ordinary Least Squares (OLS) regression over active MoSPI field records"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                🔬 Live Data (n={totalSampleSize})
              </span>
            ) : selectedSeries.provenance === 'EMPIRICAL_NSS78_BOOTSTRAP' ? (
              <span
                title="Empirical benchmark calibrated on authentic NSS 78th Round Scrutiny logs"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300"
              >
                <ShieldAlert className="h-3 w-3 text-amber-700" />
                📊 NSS 78th Round Baseline (n={totalSampleSize})
              </span>
            ) : (
              <span
                title="Simulated benchmark based on NSS 78th Round Scrutiny Guidelines (PRD §9.4.5)"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-[#EDF0F7] text-[#1F273A] border border-[#EDF0F7]"
              >
                <ShieldAlert className="h-3 w-3 text-[#1C4CA1]" />
                SYNTHETIC DEMO DATA
              </span>
            )}
          </div>
        </div>

        {/* Series Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {seriesList.map((series) => (
            <button
              key={series.id}
              type="button"
              onClick={() => {
                setActiveMetricId(series.id);
                setHoveredPoint(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeMetricId === series.id
                  ? 'bg-[#1C4CA1] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-muted-foreground border border-[#EDF0F7] hover:bg-[#EDF0F7]'
              }`}
            >
              {series.metricName}
            </button>
          ))}
        </div>

        {/* Regression Fit Summary Pill Banner */}
        <div className="grid grid-cols-3 gap-2.5 mt-4 p-3 rounded-2xl bg-[#EDF0F7]/50 border border-[#EDF0F7] text-xs font-mono">
          <div>
            <span className="text-[10px] font-sans font-bold text-muted-foreground block">R² Goodness of Fit</span>
            <span className="text-sm font-black text-[#1F273A]">{selectedSeries.rSquared}</span>
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold text-muted-foreground block">Regression Slope</span>
            <span className="text-sm font-black text-[#FFA72F]">{selectedSeries.regressionSlope}% / level</span>
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold text-muted-foreground block">Significance (p-value)</span>
            <span className="text-sm font-black text-emerald-700">p = {selectedSeries.pValue}</span>
          </div>
        </div>

        {/* SVG Scatter Chart with D3 elements */}
        <div className="relative mt-4 w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-w-140 mx-auto overflow-visible select-none transition-all duration-400"
          >
            {/* Grid lines */}
            {[5, 10, 15, 20].map((yVal) => (
              <g key={yVal}>
                <line
                  x1={padding.left}
                  y1={scaleY(yVal)}
                  x2={svgWidth - padding.right}
                  y2={scaleY(yVal)}
                  stroke="#EDF0F7"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={scaleY(yVal) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#64748B"
                  fontFamily="monospace"
                >
                  {yVal}%
                </text>
              </g>
            ))}

            {/* X-axis levels */}
            {[1, 2, 3, 4, 5].map((xVal) => (
              <g key={xVal}>
                <line
                  x1={scaleX(xVal)}
                  y1={padding.top}
                  x2={scaleX(xVal)}
                  y2={scaleY(0)}
                  stroke="#EDF0F7"
                  strokeWidth="1"
                />
                <text
                  x={scaleX(xVal)}
                  y={scaleY(0) + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748B"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  L{xVal}
                </text>
              </g>
            ))}

            {/* Axes Lines */}
            <line
              x1={padding.left}
              y1={scaleY(0)}
              x2={svgWidth - padding.right}
              y2={scaleY(0)}
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={scaleY(0)}
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />

            {/* 95% Confidence Interval shaded polygon */}
            <path
              d={ciPath}
              fill="#1C4CA1"
              fillOpacity="0.08"
              stroke="none"
            >
              <title>95% Confidence Interval</title>
            </path>

            {/* Linear Regression Trendline */}
            <path
              d={trendlinePath}
              fill="none"
              stroke="#FFA72F"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />

            {/* Data Points */}
            {selectedSeries.dataPoints.map((dp) => {
              const cx = scaleX(dp.competencyLevel);
              const cy = scaleY(dp.errorRatePercent);
              const isHovered = hoveredPoint?.id === dp.id;
              return (
                <g
                  key={dp.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(dp)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setHoveredPoint(dp)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 8 : 6}
                    fill={isHovered ? '#FFA72F' : '#1C4CA1'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                  {/* Point Label */}
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#1F273A"
                    className="select-none pointer-events-none"
                  >
                    {dp.departmentCode.replace('FOD-', '')}
                  </text>
                </g>
              );
            })}

            {/* X-axis title */}
            <text
              x={padding.left + plotWidth / 2}
              y={svgHeight - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#64748B"
            >
              {selectedSeries.xAxisLabel}
            </text>

            {/* Y-axis title */}
            <text
              x={-(padding.top + plotHeight / 2)}
              y="14"
              textAnchor="middle"
              transform="rotate(-90)"
              fontSize="10"
              fontWeight="bold"
              fill="#64748B"
            >
              {selectedSeries.yAxisLabel}
            </text>
          </svg>
        </div>

        {/* Hover Tooltip / Detail Card */}
        {hoveredPoint ? (
          <div className="mt-3 p-3 rounded-2xl bg-[#1C4CA1]/5 border border-[#1C4CA1]/20 flex items-center justify-between text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#1C4CA1]" />
              <div>
                <span className="font-bold text-[#1F273A]">{hoveredPoint.departmentName}</span>
                <span className="text-muted-foreground ml-1 font-mono text-[11px]">({hoveredPoint.departmentCode})</span>
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>n={hoveredPoint.sampleSize}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white border border-[#EDF0F7] font-bold text-[#1C4CA1]">
                L{hoveredPoint.competencyLevel}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-[#EDF0F7] font-bold text-[#FFA72F]">
                {hoveredPoint.errorRatePercent}% Err
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-2 text-center text-xs text-muted-foreground bg-[#EDF0F7]/40 rounded-xl">
            Hover over any regional data circle to inspect district sample size and scrutiny metrics
          </div>
        )}

        {/* Narrative Insight Footer */}
        <p className="text-xs text-muted-foreground italic bg-[#FAF6F0]/50 p-3 rounded-xl border border-[#EDF0F7] mt-3">
          <Info className="h-3.5 w-3.5 inline mr-1 text-[#FFA72F]" />
          {selectedSeries.narrativeInsight}
        </p>
      </div>
    </div>
  );
}
