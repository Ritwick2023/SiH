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

import { DEMO_PERSONAS } from '@/lib/demoPersonas';

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
    href: '/assessment/comp-capi',
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
    href: '/assessment/comp-nsso',
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
    href: '/assessment/comp-survey',
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
    href: '/assessment/comp-data',
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
    href: '/assessment/comp-demarcation',
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
    href: '/assessment/comp-scrutiny',
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
    targetPersonaEmail: 'priya.verma@nssta.gov.in',
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
    targetPersonaEmail: 'rajesh.kumar@mospi.gov.in',
    keywords: ['analytics', 'admin', 'rajesh', 'correlation', 'metrics', 'ro', 'error', 'readiness'],
  },
];

function setDemoUserCookie(persona: unknown) {
  if (typeof document === 'undefined') return;
  document.cookie = `demo_user=${encodeURIComponent(
    JSON.stringify(persona)
  )};path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax`;
}

function navigateToUrl(url: string) {
  if (typeof window === 'undefined') return;
  window.location.assign(url);
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHindi?: boolean;
}

export function GlobalSearchModal({ isOpen, onClose, isHindi = false }: GlobalSearchModalProps) {
  if (!isOpen) return null;
  return <GlobalSearchModalContent onClose={onClose} isHindi={isHindi} />;
}

function GlobalSearchModalContent({
  onClose,
  isHindi = false,
}: {
  onClose: () => void;
  isHindi?: boolean;
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

  // Filter items based on query and selected category
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEARCH_REGISTRY.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Query filter
      if (!q) return true;
      const titleMatch = item.title.toLowerCase().includes(q) || item.title_hi.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q) || item.description_hi.toLowerCase().includes(q);
      const keywordMatch = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return titleMatch || descMatch || keywordMatch;
    });
  }, [query, activeCategory]);

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

  const handleSelectItem = (item: SearchItem) => {
    onClose();
    if (item.targetPersonaEmail) {
      try {
        const persona = DEMO_PERSONAS.find(
          (p) => p.email.toLowerCase() === item.targetPersonaEmail?.toLowerCase()
        );
        if (persona) {
          setDemoUserCookie(persona);
          navigateToUrl(item.href);
          return;
        }
      } catch {
        // Fallback to normal navigation
      }
    }
    router.push(item.href);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in-0 zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#D8DFEE] bg-stone-50/50">
          <Search className="h-5 w-5 text-[#1C4CA1] shrink-0" />
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
            className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleQueryChange('')}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition cursor-pointer"
              aria-label="Clear query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-[#D8DFEE] bg-white px-2 py-0.5 text-[10px] font-mono text-stone-500 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-[#D8DFEE] overflow-x-auto">
          {[
            { id: 'all', label: isHindi ? 'सभी' : 'All Results', count: SEARCH_REGISTRY.length },
            {
              id: 'competency',
              label: isHindi ? 'दक्षताएं (FRAC)' : 'Competencies',
              count: SEARCH_REGISTRY.filter((s) => s.category === 'competency').length,
            },
            {
              id: 'manual',
              label: isHindi ? 'फील्ड मैनुअल' : 'Field Manuals',
              count: SEARCH_REGISTRY.filter((s) => s.category === 'manual').length,
            },
            {
              id: 'page',
              label: isHindi ? 'पेज एवं नेविगेशन' : 'Platform Pages',
              count: SEARCH_REGISTRY.filter((s) => s.category === 'page').length,
            },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id as typeof activeCategory)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1C4CA1] text-white shadow-2xs'
                  : 'bg-[#EDF0F7] text-stone-600 hover:bg-[#D8DFEE]/60'
              }`}
            >
              {cat.label} <span className="opacity-70 text-[10px]">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-stone-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">
                {isHindi ? 'कोई परिणाम नहीं मिला' : 'No matching results found'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
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
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#EDF0F7] border border-[#D8DFEE]' : 'hover:bg-stone-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        item.category === 'competency'
                          ? 'bg-emerald-100/80 text-emerald-800'
                          : item.category === 'manual'
                            ? 'bg-amber-100/80 text-amber-800'
                            : 'bg-blue-100/80 text-blue-800'
                      }`}
                    >
                      {item.category === 'competency' && <Target className="h-4 w-4" />}
                      {item.category === 'manual' && <BookOpen className="h-4 w-4" />}
                      {item.category === 'page' && <LayoutDashboard className="h-4 w-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-stone-900 truncate">{title}</span>
                        {item.cadreTag && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20 shrink-0">
                            {isHindi ? item.cadreTag_hi || item.cadreTag : item.cadreTag}
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{desc}</p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-3 flex items-center gap-1.5 text-xs font-semibold text-[#1C4CA1]">
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

        {/* Quick Suggestion Pills when query is empty */}
        {!query && (
          <div className="p-3 bg-stone-50/80 border-t border-[#D8DFEE] text-xs text-stone-500">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="font-bold text-stone-700">
                {isHindi ? 'लोकप्रिय खोजें:' : 'Quick Shortcuts:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'CAPI Tablet', q: 'capi' },
                { label: 'PLFS Manual', q: 'plfs' },
                { label: 'Demarcation', q: 'demarcation' },
                { label: 'Question Bank', q: 'mcq' },
                { label: 'Faculty Review', q: 'review' },
                { label: 'Skill Gap', q: 'gap' },
              ].map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => handleQueryChange(pill.q)}
                  className="px-2.5 py-1 bg-white border border-[#D8DFEE] rounded-lg hover:border-[#1C4CA1] hover:text-[#1C4CA1] transition text-[11px] font-medium text-stone-600 cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer with Keyboard Shortcuts */}
        <div className="px-4 py-2.5 bg-white border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 text-stone-600">
                ↑↓
              </kbd>{' '}
              navigate
            </span>
            <span>
              <kbd className="font-mono bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 text-stone-600">
                ↵
              </kbd>{' '}
              open
            </span>
            <span>
              <kbd className="font-mono bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 text-stone-600">
                esc
              </kbd>{' '}
              close
            </span>
          </div>
          <span className="text-[10px] text-stone-400">StatVidya Search Engine • MoSPI</span>
        </div>
      </div>
    </div>
  );
}
