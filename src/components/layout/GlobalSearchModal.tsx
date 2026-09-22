'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Target,
  BookOpen,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import type { UserRole } from '@/lib/types';

export interface SearchItem {
  id: string;
  title: string;
  title_hi: string;
  description: string;
  description_hi: string;
  category: 'competency' | 'manual' | 'page';
  href: string;
  badge?: string;
  cadreTag?: string;
  cadreTag_hi?: string;
  targetPersonaEmail?: string;
  allowedRoles?: UserRole[];
  keywords?: string[];
}

const SEARCH_REGISTRY: SearchItem[] = [
  // Competencies
  {
    id: 'comp-capi',
    title: 'CAPI Tablet Operation & Field Sync',
    title_hi: 'CAPI टैबलेट संचालन एवं फील्ड सिंक',
    description: 'Offline-first household listing, digital validation rules & survey synchronization.',
    description_hi: 'ऑफ़लाइन घरेलू सूचीकरण, डिजिटल सत्यापन नियम और सर्वेक्षण तुल्यकालन।',
    category: 'competency',
    href: '/skill-gap?comp=comp-capi',
    badge: 'FRAC L3 Target',
    cadreTag: 'Field Investigator',
    cadreTag_hi: 'फील्ड अन्वेषक',
    targetPersonaEmail: 'sunita.devi@nsso.gov.in',
    keywords: ['capi', 'tablet', 'offline', 'sync', 'listing', 'field', 'investigator', 'sunita'],
  },
  {
    id: 'comp-nsso',
    title: 'NSSO Protocol Mastery & Cadastral Scrutiny',
    title_hi: 'NSSO प्रोटोकॉल एवं कैडस्ट्रल संवीक्षा',
    description: 'Cadastral map interpretation, boundary reconciliation & FOD field conventions.',
    description_hi: 'कैडस्ट्रल मानचित्र व्याख्या, सीमा समाधान और FOD फील्ड नियम।',
    category: 'competency',
    href: '/skill-gap?comp=comp-nsso',
    badge: 'FRAC L3 Target',
    cadreTag: 'JSO Cadre',
    cadreTag_hi: 'JSO संवर्ग',
    targetPersonaEmail: 'amit.sharma@mospi.gov.in',
    keywords: ['nsso', 'fod', 'cadastral', 'map', 'boundary', 'scrutiny'],
  },
  {
    id: 'comp-survey',
    title: 'Survey Sampling & Design Frameworks',
    title_hi: 'सर्वेक्षण प्रतिचयन एवं रूपरेखा',
    description: 'Stratified multi-stage sampling, multiplier estimation & rotational panels.',
    description_hi: 'स्तरीकृत बहु-चरणीय प्रतिचयन, गुणक अनुमान एवं घूर्णी पैनल।',
    category: 'competency',
    href: '/skill-gap?comp=comp-survey',
    badge: 'FRAC L4 Target',
    cadreTag: 'JSO Cadre',
    cadreTag_hi: 'JSO संवर्ग',
    targetPersonaEmail: 'amit.sharma@mospi.gov.in',
    keywords: ['sampling', 'design', 'survey', 'strata', 'multiplier', 'variance', 'amit'],
  },
  {
    id: 'comp-data',
    title: 'Data Entry, Verification & Consistency Rules',
    title_hi: 'डेटा प्रविष्टि, सत्यापन एवं संगति नियम',
    description: 'Field schedule scrutiny, error flagging, logical checks & verification.',
    description_hi: 'फील्ड अनुसूची संवीक्षा, त्रुटि ध्वजांकन, तार्किक जांच और सत्यापन।',
    category: 'competency',
    href: '/skill-gap?comp=comp-data',
    badge: 'FRAC L3 Target',
    cadreTag: 'JSO Cadre',
    cadreTag_hi: 'JSO संवर्ग',
    targetPersonaEmail: 'amit.sharma@mospi.gov.in',
    keywords: ['data', 'entry', 'verification', 'consistency', 'scrutiny', 'error'],
  },
  {
    id: 'comp-demarcation',
    title: 'Block Demarcation & Urban Frame Survey (UFS)',
    title_hi: 'ब्लॉक सीमांकन एवं शहरी फ्रेम सर्वेक्षण (UFS)',
    description: 'Schedule 0.0 block formation, boundary description & landmark validation.',
    description_hi: 'अनुसूची 0.0 ब्लॉक गठन, सीमा विवरण और लैंडमार्क सत्यापन।',
    category: 'competency',
    href: '/skill-gap?comp=comp-demarcation',
    badge: 'FRAC L3 Target',
    cadreTag: 'Field Investigator',
    cadreTag_hi: 'फील्ड अन्वेषक',
    targetPersonaEmail: 'sunita.devi@nsso.gov.in',
    keywords: ['ufs', 'urban', 'frame', 'demarcation', 'block', 'schedule 0.0'],
  },
  {
    id: 'comp-scrutiny',
    title: 'Field Scrutiny & Validation Rules',
    title_hi: 'फील्ड संवीक्षा और सत्यापन नियम',
    description: 'Household expenditure checks, cross-schedule validation & anomaly resolution.',
    description_hi: 'घरेलू व्यय जांच, क्रॉस-शेड्यूल सत्यापन और विसंगति निवारण।',
    category: 'competency',
    href: '/skill-gap?comp=comp-scrutiny',
    badge: 'FRAC L4 Target',
    cadreTag: 'SSO Cadre',
    cadreTag_hi: 'SSO संवर्ग',
    keywords: ['scrutiny', 'validation', 'expenditure', 'plfs', 'household'],
  },

  // Field Manuals & SOPs
  {
    id: 'manual-plfs',
    title: 'Periodic Labour Force Survey (PLFS) Manual 2026',
    title_hi: 'आवधिक श्रम बल सर्वेक्षण (PLFS) मैनुअल 2026',
    description: 'Instructions to field staff: Volume 1 — Objectives, activity status codes & rules.',
    description_hi: 'फील्ड स्टाफ के लिए निर्देश: भाग 1 — उद्देश्य, गतिविधि स्थिति कोड और नियम।',
    category: 'manual',
    href: '/documents',
    badge: '184 Pages • Statutory',
    cadreTag: 'Statutory SOP',
    cadreTag_hi: 'वैधानिक SOP',
    keywords: ['manual', 'plfs', 'labour', 'employment', 'activity', 'unemployment', 'book'],
  },
  {
    id: 'manual-schedule-0',
    title: 'Schedule 0.0 Demarcation Handbook',
    title_hi: 'अनुसूची 0.0 सीमांकन पुस्तिका',
    description: 'SDRD standard operational procedure for block formation and sub-unit listing.',
    description_hi: 'ब्लॉक गठन और उप-इकाई सूचीकरण के लिए SDRD मानक संचालन प्रक्रिया।',
    category: 'manual',
    href: '/documents',
    badge: '96 Pages • Ver 2025.4',
    cadreTag: 'SDRD Manual',
    cadreTag_hi: 'SDRD मैनुअल',
    keywords: ['manual', 'schedule', 'demarcation', 'sdrd', 'boundary', 'book'],
  },
  {
    id: 'manual-capi',
    title: 'CAPI Field Station Handbook & Scrutiny Guide',
    title_hi: 'CAPI फील्ड स्टेशन पुस्तिका एवं संवीक्षा गाइड',
    description: 'Technical guidance for tablet operation, offline sync cache, and error alerts.',
    description_hi: 'टैबलेट संचालन, ऑफ़लाइन सिंक कैश और त्रुटि अलर्ट के लिए तकनीकी मार्गदर्शन।',
    category: 'manual',
    href: '/documents',
    badge: '64 Pages • FOD Technical',
    cadreTag: 'FOD Technical',
    cadreTag_hi: 'FOD तकनीकी',
    keywords: ['capi', 'handbook', 'tablet', 'manual', 'field', 'guide'],
  },

  // Platform Workspaces & Pages
  {
    id: 'page-dashboard',
    title: 'Operational Dashboard',
    title_hi: 'परिचालन कार्यक्षेत्र (डैशबोर्ड)',
    description: 'Officer competency KPIs, priority gap cards, drills, and manuals shelf.',
    description_hi: 'अधिकारी क्षमता KPI, प्राथमिकता अंतर कार्ड, अभ्यास और मैनुअल शेल्फ।',
    category: 'page',
    href: '/dashboard',
    badge: 'Home',
    cadreTag: 'All Cadres',
    cadreTag_hi: 'सभी संवर्ग',
    keywords: ['dashboard', 'home', 'kpi', 'readiness', 'overview'],
  },
  {
    id: 'page-mcq-generator',
    title: 'Document Practice & MCQ Station',
    title_hi: 'दस्तावेज़ अभ्यास एवं बहुविकल्पीय प्रश्न केंद्र',
    description: 'Generate authentic self-paced questions grounded in MoSPI manuals.',
    description_hi: 'MoSPI मैनुअल पर आधारित प्रामाणिक स्व-गति प्रश्न उत्पन्न करें।',
    category: 'page',
    href: '/mcq-generator',
    badge: 'FRAC Clause 4.3',
    cadreTag: 'All Cadres • Self Practice',
    cadreTag_hi: 'सभी संवर्ग • स्व-अभ्यास',
    keywords: ['mcq', 'generator', 'practice', 'exam', 'questions', 'ai', 'groq', 'calibration'],
  },
  {
    id: 'page-skill-gap',
    title: 'FRAC Competency Gap Matrix',
    title_hi: 'FRAC क्षमता अंतराल मैट्रिक्स',
    description: 'Detailed cadre progression, target level benchmarks & gap severity metrics.',
    description_hi: 'विस्तृत संवर्ग प्रगति, लक्ष्य स्तर मानक और अंतर गंभीरता मेट्रिक्स।',
    category: 'page',
    href: '/skill-gap',
    badge: 'Gap Matrix',
    cadreTag: 'Learner Workspace',
    cadreTag_hi: 'शिक्षार्थी कार्यक्षेत्र',
    keywords: ['skill', 'gap', 'matrix', 'competency', 'bridge', 'cadre'],
  },
  {
    id: 'page-review-queue',
    title: 'Faculty Question Review Queue',
    title_hi: 'संकाय प्रश्न समीक्षा कतार',
    description: 'Faculty review, distractor calibration & certification into the official exam bank.',
    description_hi: 'संकाय समीक्षा, विकर्षक अंशांकन और आधिकारिक परीक्षा बैंक में प्रमाणीकरण।',
    category: 'page',
    href: '/review-queue',
    badge: 'Faculty Studio',
    cadreTag: 'NSSTA Faculty',
    cadreTag_hi: 'NSSTA संकाय',
    allowedRoles: ['trainer', 'admin'],
    keywords: ['review', 'queue', 'faculty', 'priya', 'trainer', 'qa', 'approve'],
  },
  {
    id: 'page-courses',
    title: 'Mission Karmayogi Course Matrix',
    title_hi: 'मिशन कर्मयोगी पाठ्यक्रम मैट्रिक्स',
    description: 'Enrolled courses, syllabus modules, credit hours & iGOT course pathways.',
    description_hi: 'नामांकित पाठ्यक्रम, पाठ्यक्रम मॉड्यूल, क्रेडिट घंटे और iGOT मार्ग।',
    category: 'page',
    href: '/pathways',
    badge: 'iGOT Karmayogi',
    cadreTag: 'All Cadres',
    cadreTag_hi: 'सभी संवर्ग',
    allowedRoles: ['learner', 'trainer', 'admin'],
    keywords: ['courses', 'karmayogi', 'igot', 'learning', 'training'],
  },
  {
    id: 'page-admin-analytics',
    title: 'Department Analytics & Outcomes Correlation',
    title_hi: 'विभाग विश्लेषण एवं परिणाम सहसंबंध',
    description: 'National readiness indices, field error rates, and regional scrutiny metrics.',
    description_hi: 'राष्ट्रीय तैयारी सूचकांक, फील्ड त्रुटि दरें और क्षेत्रीय संवीक्षा मेट्रिक्स।',
    category: 'page',
    href: '/admin/analytics',
    badge: 'HQ Intelligence',
    cadreTag: 'MoSPI HQ Command',
    cadreTag_hi: 'MoSPI मुख्यालय',
    allowedRoles: ['admin'],
    keywords: ['analytics', 'admin', 'rajesh', 'correlation', 'metrics', 'ro', 'error', 'readiness'],
  },
  {
    id: 'page-documents',
    title: 'Official Field Manuals & SOP Library',
    title_hi: 'आधिकारिक फील्ड मैनुअल एवं एसओपी पुस्तकालय',
    description: 'Searchable library of MoSPI manuals, circulars, and survey schedules.',
    description_hi: 'MoSPI मैनुअल, परिपत्रों और सर्वेक्षण अनुसूचियों का खोज योग्य पुस्तकालय।',
    category: 'page',
    href: '/documents',
    badge: 'Knowledge Base',
    cadreTag: 'All Cadres',
    cadreTag_hi: 'सभी संवर्ग',
    allowedRoles: ['learner', 'trainer', 'admin'],
    keywords: ['manuals', 'documents', 'pdf', 'library', 'sop', 'guidelines'],
  },
  {
    id: 'page-credentials',
    title: 'DigiLocker Certified Competencies & Badges',
    title_hi: 'डिजिलॉकर प्रमाणित दक्षताएं एवं बैज',
    description: 'W3C verifiable credentials for verified statistical competencies.',
    description_hi: 'सत्यापित सांख्यिकीय दक्षताओं के लिए W3C सत्यापन योग्य क्रेडेंशियल।',
    category: 'page',
    href: '/credentials',
    badge: 'Verifiable Credential',
    cadreTag: 'All Cadres',
    cadreTag_hi: 'सभी संवर्ग',
    allowedRoles: ['learner', 'trainer', 'admin'],
    keywords: ['credentials', 'digilocker', 'certificate', 'badges', 'w3c'],
  },
  {
    id: 'page-correlation',
    title: 'Field Scrutiny & Outcomes Correlation',
    title_hi: 'फील्ड संवीक्षा एवं परिणाम सहसंबंध',
    description: 'Statistical correlation between training levels and field survey error drops.',
    description_hi: 'प्रशिक्षण स्तर और फील्ड सर्वेक्षण त्रुटि कमी के बीच सांख्यिकीय सहसंबंध।',
    category: 'page',
    href: '/admin/analytics/correlation',
    badge: 'Econometric Fit',
    cadreTag: 'MoSPI HQ Command',
    cadreTag_hi: 'MoSPI मुख्यालय',
    allowedRoles: ['admin'],
    keywords: ['correlation', 'regression', 'scrutiny', 'error', 'outcomes', 'roi'],
  },
];

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHindi?: boolean;
  userRole?: UserRole;
  userCadre?: string;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  isHindi = false,
  userRole,
  userCadre,
}: GlobalSearchModalProps) {
  if (!isOpen) return null;
  return (
    <GlobalSearchModalContent
      onClose={onClose}
      isHindi={isHindi}
      userRole={userRole}
      userCadre={userCadre}
    />
  );
}

function GlobalSearchModalContent({
  onClose,
  isHindi = false,
  userRole,
  userCadre,
}: {
  onClose: () => void;
  isHindi?: boolean;
  userRole?: UserRole;
  userCadre?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'competency' | 'manual' | 'page'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  // Role-scoped item pool: if userRole is specified, only include items permitted for that role
  const roleScopedItems = useMemo(() => {
    if (!userRole) return SEARCH_REGISTRY;
    return SEARCH_REGISTRY.filter((item) => {
      if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
      return item.allowedRoles.includes(userRole);
    });
  }, [userRole]);

  // Filter items based on query and selected category
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = roleScopedItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Query filter
      if (!q) return true;
      const titleMatch = item.title.toLowerCase().includes(q) || item.title_hi.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q) || item.description_hi.toLowerCase().includes(q);
      const keywordMatch = item.keywords?.some((k) => k.toLowerCase().includes(q));
      const cadreMatch = item.cadreTag?.toLowerCase().includes(q) || item.cadreTag_hi?.toLowerCase().includes(q);
      return titleMatch || descMatch || keywordMatch || cadreMatch;
    });

    if (userCadre) {
      const cadreNorm = userCadre.toLowerCase();
      return [...items].sort((a, b) => {
        const aMatch = (a.cadreTag && cadreNorm.includes(a.cadreTag.toLowerCase())) ? 1 : 0;
        const bMatch = (b.cadreTag && cadreNorm.includes(b.cadreTag.toLowerCase())) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return items;
  }, [roleScopedItems, query, activeCategory, userCadre]);

  const quickShortcuts = useMemo(() => {
    if (userRole === 'trainer') {
      return [
        { label: isHindi ? 'संकाय समीक्षा कतार' : 'Review Queue', q: 'review' },
        { label: isHindi ? 'MCQ जनरेटर' : 'MCQ Generator', q: 'mcq' },
        { label: isHindi ? 'फील्ड मैनुअल' : 'Field Manuals', q: 'manual' },
        { label: isHindi ? 'दस्तावेज़ संग्रह' : 'Documents', q: 'documents' },
        { label: isHindi ? 'दक्षताएं' : 'Competencies', q: 'comp' },
      ];
    }
    if (userRole === 'admin') {
      return [
        { label: isHindi ? 'विभाग विश्लेषण' : 'Department Analytics', q: 'analytics' },
        { label: isHindi ? 'संवीक्षा सहसंबंध' : 'Outcomes Correlation', q: 'correlation' },
        { label: isHindi ? 'समीक्षा कतार' : 'Review Queue', q: 'review' },
        { label: isHindi ? 'कौशल मैट्रिक्स' : 'Skill Gap', q: 'gap' },
        { label: isHindi ? 'फील्ड मैनुअल' : 'Manuals', q: 'manual' },
      ];
    }
    // Learner / Default
    return [
      { label: isHindi ? 'कैपी टैबलेट' : 'CAPI Tablet', q: 'capi' },
      { label: isHindi ? 'PLFS मैनुअल' : 'PLFS Manual', q: 'plfs' },
      { label: isHindi ? 'सीमांकन' : 'Demarcation', q: 'demarcation' },
      { label: isHindi ? 'कौशल अंतराल' : 'Skill Gap', q: 'gap' },
      { label: isHindi ? 'पाठ्यक्रम' : 'Courses', q: 'courses' },
      { label: isHindi ? 'अभ्यास प्रश्न' : 'Practice MCQ', q: 'mcq' },
    ];
  }, [userRole, isHindi]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  const handleCategoryChange = (cat: typeof activeCategory) => {
    setActiveCategory(cat);
    setSelectedIndex(0);
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, filteredItems.length - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Clean navigation: opens remediation modal if on dashboard, or navigates to skill gap / target page
  const handleSelectItem = (item: SearchItem) => {
    onClose();
    if (
      item.category === 'competency' &&
      typeof window !== 'undefined' &&
      window.location.pathname === '/dashboard'
    ) {
      window.dispatchEvent(
        new CustomEvent('open-bridge-gap', { detail: { competencyId: item.id } })
      );
    } else {
      router.push(item.href);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/40 backdrop-blur-md transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25),0_0_1px_1px_rgba(255,255,255,0.9)_inset,0_0_0_1px_rgba(203,213,225,0.6)] overflow-hidden flex flex-col max-h-[82vh] transition-all animate-in fade-in-0 zoom-in-[0.98] duration-200 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Subtle Sovereign Accent Gradient Bar */}
        <div className="h-[2.5px] w-full bg-gradient-to-r from-[#1C4CA1] via-[#1164BE] to-[#FFA72F]" />

        {/* Minimal Rich Search Input Bar */}
        <div className="flex items-center gap-3.5 px-5 py-4 bg-white/90 border-b border-slate-100/90">
          <Search className="h-5 w-5 text-slate-400 shrink-0 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={
              isHindi
                ? 'दक्षताएं, फील्ड मैनुअल, प्रश्न या पेज खोजें...'
                : 'Search competencies, manuals, questions, or pages...'
            }
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              minHeight: 'unset',
              boxShadow: 'none',
              padding: 0,
            }}
            className="flex-1 !bg-transparent !border-0 !outline-none !shadow-none !ring-0 !p-0 !min-h-0 text-[15px] sm:text-base text-slate-900 placeholder:text-slate-400 font-normal selection:bg-[#1C4CA1]/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Clear query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-slate-200/90 bg-slate-50/80 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 shadow-2xs tracking-wider">
            ESC
          </kbd>
        </div>

        {/* Minimalist Segmented Pill Navigation */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50/60 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: isHindi ? 'सभी' : 'All Results', count: roleScopedItems.length },
            {
              id: 'competency',
              label: isHindi ? 'दक्षताएं (FRAC)' : 'Competencies',
              count: roleScopedItems.filter((s) => s.category === 'competency').length,
            },
            {
              id: 'manual',
              label: isHindi ? 'फील्ड मैनुअल' : 'Field Manuals',
              count: roleScopedItems.filter((s) => s.category === 'manual').length,
            },
            {
              id: 'page',
              label: isHindi ? 'पेज एवं नेविगेशन' : 'Platform Pages',
              count: roleScopedItems.filter((s) => s.category === 'page').length,
            },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id as typeof activeCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-slate-200/80'
                    : 'text-slate-500 font-medium hover:text-slate-800 hover:bg-slate-200/40 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${
                    isActive ? 'bg-slate-100 text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Container */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-2xl bg-slate-100/90 border border-slate-200/60 flex items-center justify-center mb-3 text-slate-400 shadow-2xs">
                <Search className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {isHindi ? 'कोई परिणाम नहीं मिला' : 'No matching results found'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                {isHindi
                  ? 'कृपया किसी अन्य शब्द जैसे "CAPI", "Manual", "PLFS", या "Scrutiny" से खोजें।'
                  : 'Try searching with keywords like "CAPI", "PLFS", "Demarcation", or "Review Queue".'}
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const title = isHindi ? item.title_hi : item.title;
              const desc = isHindi ? item.description_hi : item.description;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-slate-50/95 border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)]'
                      : 'hover:bg-slate-50/50 border border-transparent'
                  }`}
                >
                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <div className="absolute left-0 inset-y-2.5 w-1 rounded-r-full bg-[#1C4CA1]" />
                  )}

                  <div className="flex items-center gap-3.5 min-w-0 flex-1 pl-1">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        item.category === 'competency'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : item.category === 'manual'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      }`}
                    >
                      {item.category === 'competency' && <Target className="h-4 w-4" />}
                      {item.category === 'manual' && <BookOpen className="h-4 w-4" />}
                      {item.category === 'page' && <LayoutDashboard className="h-4 w-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13px] sm:text-sm font-semibold text-slate-900 truncate tracking-tight">
                          {title}
                        </span>
                        {item.cadreTag && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/70 shrink-0">
                            {isHindi ? item.cadreTag_hi || item.cadreTag : item.cadreTag}
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1C4CA1]/8 text-[#1C4CA1] border border-[#1C4CA1]/15 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-normal leading-normal">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`shrink-0 ml-3 flex items-center gap-1.5 text-xs transition-all ${
                      isSelected
                        ? 'text-[#1C4CA1] font-semibold bg-[#1C4CA1]/8 px-2.5 py-1 rounded-lg border border-[#1C4CA1]/15'
                        : 'text-slate-400 font-medium group-hover:text-slate-600 px-2 py-1'
                    }`}
                  >
                    <span className="hidden sm:inline">
                      {item.category === 'competency'
                        ? isHindi
                          ? 'मूल्यांकन दें'
                          : 'Bridge Gap'
                        : item.category === 'manual'
                          ? isHindi
                            ? 'मैनुअल पढ़ें'
                            : 'Read Manual'
                          : isHindi
                            ? 'खोलें'
                            : 'Open Page'}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestion Chips when query is empty */}
        {!query && (
          <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[11px] font-semibold text-slate-600 tracking-wide">
                {isHindi ? 'त्वरित शॉर्टकट:' : 'Quick Shortcuts:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickShortcuts.map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => handleQueryChange(pill.q)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200/90 rounded-full hover:border-slate-300 transition-all text-[11px] font-medium text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer active:scale-95"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer with Minimalist Keyboard Shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px] shadow-2xs">
                ↑↓
              </kbd>{' '}
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px] shadow-2xs">
                ↵
              </kbd>{' '}
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px] shadow-2xs">
                esc
              </kbd>{' '}
              close
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 tracking-wide">
            StatVidya Search Engine • MoSPI
          </span>
        </div>
      </div>
    </div>
  );
}
