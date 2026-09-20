import type { DemoPersona } from './types';

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'demo-amit',
    name: 'Amit Sharma',
    email: 'amit.sharma@mospi.gov.in',
    role: 'learner',
    organization_id: 'org-mospi',
    cadre: 'Indian Statistical Service (ISS)',
    designation: 'Junior Statistical Officer',
    preferred_language: 'en',
    department: 'MoSPI Headquarters',
  },
  {
    id: 'demo-sunita',
    name: 'Sunita Devi',
    email: 'sunita.devi@nsso.gov.in',
    role: 'learner',
    organization_id: 'org-nsso',
    cadre: 'NSSO Field Operations Division',
    designation: 'Field Investigator',
    preferred_language: 'hi',
    department: 'NSSO Field Operations Division',
  },
  {
    id: 'demo-priya',
    name: 'Dr. Priya Verma',
    email: 'priya.verma@nssta.gov.in',
    role: 'trainer',
    organization_id: 'org-nssta',
    cadre: 'NSSTA Faculty',
    designation: 'Course Director',
    preferred_language: 'en',
    department: 'NSSTA',
  },
  {
    id: 'demo-rajesh',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@mospi.gov.in',
    role: 'admin',
    organization_id: 'org-mospi',
    cadre: 'MoSPI Headquarters',
    designation: 'Additional Director General',
    preferred_language: 'en',
    department: 'MoSPI',
  },
];

export function getDemoPersonaByEmail(email: string): DemoPersona | undefined {
  return DEMO_PERSONAS.find((p) => p.email.toLowerCase() === email.toLowerCase());
}
