/**
 * src/services/adminDashboardService.ts
 *
 * Provides regional office telemetry, readiness metrics, and priority remediation flagging
 * for MoSPI National Executive Workforce Intelligence.
 */

export interface DepartmentMetric {
  id: string;
  name: string;
  zone: string;
  headcount: number;
  readinessPercent: number;
  avgLevel: string;
  errorRate: number;
  isFlagged: boolean;
}

export const MOCK_REGIONAL_OFFICES: DepartmentMetric[] = [
  {
    id: 'ro-delhi',
    name: 'Field Operations Division (FOD) Headquarters Delhi',
    zone: 'Northern Zone',
    headcount: 1420,
    readinessPercent: 88,
    avgLevel: 'L4.2',
    errorRate: 3.4,
    isFlagged: false,
  },
  {
    id: 'ro-patna',
    name: 'FOD Bihar Regional Office (Patna)',
    zone: 'Eastern Zone',
    headcount: 840,
    readinessPercent: 54,
    avgLevel: 'L2.8',
    errorRate: 14.8,
    isFlagged: true,
  },
  {
    id: 'ro-lucknow',
    name: 'FOD Uttar Pradesh Regional Office (Lucknow)',
    zone: 'Central Zone',
    headcount: 1120,
    readinessPercent: 58,
    avgLevel: 'L2.9',
    errorRate: 13.2,
    isFlagged: true,
  },
  {
    id: 'ro-mumbai',
    name: 'FOD Maharashtra Regional Office (Mumbai)',
    zone: 'Western Zone',
    headcount: 980,
    readinessPercent: 82,
    avgLevel: 'L3.9',
    errorRate: 4.6,
    isFlagged: false,
  },
  {
    id: 'ro-kolkata',
    name: 'Data Quality Assurance Division (DQAD) Kolkata',
    zone: 'Statistical Audit',
    headcount: 290,
    readinessPercent: 86,
    avgLevel: 'L4.1',
    errorRate: 3.8,
    isFlagged: false,
  },
  {
    id: 'ro-kerala',
    name: 'FOD Kerala Regional Office (Trivandrum)',
    zone: 'Southern Zone',
    headcount: 580,
    readinessPercent: 94,
    avgLevel: 'L4.8',
    errorRate: 1.9,
    isFlagged: false,
  },
];

const flaggedStatusMap = new Map<string, boolean>();

export function flagDepartmentForTraining(id: string): { isFlagged: boolean } {
  const current = flaggedStatusMap.has(id)
    ? flaggedStatusMap.get(id)!
    : MOCK_REGIONAL_OFFICES.find((d) => d.id === id)?.isFlagged ?? false;
  const next = !current;
  flaggedStatusMap.set(id, next);
  return { isFlagged: next };
}
