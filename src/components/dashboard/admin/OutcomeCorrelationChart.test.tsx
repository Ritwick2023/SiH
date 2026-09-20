import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { OutcomeCorrelationChart } from './OutcomeCorrelationChart';

describe('OutcomeCorrelationChart Component', () => {
  it('renders SVG chart with regression elements and title', () => {
    const html = renderToString(<OutcomeCorrelationChart />);

    expect(html).toContain('Survey Scrutiny Outcome Correlation');
    expect(html).toContain('R² Goodness of Fit');
    expect(html).toContain('Regression Slope');
    expect(html).toContain('Significance (p-value)');
    expect(html).toContain('<svg');
    expect(html).toContain('Confidence Interval');
  });

  it('renders series selector buttons', () => {
    const html = renderToString(<OutcomeCorrelationChart />);

    expect(html).toContain('Schedule 0.0 Listing Error Rate (%)');
    expect(html).toContain('HCES 7-day vs 30-day Recall Inconsistency (%)');
  });
});
