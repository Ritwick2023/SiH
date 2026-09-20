/**
 * src/data/fracKnowledgeBase.ts
 *
 * Grounded institutional knowledge base representing official MoSPI manuals,
 * schedules, and Mission Karmayogi FRAC standards.
 * Used for offline semantic retrieval and pgvector fallback.
 */

export interface DocumentChunk {
  id: string;
  document_id: string;
  page_number: number;
  section_title: string | null;
  chunk_text: string;
  provenance: string;
}

export const FRAC_KNOWLEDGE_BASE: DocumentChunk[] = [
  {
    id: 'chunk-ufs-01',
    document_id: 'doc-ufs-boundary-manual-2024',
    page_number: 4,
    section_title: 'Urban Frame Survey (UFS) Boundary Identification',
    chunk_text:
      'The investigator must strictly follow the natural and man-made boundaries demarcating the UFS block. Under no circumstances should an investigator cross railway tracks, rivers, or designated arterial roads unless explicitly delineated in the UFS block sketch map. In case of boundary ambiguities, the Supervisor or Senior Statistical Officer (SSO) must conduct an on-site joint inspection.',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
  {
    id: 'chunk-ufs-02',
    document_id: 'doc-ufs-boundary-manual-2024',
    page_number: 12,
    section_title: 'Hamlet Group and Sub-block Formation Rules',
    chunk_text:
      'In rural First Stage Units (FSUs) with estimated population exceeding 1,200 or more than 300 households, hamlet groups (hg) must be formed according to population size. Selected hamlet groups must be formed by grouping contiguous hamlets having approximately equal population, strictly maintaining natural geographical contiguity without overlap.',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
  {
    id: 'chunk-capi-01',
    document_id: 'doc-capi-tablet-sop-2025',
    page_number: 7,
    section_title: 'CAPI Field Station Offline Synchronization & Hash Verification',
    chunk_text:
      'In areas lacking cellular connectivity, investigators must operate in offline CAPI mode with encrypted IndexedDB storage. Every completed schedule generates a cryptographic SHA-256 checksum upon completion. Batch synchronization must be initiated within 24 hours of returning to network coverage. Field tablets must maintain at least 40% battery charge before commencing interviews.',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
  {
    id: 'chunk-capi-02',
    document_id: 'doc-capi-tablet-sop-2025',
    page_number: 19,
    section_title: 'GPS Geo-fencing and Scrutiny Audit Flags',
    chunk_text:
      'The CAPI application automatically captures GPS coordinates at the commencement and termination of each household interview. Spatial coordinates deviating by more than 50 meters from the listed FSU centroid trigger an automatic supervisory scrutiny flag (Audit Flag SF-04), requiring formal written endorsement from the inspecting officer.',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
  {
    id: 'chunk-plfs-01',
    document_id: 'doc-plfs-instruction-manual-v3',
    page_number: 15,
    section_title: 'Usual Principal Activity Status (UPS) Determination',
    chunk_text:
      'Usual Principal Activity Status (UPS) is determined based on the major time spent criterion over the 365 days preceding the date of survey. A person is considered in the labour force if they were employed or seeking/available for work for a relatively longer period (major time) of the reference 365 days. Subsidiary activity is recorded if pursued for 30 days or more.',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
  {
    id: 'chunk-plfs-02',
    document_id: 'doc-plfs-instruction-manual-v3',
    page_number: 28,
    section_title: 'Current Weekly Status (CWS) Criteria & Activity Codes',
    chunk_text:
      'Under Current Weekly Status (CWS), a person is categorized as employed if they engaged in any economic activity for at least one hour on any day during the 7-day reference period. Activity codes 11-51 represent employed categories (own account workers, regular wage employees, casual labour), while codes 81-82 denote unemployment seeking work.',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
  {
    id: 'chunk-scrutiny-01',
    document_id: 'doc-statistical-scrutiny-guidelines',
    page_number: 8,
    section_title: 'Sampling Design Weights & Multiplier Verification',
    chunk_text:
      'Subordinate Statistical Officers (SSO) must verify the multiplier consistency before approving schedule returns. If the household multiplier deviates from the theoretical sampling design weight by more than 15%, field re-verification must be ordered. Non-response substitution must strictly follow the random selection table; arbitrary replacement of non-responding households is prohibited.',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
  {
    id: 'chunk-scrutiny-02',
    document_id: 'doc-statistical-scrutiny-guidelines',
    page_number: 22,
    section_title: 'Demographic and Household Consistency Scrutiny',
    chunk_text:
      'Mandatory schedule scrutiny validation rules: Age at marriage must be strictly less than current age; age difference between parents and first biological child must be at least 15 years; literacy level codes must be consistent with reported occupation codes (e.g. professional/technical occupations require minimum secondary education).',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
  {
    id: 'chunk-hces-01',
    document_id: 'doc-hces-consumption-manual-2024',
    page_number: 11,
    section_title: 'Recall Period Protocols for Household Consumption',
    chunk_text:
      'Household Consumption Expenditure Survey (HCES) utilizes split recall periods: Perishable food items (vegetables, milk, fruits, fish/meat) are recorded using a 7-day recall period. Durable goods, clothing, footwear, and institutional healthcare use a 365-day recall period. Monthly Per Capita Consumption Expenditure (MPCE) is normalized to a 30-day baseline across all schedules.',
    provenance: 'OFFICIAL_MOSPI_MANUAL',
  },
];
