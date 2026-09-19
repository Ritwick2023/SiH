'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { AppUser } from '@/lib/auth';
import { getPersonaFRAC } from '@/data/fracCadres';
import { CompetencyService } from '@/services/competencyService';
import {
  LearningCatalogService,
  type RankedLearningRecommendation,
} from '@/services/learningCatalogService';
import type { OfficialLearningItem } from '@/data/officialLearningCatalog';
import type { CompetencyGap } from '@/lib/types';
import {
  Search,
  BookOpen,
  Building2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  PlayCircle,
  ArrowRight,
  Filter,
  CheckCircle2,
  GraduationCap,
  FileText,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useSafeLocale } from '@/lib/useSafeLocale';

interface PathwaysClientProps {
  user?: AppUser | null;
}

function LearningHubContent({ user }: PathwaysClientProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const globalLocale = useSafeLocale(user?.user_metadata?.preferred_language || 'en');

  const initialCompetency = searchParams.get('competency') || 'all';
  const initialTab = (searchParams.get('tab') as 'recommended' | 'courses' | 'manuals' | 'all') || 'recommended';

  // Active user FRAC profile
  const profile = getPersonaFRAC(user);
  const isHindi =
    globalLocale === 'hi' ||
    user?.user_metadata?.preferred_language === 'hi' ||
    profile.preferredLanguage === 'hi' ||
    user?.id?.includes('sunita');

  // Compute active gaps
  const gaps: CompetencyGap[] = useMemo(() => {
    return profile.competencies.map((comp) => {
      const gap = Math.max(0, comp.targetLevel - comp.currentLevel);
      const severityScore = CompetencyService.computeGapSeverity(comp.currentLevel, comp.targetLevel, comp.priority);
      const severity = CompetencyService.classifySeverity(severityScore);

      return {
        competencyId: comp.id,
        competency: {
          id: comp.id,
          name: isHindi ? comp.name_hi : comp.name,
          name_hi: comp.name_hi,
          category: comp.category,
          description: isHindi ? comp.description_hi : comp.description,
          description_hi: comp.description_hi,
          levels: comp.levels,
          provenance: comp.provenance,
          created_at: new Date().toISOString(),
        },
        activity: {
          id: `act-${comp.id}`,
          name: isHindi ? comp.activityName_hi : comp.activityName,
          name_hi: comp.activityName_hi,
          description: comp.description,
          role_id: profile.personaId,
          provenance: comp.provenance,
          created_at: new Date().toISOString(),
        },
        currentLevel: comp.currentLevel,
        targetLevel: comp.targetLevel,
        gap,
        priority: comp.priority,
        severity,
        evidenceType: comp.evidenceType,
      };
    });
  }, [profile, isHindi]);

  // Overall metrics
  const userRecords = useMemo(() => new Map(profile.competencies.map((c) => [c.id, c.currentLevel])), [profile]);
  const required = useMemo(() => profile.competencies.map((c) => ({ competencyId: c.id, targetLevel: c.targetLevel })), [profile]);
  const readinessIndex = useMemo(() => CompetencyService.computeReadinessIndex(required, userRecords), [required, userRecords]);
  const activeGapsCount = useMemo(() => gaps.filter((g) => g.gap > 0).length, [gaps]);

  // Ranked recommendations
  const rankedRecommendations = useMemo(() => {
    return LearningCatalogService.rankForGaps(gaps, user);
  }, [gaps, user]);

  // Filter and view state
  const [activeTab, setActiveTab] = useState<'recommended' | 'courses' | 'manuals' | 'all'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCompetency, setSelectedCompetency] = useState<string>(initialCompetency);

  // Filtered items logic
  const displayedItems = useMemo(() => {
    if (activeTab === 'recommended') {
      // In recommended tab, filter ranked recommendations
      return rankedRecommendations.filter((rec) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = rec.item.title.toLowerCase().includes(q) || rec.item.title_hi.toLowerCase().includes(q);
          const matchDesc = rec.item.description.toLowerCase().includes(q) || rec.item.description_hi.toLowerCase().includes(q);
          const matchTopic = rec.item.topics.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTopic) return false;
        }

        if (selectedProvider !== 'all' && !rec.item.provider.toLowerCase().includes(selectedProvider.toLowerCase())) {
          return false;
        }

        if (selectedLanguage !== 'all') {
          if (selectedLanguage === 'Hindi' && rec.item.language === 'English') return false;
          if (selectedLanguage === 'English' && rec.item.language === 'Hindi') return false;
        }

        if (selectedCompetency !== 'all' && !rec.item.targetCompetencies.includes(selectedCompetency)) {
          return false;
        }

        return true;
      });
    }

    // In other tabs, filter full catalog
    let typeFilter = 'all';
    if (activeTab === 'courses') typeFilter = 'courses';
    if (activeTab === 'manuals') typeFilter = 'manuals';

    return LearningCatalogService.filter({
      query: searchQuery,
      type: typeFilter,
      provider: selectedProvider,
      language: selectedLanguage,
      competencyId: selectedCompetency,
    });
  }, [activeTab, rankedRecommendations, searchQuery, selectedProvider, selectedLanguage, selectedCompetency]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProvider('all');
    setSelectedLanguage('all');
    setSelectedCompetency('all');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#2d1f17] tracking-tight">
              {isHindi ? 'आधिकारिक सांख्यिकी शिक्षण एवं पाठ्यक्रम केंद्र' : 'Official Learning & Courses Hub'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isHindi
              ? 'एनएसएसटीए एवं सांख्यिकी मंत्रालय (MoSPI) द्वारा प्रमाणित प्रशिक्षण कार्यक्रम और फील्ड नियमावलियां'
              : 'Grounded in Official Training Programmes & Publications from NSSTA & MoSPI'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-[#555934]/10 text-[#555934] text-xs font-bold inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Mission Karmayogi FRAC</span>
          </span>
        </div>
      </div>

      {/* 3 Executive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Readiness Index */}
        <div className="rounded-2xl bg-white p-5 border border-[#BF9B7A]/30 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold block">
              {isHindi ? 'समग्र कैडर तत्परता' : 'Cadre Readiness Index'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#555934] font-mono mt-0.5 block">
              {readinessIndex}%
            </span>
            <span className="text-[11px] text-muted-foreground">
              {readinessIndex >= 70 ? (isHindi ? 'अधिकांश क्षमताएं पूरी हैं' : 'Field ready') : (isHindi ? 'प्राथमिकता अंतर मौजूद' : 'Gaps to address')}
            </span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-[#555934]/10 text-[#555934] flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        {/* Priority Gaps */}
        <div className="rounded-2xl bg-white p-5 border border-[#BF9B7A]/30 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold block">
              {isHindi ? 'सक्रिय क्षमता अंतर' : 'Active Competency Gaps'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#8C5B3E] font-mono mt-0.5 block">
              {activeGapsCount}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {isHindi ? 'लक्षित शिक्षण से सुधारें' : 'Targeted by official courses'}
            </span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-[#8C5B3E]/10 text-[#8C5B3E] flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        {/* Official Resources */}
        <div className="rounded-2xl bg-white p-5 border border-[#BF9B7A]/30 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold block">
              {isHindi ? 'सत्यापित सरकारी संसाधन' : 'Verified Official Catalog'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#2d1f17] font-mono mt-0.5 block">
              10
            </span>
            <span className="text-[11px] text-muted-foreground">
              NSSTA (G. Noida) & MoSPI
            </span>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-[#F2E6D8] text-[#2d1f17] flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main View Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#BF9B7A]/25 text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('recommended')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'recommended'
              ? 'bg-[#555934] text-white shadow-2xs font-black'
              : 'bg-white text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17] border border-[#BF9B7A]/20'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#F8C858]" />
          <span>{isHindi ? 'आपके अंतर के लिए अनुशंसित' : 'Recommended for Your Gaps'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {rankedRecommendations.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'courses'
              ? 'bg-[#555934] text-white shadow-2xs font-black'
              : 'bg-white text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17] border border-[#BF9B7A]/20'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5 text-[#8C5B3E]" />
          <span>{isHindi ? 'एनएसएसटीए प्रशिक्षण एवं कार्यशालाएं' : 'NSSTA Courses & Workshops'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manuals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'manuals'
              ? 'bg-[#555934] text-white shadow-2xs font-black'
              : 'bg-white text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17] border border-[#BF9B7A]/20'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5 text-[#555934]" />
          <span>{isHindi ? 'आधिकारिक फील्ड नियमावलियां (MoSPI)' : 'Official Field Manuals (MoSPI)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'all'
              ? 'bg-[#555934] text-white shadow-2xs font-black'
              : 'bg-white text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17] border border-[#BF9B7A]/20'
          }`}
        >
          <span>{isHindi ? 'समस्त संसाधन (कैटलॉग)' : 'All Resources'}</span>
        </button>
      </div>

      {/* Search & Multi-Criteria Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#BF9B7A]/30 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Live Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHindi
                  ? 'पाठ्यक्रम, मैनुअल, विषय या कीवर्ड खोजें (उदा. CAPI, PLFS, Scrutiny)...'
                  : 'Search by title, topic, manual, or competency (e.g., CAPI, PLFS, Scrutiny)...'
              }
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 focus:outline-none focus:ring-2 focus:ring-[#555934]/30 focus:border-[#555934] text-[#2d1f17] placeholder:text-muted-foreground"
            />
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-[#2d1f17] font-semibold focus:outline-none"
            >
              <option value="all">{isHindi ? 'सभी प्रदाता' : 'All Providers'}</option>
              <option value="NSSTA">NSSTA (Academy)</option>
              <option value="MoSPI">MoSPI (Ministry)</option>
              <option value="NSSO">NSSO FOD</option>
            </select>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-[#2d1f17] font-semibold focus:outline-none"
            >
              <option value="all">{isHindi ? 'सभी भाषाएँ' : 'All Languages'}</option>
              <option value="Hindi">{isHindi ? 'हिंदी / द्विभाषी' : 'Hindi / Bilingual'}</option>
              <option value="English">English</option>
            </select>

            {/* Competency Filter */}
            <select
              value={selectedCompetency}
              onChange={(e) => setSelectedCompetency(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-[#2d1f17] font-semibold focus:outline-none"
            >
              <option value="all">{isHindi ? 'सभी FRAC क्षमताएं' : 'All Competencies'}</option>
              <option value="comp-capi">{isHindi ? 'कैपी टैबलेट संचालन' : 'CAPI Operations'}</option>
              <option value="comp-nsso">{isHindi ? 'एनएसएसओ सर्वेक्षण' : 'PLFS & Schedule 0.0'}</option>
              <option value="comp-data">{isHindi ? 'डेटा संवीक्षा' : 'Statistical Scrutiny'}</option>
              <option value="comp-survey">{isHindi ? 'नमूनाकरण डिजाइन' : 'Sampling Theory'}</option>
              <option value="comp-informant">{isHindi ? 'सूचनादाता नैतिकता' : 'Informant Ethics'}</option>
              <option value="comp-teamwork">{isHindi ? 'फील्ड समन्वय' : 'Teamwork'}</option>
            </select>

            {(searchQuery || selectedProvider !== 'all' || selectedLanguage !== 'all' || selectedCompetency !== 'all') && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-2.5 py-2 text-xs text-muted-foreground hover:text-[#8C5B3E] font-semibold inline-flex items-center gap-1 cursor-pointer"
                title="Reset Filters"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Course / Learning Cards */}
      <div className="space-y-4">
        {displayedItems.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-[#FAF6F0] text-muted-foreground flex items-center justify-center mx-auto">
              <Filter className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#2d1f17]">
                {isHindi ? 'कोई मेल खाता शिक्षण संसाधन नहीं मिला' : 'No matching learning resources found'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {isHindi
                  ? 'कृपया अन्य कीवर्ड, भाषा, या क्षमता फ़िल्टर चुनकर पुन: प्रयास करें।'
                  : 'Try adjusting your search query, provider, or competency filter to browse available materials.'}
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors cursor-pointer"
            >
              {isHindi ? 'फ़िल्टर रीसेट करें' : 'Clear All Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {displayedItems.map((entry) => {
              // Discriminate between RankedRecommendation and raw OfficialLearningItem
              const item = 'item' in entry ? (entry as RankedLearningRecommendation).item : (entry as OfficialLearningItem);
              const recommendation = 'item' in entry ? (entry as RankedLearningRecommendation) : undefined;

              const title = isHindi && item.title_hi ? item.title_hi : item.title;
              const description = isHindi && item.description_hi ? item.description_hi : item.description;
              const provider = isHindi && item.provider_hi ? item.provider_hi : item.provider;
              const whyRecommended = recommendation
                ? (isHindi && recommendation.whyRecommended_hi ? recommendation.whyRecommended_hi : recommendation.whyRecommended)
                : null;

              const isOfficial = item.provenance === 'VERIFIED_OFFICIAL';
              const primaryCompId = item.targetCompetencies[0] || 'comp-capi';

              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header Strip: Type + Provenance */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#555934]/15 text-[#555934]">
                          {item.source_type.replace('_', ' ')}
                        </span>

                        {isOfficial ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#555934]/10 text-[#555934]">
                            <ShieldCheck className="h-3 w-3" />
                            <span>{item.source_domain}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-800">
                            <AlertCircle className="h-3 w-3" />
                            <span>Demo Module</span>
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F2E6D8] text-[#2d1f17]">
                          {item.language}
                        </span>
                      </div>

                      {item.duration && (
                        <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                          {item.duration}
                        </span>
                      )}
                    </div>

                    {/* Title & Provider */}
                    <div className="space-y-1">
                      <Link
                        href={`/pathways/${item.id}`}
                        className="group-hover:text-[#555934] transition-colors"
                      >
                        <h3 className="text-base font-bold text-[#2d1f17] hover:text-[#555934] transition-colors line-clamp-2">
                          {title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-[#8C5B3E] font-medium">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{provider}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {description}
                    </p>

                    {/* Explainability / Why Recommended Callout */}
                    {whyRecommended && (
                      <div className="rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 p-3 space-y-1">
                        <span className="text-[10px] font-bold text-[#8C5B3E] uppercase tracking-wider block">
                          {isHindi ? 'आपके अंतर के लिए अनुशंसित' : 'Recommended for Your Gap'}
                        </span>
                        <p className="text-xs text-[#2d1f17] leading-relaxed">
                          {whyRecommended}
                        </p>
                      </div>
                    )}

                    {/* Competency Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-muted-foreground font-medium mr-1">
                        {isHindi ? 'लक्षित क्षमता:' : 'Targets:'}
                      </span>
                      {item.targetCompetencies.map((cId) => (
                        <span
                          key={cId}
                          className="px-2.5 py-0.5 rounded-lg bg-[#FAF6F0] border border-[#BF9B7A]/30 text-[11px] font-semibold text-[#2d1f17]"
                        >
                          {cId}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-[#BF9B7A]/20 flex items-center justify-between gap-3">
                    <Link
                      href={`/pathways/${item.id}`}
                      className="text-xs font-bold text-[#555934] hover:text-[#434728] inline-flex items-center gap-1"
                    >
                      <span>{isHindi ? 'विवरण देखें' : 'View Details'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#BF9B7A]/40 text-[#2d1f17] hover:bg-[#FAF6F0] text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="Open source website"
                      >
                        <span>{isHindi ? 'आधिकारिक स्रोत' : 'Source'}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <Link
                        href={`/assessment/${primaryCompId}`}
                        className="px-3.5 py-1.5 rounded-xl bg-[#555934] text-white hover:bg-[#434728] text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>{isHindi ? 'मूल्यांकन' : 'Assess'}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PathwaysClient({ user }: PathwaysClientProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Learning Hub...</div>}>
      <LearningHubContent user={user} />
    </Suspense>
  );
}
