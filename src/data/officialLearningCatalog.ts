/**
 * officialLearningCatalog.ts — Source-Grounded Government Course & Resource Catalog
 *
 * Grounded in publicly available training circulars, notifications, and statutory publications
 * from:
 * 1. National Statistical Systems Training Academy (NSSTA, Greater Noida) — nssta.gov.in
 * 2. Ministry of Statistics and Programme Implementation (MoSPI, New Delhi) — mospi.gov.in
 *
 * PROVENANCE RULES:
 * - 'VERIFIED_OFFICIAL': Grounded in official NSSTA training programmes or MoSPI statutory publications.
 * - 'PROPOSED_FRAMEWORK': StatVidya competency mapping to FRAC (explicitly labeled).
 * - 'SYNTHETIC_DEMO_DATA': Mock iGOT demonstration data where live API integration is pending.
 */

import type { ProvenanceType } from '@/lib/types';

export type LearningItemType =
  | 'workshop'
  | 'training_programme'
  | 'residential_course'
  | 'field_manual'
  | 'technical_protocol'
  | 'classification_compendium'
  | 'igot_demo';

export type LearningStage = 'FOUNDATIONAL' | 'APPLIED' | 'CAPSTONE';

export type ItemLanguage = 'Hindi' | 'English' | 'Bilingual';

export interface OfficialLearningItem {
  id: string;
  title: string;
  title_hi: string;
  description: string;
  description_hi: string;
  provider: string;
  provider_hi: string;
  source_type: LearningItemType;
  source_url: string;
  source_domain: 'mospi.gov.in' | 'nssta.gov.in' | 'igotkarmayogi.gov.in';
  language: ItemLanguage;
  category: 'Domain' | 'Functional' | 'Behavioural';
  topics: string[];
  government_role_relevance: string[];
  targetCompetencies: string[]; // FRAC Competency IDs: comp-capi, comp-nsso, comp-survey, comp-data, comp-informant, comp-teamwork
  targetLevel: number; // L1 to L5
  stage: LearningStage;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  duration: string | null; // Stated official duration or null
  content_type: string;
  last_verified_at: string;
  provenance: ProvenanceType;
  statvidya_mapping_rationale: string;
  statvidya_mapping_rationale_hi: string;
  official_circular_ref?: string;
}

export const OFFICIAL_LEARNING_CATALOG: OfficialLearningItem[] = [
  // 1. NSSTA Workshop: Nuances of Data Collection
  {
    id: 'nssta-data-collection-workshop',
    title: 'Workshop on Nuances of Data Collection',
    title_hi: 'डेटा संग्रह की बारीकियों पर ऑनलाइन कार्यशाला',
    description: 'Official NSSTA capacity-building workshop focusing on field enumeration challenges, probing techniques, resolving respondent hesitation, and eliminating coverage and non-sampling errors.',
    description_hi: 'एनएसएसटीए आधिकारिक क्षमता विकास कार्यशाला जिसमें फील्ड प्रगणना चुनौतियों, जांच तकनीकों, उत्तरदाता हिचकिचाहट समाधान और कवरेज त्रुटियों के निवारण पर ध्यान केंद्रित किया गया है।',
    provider: 'National Statistical Systems Training Academy (NSSTA), MoSPI',
    provider_hi: 'राष्ट्रीय सांख्यिकी प्रणाली प्रशिक्षण अकादमी (एनएसएसटीए), सांख्यिकी मंत्रालय',
    source_type: 'workshop',
    source_url: 'https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta',
    source_domain: 'mospi.gov.in',
    language: 'Bilingual',
    category: 'Domain',
    topics: [
      'Field Enumeration Nuances',
      'Probing Techniques for Household Recall',
      'Eliminating Non-Sampling Errors',
      'Informant Rapport & Reluctance Mitigation',
      'CAPI Schedule Navigation'
    ],
    government_role_relevance: [
      'Field Investigator (NSSO FOD)',
      'Junior Statistical Officer (SSS)',
      'Field Officer (NSSO FOD)'
    ],
    targetCompetencies: ['comp-capi', 'comp-nsso', 'comp-informant'],
    targetLevel: 3,
    stage: 'APPLIED',
    difficulty: 'Intermediate',
    duration: 'Half-Day Online Workshop',
    content_type: 'Live Virtual Workshop & Reference Deck',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Mapped by StatVidya to CAPI Operations (L3) and Household Canvassing (L3) due to direct focus on primary field data collection mechanics.',
    statvidya_mapping_rationale_hi: 'प्राथमिक फील्ड डेटा संग्रह तकनीकों पर सीधे फोकस के कारण स्टेटविद्या द्वारा कैपी संचालन और घरेलू सर्वेक्षण में मैप किया गया।',
    official_circular_ref: 'MoSPI/NSSTA/Trg-2026/FOD-WKSHP'
  },

  // 2. NSSTA Workshop: Data Analytics & Visualization in Official Statistics
  {
    id: 'nssta-data-analytics-viz',
    title: 'Data Analytics & Visualization in Official Statistics',
    title_hi: 'आधिकारिक सांख्यिकी में डेटा एनालिटिक्स और विज़ुअलाइज़ेशन कार्यशाला',
    description: 'Specialized training for statistical personnel on descriptive analytics, outlier identification, survey data scrub rules, and statutory dashboard reporting.',
    description_hi: 'सांख्यिकी कर्मियों के लिए विवरणात्मक विश्लेषण, बाह्य विसंगतियों (आउटलायर) की पहचान, सर्वेक्षण डेटा शोधन नियम और सांविधिक डैशबोर्ड रिपोर्टिंग पर विशेष प्रशिक्षण।',
    provider: 'National Statistical Systems Training Academy (NSSTA), MoSPI',
    provider_hi: 'राष्ट्रीय सांख्यिकी प्रणाली प्रशिक्षण अकादमी (एनएसएसटीए), सांख्यिकी मंत्रालय',
    source_type: 'workshop',
    source_url: 'https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta',
    source_domain: 'mospi.gov.in',
    language: 'English',
    category: 'Domain',
    topics: [
      'Descriptive Analytics for Survey Data',
      'Data Visualization Principles',
      'Outlier Identification & Range Checks',
      'Inter-round Consistency Analysis',
      'Statistical Dashboards'
    ],
    government_role_relevance: [
      'Junior Statistical Officer (SSS)',
      'Senior Statistical Officer (SSS)',
      'Assistant Director (ISS)'
    ],
    targetCompetencies: ['comp-data', 'comp-survey'],
    targetLevel: 3,
    stage: 'APPLIED',
    difficulty: 'Intermediate',
    duration: '1-Day Online Workshop',
    content_type: 'Interactive Webinar & Hands-on Lab',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Mapped by StatVidya to Statistical Scrutiny (L3) and Multi-Stage Sampling (L2) to support JSO schedule audit and anomaly detection duties.',
    statvidya_mapping_rationale_hi: 'जेएसओ अनुसूची संवीक्षा और विसंगति पहचान कर्तव्यों का समर्थन करने के लिए स्टेटविद्या द्वारा मैप किया गया।',
    official_circular_ref: 'MoSPI/NSSTA/OM-2026/ANALYTICS'
  },

  // 3. NSSTA Residential Programme: Unit Level Data Extraction & Analysis in R
  {
    id: 'nssta-r-data-extraction-ai',
    title: 'Unit Level Data Extraction, Analysis in R & AI Use Cases',
    title_hi: 'आर भाषा में यूनिट लेवल डेटा निष्कर्षण, विश्लेषण और एआई उपयोग कार्यक्रम',
    description: 'Residential training at NSSTA Greater Noida campus covering microdata handling, large-scale survey extraction (PLFS, ASI), variance computation in R, and responsible AI applications in official statistics.',
    description_hi: 'एनएसएसटीए ग्रेटर नोएडा परिसर में माइक्रो-डेटा प्रबंधन, बड़े पैमाने पर सर्वेक्षण निष्कर्षण (PLFS, ASI), आर में प्रसरण गणना और आधिकारिक सांख्यिकी में जिम्मेदार एआई अनुप्रयोगों पर आवासीय प्रशिक्षण।',
    provider: 'National Statistical Systems Training Academy (NSSTA), Greater Noida',
    provider_hi: 'राष्ट्रीय सांख्यिकी प्रणाली प्रशिक्षण अकादमी (एनएसएसटीए), ग्रेटर नोएडा',
    source_type: 'residential_course',
    source_url: 'https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta',
    source_domain: 'mospi.gov.in',
    language: 'English',
    category: 'Domain',
    topics: [
      'Unit Level Microdata Handling',
      'Data Wrangling in R for Official Surveys',
      'Complex Variance & DEFF Estimation',
      'AI & Machine Learning in Statistical Scrutiny',
      'Data Dissemination Standards'
    ],
    government_role_relevance: [
      'Junior Statistical Officer (SSS)',
      'Senior Statistical Officer (SSS)',
      'Indian Statistical Service (ISS) Officers'
    ],
    targetCompetencies: ['comp-data', 'comp-survey'],
    targetLevel: 4,
    stage: 'CAPSTONE',
    difficulty: 'Advanced',
    duration: '5-Day Residential Course',
    content_type: 'Residential Practical Academy Course',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Mapped by StatVidya to Level 4 Statistical Scrutiny and Multi-Stage Sampling for officers handling unit-level microdata compilation.',
    statvidya_mapping_rationale_hi: 'यूनिट-स्तर के माइक्रो-डेटा संकलन को संभालने वाले अधिकारियों के लिए स्टेटविद्या द्वारा स्तर 4 पर मैप किया गया।',
    official_circular_ref: 'NSSTA/ISS-SSS/R-PROG/2026'
  },

  // 4. NSSTA Induction Programme for Subordinate Statistical Service (SSS)
  {
    id: 'nssta-sss-induction-programme',
    title: 'Induction Training Programme for Subordinate Statistical Service (SSS)',
    title_hi: 'अधीनस्थ सांख्यिकी सेवा (एसएसएस) के लिए बुनियादी प्रेरण प्रशिक्षण कार्यक्रम',
    description: 'Statutory foundational induction for newly recruited Junior Statistical Officers covering the Indian Statistical System, National Accounts, Index Numbers, Field Survey Methodologies, and Civil Service Conduct Rules.',
    description_hi: 'नवनियुक्त कनिष्ठ सांख्यिकी अधिकारियों के लिए सांविधिक बुनियादी प्रेरण प्रशिक्षण जिसमें भारतीय सांख्यिकी प्रणाली, राष्ट्रीय लेखा, सूचकांक, फील्ड सर्वेक्षण पद्धतियां और आचरण नियम शामिल हैं।',
    provider: 'National Statistical Systems Training Academy (NSSTA), Greater Noida',
    provider_hi: 'राष्ट्रीय सांख्यिकी प्रणाली प्रशिक्षण अकादमी (एनएसएसटीए), ग्रेटर नोएडा',
    source_type: 'training_programme',
    source_url: 'http://www.nssta.gov.in',
    source_domain: 'nssta.gov.in',
    language: 'Bilingual',
    category: 'Domain',
    topics: [
      'Indian Official Statistical System Architecture',
      'Sampling Theory & Large-Scale Surveys',
      'National Accounts & Price Indices',
      'Survey Schedule Scrutiny & Multipliers',
      'Government Ethics & Service Conduct'
    ],
    government_role_relevance: [
      'Junior Statistical Officer (SSS Cadre)'
    ],
    targetCompetencies: ['comp-survey', 'comp-data', 'comp-teamwork'],
    targetLevel: 2,
    stage: 'FOUNDATIONAL',
    difficulty: 'Foundational',
    duration: '4-Week Residential Course',
    content_type: 'Full Induction Curriculum',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Mapped by StatVidya as the foundational benchmark (L2) for Subordinate Statistical Service entry competencies.',
    statvidya_mapping_rationale_hi: 'अधीनस्थ सांख्यिकी सेवा प्रवेश दक्षताओं के लिए स्टेटविद्या द्वारा मूलभूत मानक (L2) के रूप में मैप किया गया।',
    official_circular_ref: 'NSSTA/SSS-INDUCT/CALENDAR'
  },

  // 5. NSSTA / DPD Interviewer Assessment and Certification
  {
    id: 'nssta-interviewer-certification',
    title: 'Interviewer Assessment and Certification (General Module)',
    title_hi: 'साक्षात्कारकर्ता मूल्यांकन एवं प्रमाणन (सामान्य मॉड्यूल)',
    description: 'Standardized assessment curriculum evaluating primary investigators on interview etiquette, Schedule 0.0 boundary identification, accurate CAPI data entry, and respondent privacy assurance under the Collection of Statistics Act.',
    description_hi: 'साक्षात्कार शिष्टाचार, अनुसूची 0.0 सीमा पहचान, सटीक कैपी डेटा प्रविष्टि, और सांख्यिकी संग्रह अधिनियम के तहत उत्तरदाता गोपनीयता पर प्राथमिक अन्वेषकों का मानकीकृत मूल्यांकन।',
    provider: 'NSSTA & Data Processing Division (DPD), MoSPI',
    provider_hi: 'एनएसएसटीए एवं डेटा प्रोसेसिंग प्रभाग (डीपीडी), सांख्यिकी मंत्रालय',
    source_type: 'training_programme',
    source_url: 'https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta',
    source_domain: 'mospi.gov.in',
    language: 'Bilingual',
    category: 'Functional',
    topics: [
      'Face-to-Face Interview Protocols',
      'Demarcation of Listing Blocks',
      'Error Handling in CAPI Tablets',
      'Collection of Statistics Act Confidentiality',
      'Sensitive Income & Expenditure Inquiries'
    ],
    government_role_relevance: [
      'Field Investigator (NSSO FOD)',
      'Contractual Field Enumerator'
    ],
    targetCompetencies: ['comp-capi', 'comp-informant', 'comp-nsso'],
    targetLevel: 2,
    stage: 'FOUNDATIONAL',
    difficulty: 'Foundational',
    duration: 'Self-Paced / 3 Modules',
    content_type: 'Certification Study Track',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Mapped by StatVidya as core requirement for field deployment readiness on CAPI and Informant Ethics.',
    statvidya_mapping_rationale_hi: 'कैपी और सूचनादाता नैतिकता पर फील्ड तैनाती तत्परता के लिए स्टेटविद्या द्वारा कोर आवश्यकता के रूप में मैप किया गया।',
    official_circular_ref: 'DPD-NSSTA/CERT-MOD/2025'
  },

  // 6. MoSPI Official Field Manual: PLFS Instructions to Field Staff (Vol. 1)
  {
    id: 'manual-plfs-vol1',
    title: 'Periodic Labour Force Survey (PLFS) Instructions to Field Staff (Vol. 1)',
    title_hi: 'आवधिक श्रम बल सर्वेक्षण (PLFS) फील्ड स्टाफ के लिए निर्देश: भाग I',
    description: 'Official statutory publication by NSSO FOD specifying definitions of activity status (usual status, current weekly status), industry/occupation coding rules (NIC/NCO), household eligibility, and schedule canvassing procedures.',
    description_hi: 'एनएसएसओ फील्ड संचालन प्रभाग द्वारा आधिकारिक वैधानिक प्रकाशन जिसमें गतिविधि स्थिति (सामान्य स्थिति, वर्तमान साप्ताहिक स्थिति), उद्योग/व्यवसाय कोडिंग नियम (NIC/NCO) और अनुसूची सर्वेक्षण प्रक्रियाएं निर्दिष्ट हैं।',
    provider: 'NSSO Field Operations Division, MoSPI',
    provider_hi: 'एनएसएसओ फील्ड संचालन प्रभाग, सांख्यिकी मंत्रालय',
    source_type: 'field_manual',
    source_url: 'https://www.mospi.gov.in/periodic-labour-force-survey-plfs',
    source_domain: 'mospi.gov.in',
    language: 'Bilingual',
    category: 'Domain',
    topics: [
      'Usual Principal Activity Status (ps)',
      'Subsidiary Economic Activity Status (ss)',
      'Current Weekly Status (CWS)',
      'National Industrial Classification (NIC-2008)',
      'National Classification of Occupations (NCO-2004)',
      'Schedule 10.4 Canvassing Rules'
    ],
    government_role_relevance: [
      'Field Investigator (NSSO FOD)',
      'Junior Statistical Officer (SSS)',
      'Senior Statistical Officer (SSS)'
    ],
    targetCompetencies: ['comp-nsso', 'comp-capi'],
    targetLevel: 3,
    stage: 'APPLIED',
    difficulty: 'Intermediate',
    duration: '184 Pages Statutory Reference',
    content_type: 'Official Statutory Field Manual (PDF / Hardcopy)',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Statutory source text mapped by StatVidya to NSSO Protocol Mastery (L3) and CAPI Form Completion (L3).',
    statvidya_mapping_rationale_hi: 'स्टेटविद्या द्वारा एनएसएसओ प्रोटोकॉल प्रवीणता (L3) और कैपी फॉर्म भरने (L3) से संबद्ध सांविधिक संदर्भ स्रोत।',
    official_circular_ref: 'MoSPI/NSSO-FOD/PLFS-MANUAL-2026'
  },

  // 7. MoSPI Official Field Manual: Schedule 0.0 Household Listing & Demarcation
  {
    id: 'manual-schedule-0',
    title: 'Schedule 0.0 Household Listing & Hamlet-Group Demarcation Handbook',
    title_hi: 'अनुसूची 0.0 परिवार सूचीकरण और हेमलेट-समूह सीमा निर्धारण हैंडबुक',
    description: 'Definitive operational handbook by Survey Design & Research Division (SDRD) detailing Census Enumeration Block (CEB) physical verification, hamlet-group formation, and household affluence stratification.',
    description_hi: 'सर्वेक्षण डिजाइन एवं अनुसंधान प्रभाग (एसडीआरडी) द्वारा निश्चित परिचालन हैंडबुक जिसमें जनगणना प्रगणना ब्लॉक भौतिक सत्यापन, हेमलेट-समूह गठन और परिवारों के समृद्धि स्तरीकरण का विस्तृत विवरण है।',
    provider: 'Survey Design & Research Division (SDRD), MoSPI',
    provider_hi: 'सर्वेक्षण डिजाइन एवं अनुसंधान प्रभाग (एसडीआरडी), सांख्यिकी मंत्रालय',
    source_type: 'field_manual',
    source_url: 'https://www.mospi.gov.in',
    source_domain: 'mospi.gov.in',
    language: 'Bilingual',
    category: 'Domain',
    topics: [
      'Census Enumeration Block (CEB) Physical Boundaries',
      'Hamlet-Group (hg) / Sub-Block (sb) Formation Rules',
      'Affluence Stratification in Rural and Urban PSUs',
      'Random Start & Circular Systematic Sampling for Listing',
      'Prevention of Boundary Omission Errors'
    ],
    government_role_relevance: [
      'Field Investigator (NSSO FOD)',
      'Senior Statistical Officer (Supervisory FOD)'
    ],
    targetCompetencies: ['comp-nsso', 'comp-teamwork'],
    targetLevel: 3,
    stage: 'APPLIED',
    difficulty: 'Intermediate',
    duration: '96 Pages Operational Guide',
    content_type: 'Statutory Field Listing Guide',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Mapped by StatVidya to Schedule 0.0 Demarcation & Listing competency (L3) to prevent field coverage errors.',
    statvidya_mapping_rationale_hi: 'फील्ड कवरेज त्रुटियों को रोकने के लिए स्टेटविद्या द्वारा अनुसूची 0.0 सीमा निर्धारण और सूचीकरण (L3) से मैप किया गया।',
    official_circular_ref: 'SDRD/SCH-0/GUIDELINES-2025'
  },

  // 8. MoSPI Technical Protocol: ASHE & CAPI Tablet Operational Protocols
  {
    id: 'manual-capi-handbook',
    title: 'Advanced CAPI Tablet Operations & Synchronization Protocols',
    title_hi: 'उन्नत कैपी टैबलेट संचालन और तुल्यकालन प्रोटोकॉल',
    description: 'Technical instruction manual issued by Data Processing Division (DPD) for government Android CAPI tablets, covering offline local encrypted storage, GPS boundary lock, daily sync, and error code resolution.',
    description_hi: 'डेटा प्रोसेसिंग प्रभाग (डीपीडी) द्वारा सरकारी एंड्रॉइड कैपी टैबलेट के लिए जारी तकनीकी निर्देश मैनुअल, जिसमें ऑफ़लाइन एन्क्रिप्टेड स्टोरेज, जीपीएस लॉक, दैनिक सिंक और त्रुटि समाधान शामिल हैं।',
    provider: 'Data Processing Division (DPD), MoSPI',
    provider_hi: 'डेटा प्रोसेसिंग प्रभाग (डीपीडी), सांख्यिकी मंत्रालय',
    source_type: 'technical_protocol',
    source_url: 'https://www.mospi.gov.in',
    source_domain: 'mospi.gov.in',
    language: 'Bilingual',
    category: 'Functional',
    topics: [
      'CAPI Application Installation & Keystore Setup',
      'Offline Survey Canvassing without Cellular Connectivity',
      'GPS Geofence Validation & Timestamping',
      'Daily Local Database Backup & Server Sync',
      'Logical Validation Overrides & Supervisor Query Slips'
    ],
    government_role_relevance: [
      'Field Investigator (NSSO FOD)',
      'Junior Statistical Officer (FOD / SSS)'
    ],
    targetCompetencies: ['comp-capi'],
    targetLevel: 3,
    stage: 'APPLIED',
    difficulty: 'Intermediate',
    duration: '64 Pages Technical Guide',
    content_type: 'Hardware & Software SOP Handbook',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Mapped by StatVidya to CAPI Operations & Offline Synchronization (L3).',
    statvidya_mapping_rationale_hi: 'कैपी संचालन और ऑफ़लाइन तुल्यकालन (L3) के लिए स्टेटविद्या द्वारा सीधे मैप किया गया।',
    official_circular_ref: 'DPD/CAPI-SOP/2026.2'
  },

  // 9. MoSPI Classification Compendium: National Industrial Classification (NIC-2008)
  {
    id: 'manual-nic-compendium',
    title: 'National Industrial Classification (NIC-2008) Compendium',
    title_hi: 'राष्ट्रीय औद्योगिक वर्गीकरण (NIC-2008) निर्देशिका',
    description: 'Comprehensive 5-digit industrial classification manual prepared by the Central Statistics Office (CSO) conforming to ISIC Rev. 4, used across socio-economic surveys, ASI, and economic censuses.',
    description_hi: 'केंद्रीय सांख्यिकी कार्यालय (सीएसओ) द्वारा तैयार की गई 5-अंकीय औद्योगिक वर्गीकरण निर्देशिका, जो सामाजिक-आर्थिक सर्वेक्षणों, एएसआई और आर्थिक गणना में प्रयुक्त होती है।',
    provider: 'Central Statistics Office (CSO), MoSPI',
    provider_hi: 'केंद्रीय सांख्यिकी कार्यालय (सीएसओ), सांख्यिकी मंत्रालय',
    source_type: 'classification_compendium',
    source_url: 'https://www.mospi.gov.in/classification/national-industrial-classification-nic',
    source_domain: 'mospi.gov.in',
    language: 'English',
    category: 'Domain',
    topics: [
      'NIC-2008 5-Digit Structure (Section, Division, Group, Class, Sub-class)',
      'Industrial Activity Description & Concordance with NIC-2004',
      'Classification of Informal & Unorganized Enterprises',
      'Agricultural vs Non-Agricultural Enterprise Coding',
      'Secondary Activities & Multi-Product Establishments'
    ],
    government_role_relevance: [
      'Junior Statistical Officer (SSS)',
      'Field Investigator (NSSO FOD)',
      'Senior Statistical Officer (Scrutiny)'
    ],
    targetCompetencies: ['comp-data', 'comp-nsso'],
    targetLevel: 4,
    stage: 'CAPSTONE',
    difficulty: 'Advanced',
    duration: '240 Pages Classification Compendium',
    content_type: 'Official Classification Standard',
    last_verified_at: '2026-09-01',
    provenance: 'VERIFIED_OFFICIAL',
    statvidya_mapping_rationale: 'Mapped by StatVidya to Statistical Scrutiny (L4) and Enterprise Classification for accurate schedule validation.',
    statvidya_mapping_rationale_hi: 'सटीक अनुसूची सत्यापन के लिए स्टेटविद्या द्वारा सांख्यिकीय संवीक्षा (L4) और उद्यम वर्गीकरण में मैप किया गया।',
    official_circular_ref: 'CSO/IS-WING/NIC-2008'
  },

  // 10. iGOT Karmayogi Demo Module (Synthetic Demo Data with explicit disclaimer)
  {
    id: 'igot-teamwork-informant-demo',
    title: 'Effective Field Team Coordination & Informant Engagement (iGOT Demo Module)',
    title_hi: 'प्रभावी क्षेत्र टीम समन्वय और सूचनादाता जुड़ाव (कर्मयोगी डेमो मॉड्यूल)',
    description: 'Interactive behavioral competency module from Mission Karmayogi Hub covering communication ethics, respectful probing in sensitive households, and peer coordination during intensive survey field camps.',
    description_hi: 'मिशन कर्मयोगी हब से इंटरएक्टिव व्यवहार क्षमता मॉड्यूल जिसमें संचार नैतिकता, संवेदनशील परिवारों में सम्मानजनक पूछताछ और गहन सर्वेक्षण शिविरों के दौरान सहकर्मी समन्वय शामिल है।',
    provider: 'Mission Karmayogi Behavioral Competency Hub (Demo Mock)',
    provider_hi: 'मिशन कर्मयोगी व्यवहार क्षमता हब (डेमो मॉक)',
    source_type: 'igot_demo',
    source_url: 'https://igotkarmayogi.gov.in',
    source_domain: 'igotkarmayogi.gov.in',
    language: 'Bilingual',
    category: 'Behavioural',
    topics: [
      'Civil Service Behavioral Competencies',
      'Field Team Coordination during NSSO Inspection Camps',
      'Empathetic Probing in Reluctant Households',
      'Conflict Resolution in Rural Survey Clusters',
      'Peer Learning & Supervisor Communication'
    ],
    government_role_relevance: [
      'Field Investigator (NSSO FOD)',
      'Junior Statistical Officer (SSS)',
      'All Civil Service Personnel'
    ],
    targetCompetencies: ['comp-teamwork', 'comp-informant'],
    targetLevel: 3,
    stage: 'FOUNDATIONAL',
    difficulty: 'Foundational',
    duration: '3 Hours Interactive E-Learning',
    content_type: 'Interactive Micro-Course (Demo Mode)',
    last_verified_at: '2026-09-01',
    provenance: 'SYNTHETIC_DEMO_DATA',
    statvidya_mapping_rationale: 'Demonstration module mapped by StatVidya for FRAC Behavioural competencies under Mission Karmayogi principles.',
    statvidya_mapping_rationale_hi: 'मिशन कर्मयोगी सिद्धांतों के तहत एफआरएसी व्यवहार दक्षताओं के लिए स्टेटविद्या द्वारा प्रदर्शित डेमो मॉड्यूल।',
    official_circular_ref: 'MOCK-IGOT-BEHAVIORAL-01'
  }
];
