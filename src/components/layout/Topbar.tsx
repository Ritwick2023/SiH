'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Search,
  Award,
  ExternalLink,
  Globe,
  Sparkles,
  Check,
  Menu,
  Wifi,
  ClipboardCheck,
  GraduationCap,
  Target,
  Flag,
  Download,
  FileUp,
  Mic,
} from 'lucide-react';
import { Notification } from '@/components/notifications/types';
import { getInitialNotifications } from '@/components/notifications/notification-data';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona, UserRole } from '@/lib/types';
import { LearnerKarmaLedgerModal } from '@/components/dashboard/learner/modals/LearnerKarmaLedgerModal';
import { CAPIConnectivityModal } from '@/components/dashboard/learner/modals/CAPIConnectivityModal';
import { MinisterialBriefingModal } from '@/components/dashboard/admin/modals/MinisterialBriefingModal';
import { NationalReadinessModal } from '@/components/dashboard/admin/modals/NationalReadinessModal';
import { FlaggedRegionsModal } from '@/components/dashboard/admin/modals/FlaggedRegionsModal';
import { GlobalSearchModal } from './GlobalSearchModal';
import { getPendingCount } from '@/services/offlineService';

function getInitialPersona(): DemoPersona {
  if (typeof document === 'undefined') return DEMO_PERSONAS[0];
  try {
    const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
    if (match) {
      const decoded = JSON.parse(decodeURIComponent(match[1]));
      const found = DEMO_PERSONAS.find(
        (p) => p.email?.toLowerCase() === decoded.email?.toLowerCase()
      );
      if (found) return found;
      if (decoded.role) {
        return {
          id: decoded.id || 'custom-user',
          name: decoded.name || 'Civil Officer',
          email: decoded.email || 'user@mospi.gov.in',
          role: decoded.role as UserRole,
          designation: decoded.designation || 'Statistical Officer',
          cadre: decoded.cadre || 'MoSPI Cadre',
          organization_id: 'org-mospi',
          preferred_language: (decoded.preferred_language as 'en' | 'hi') || 'en',
          department: decoded.department || 'MoSPI Headquarters',
        };
      }
    }
  } catch {
    // Fallback to default
  }
  return DEMO_PERSONAS[0];
}

function setPersonaCookie(persona: DemoPersona) {
  if (typeof document === 'undefined') return;
  document.cookie = `demo_user=${encodeURIComponent(
    JSON.stringify(persona)
  )}; path=/; max-age=604800`;
  document.cookie = `locale=${
    persona.preferred_language || 'en'
  }; path=/; max-age=31536000`;
}

function clearPersonaCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

interface TopbarProps {
  initialRole?: UserRole;
}

export function Topbar({ initialRole }: TopbarProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');

  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [karmaModalOpen, setKarmaModalOpen] = useState(false);
  const [capiModalOpen, setCapiModalOpen] = useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [adminBriefingOpen, setAdminBriefingOpen] = useState(false);
  const [adminReadinessOpen, setAdminReadinessOpen] = useState(false);
  const [adminFlaggedOpen, setAdminFlaggedOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [pendingVaultCount, setPendingVaultCount] = useState(0);

  // Task D1: Monitor IndexedDB pending sync queue count
  useEffect(() => {
    let isMounted = true;
    const checkPending = async () => {
      try {
        if (typeof window !== 'undefined' && 'indexedDB' in window) {
          const count = await getPendingCount();
          if (isMounted) setPendingVaultCount(count);
        }
      } catch {
        // graceful fallback
      }
    };
    checkPending();
    const interval = setInterval(checkPending, 8000);
    window.addEventListener('online', checkPending);
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('online', checkPending);
    };
  }, []);

  const [activePersona, setActivePersona] = useState<DemoPersona>(() => {
    const fromCookie = getInitialPersona();
    if (initialRole && fromCookie.role !== initialRole) {
      const matched = DEMO_PERSONAS.find((p) => p.role === initialRole);
      return matched || fromCookie;
    }
    return fromCookie;
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Global ⌘K / Ctrl+K keyboard shortcut for Search Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync with cookie changes
  useEffect(() => {
    const checkCookie = () => {
      const persona = getInitialPersona();
      setActivePersona((prev) => (prev.email !== persona.email ? persona : prev));
    };

    checkCookie();
    const interval = setInterval(checkCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  const role: UserRole = initialRole || activePersona.role || 'learner';

  // Notifications state initialized with active persona's role
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getInitialNotifications(role)
  );

  // Close menus on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (switcherRef.current && !switcherRef.current.contains(target)) {
        setSwitcherOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
        setMenuOpen(false);
        setSwitcherOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        router.push('/pathways');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  // Dropdown toggle handlers with mutual exclusivity
  const toggleNotifications = useCallback(() => {
    setNotificationsOpen((prev) => !prev);
    setMenuOpen(false);
    setSwitcherOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    setNotificationsOpen(false);
    setSwitcherOpen(false);
  }, []);

  const toggleSwitcher = useCallback(() => {
    setSwitcherOpen((prev) => !prev);
    setNotificationsOpen(false);
    setMenuOpen(false);
  }, []);

  // Notification action handlers
  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      if (notification.href) {
        setNotificationsOpen(false);
        router.push(notification.href);
      }
    },
    [router]
  );

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleLanguageToggle = useCallback(
    (targetLang?: 'en' | 'hi') => {
      const nextLang = targetLang || (locale === 'en' ? 'hi' : 'en');
      document.cookie = `locale=${nextLang};path=/;max-age=31536000;SameSite=Lax`;
      // Also update demo_user cookie if active so both client and server stay in sync
      try {
        const match = document.cookie.match(/(?:^|;\s*)demo_user=([^;]+)/);
        if (match) {
          const demoUser = JSON.parse(decodeURIComponent(match[1]));
          demoUser.preferred_language = nextLang;
          if (demoUser.user_metadata) {
            demoUser.user_metadata.preferred_language = nextLang;
          }
          document.cookie = `demo_user=${encodeURIComponent(
            JSON.stringify(demoUser)
          )};path=/;max-age=604800;SameSite=Lax`;
        }
      } catch {
        // Ignore cookie JSON parse error
      }
      window.location.reload();
    },
    [locale]
  );

  const handleSelectPersona = (persona: DemoPersona) => {
    setActivePersona(persona);
    setSwitcherOpen(false);
    setNotifications(getInitialNotifications(persona.role));
    setPersonaCookie(persona);
    router.push('/dashboard');
    router.refresh();
  };

  const roleColors: Record<
    string,
    { bg: string; text: string; badge: string }
  > = {
    learner: {
      bg: 'bg-[#1C4CA1]/10',
      text: 'text-[#1C4CA1]',
      badge: 'bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/20',
    },
    trainer: {
      bg: 'bg-[#1164BE]/10',
      text: 'text-[#1164BE]',
      badge: 'bg-[#1164BE]/10 text-[#1164BE] border border-[#1164BE]/20',
    },
    admin: {
      bg: 'bg-[#1F273A]/10',
      text: 'text-[#1F273A]',
      badge: 'bg-[#F9EAC1] text-[#1F273A] border border-[#FFA72F]/40',
    },
  };

  const currentRoleStyle = roleColors[role] || roleColors.learner;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const badgeLabel = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <header className="relative z-30 flex h-16 items-center justify-between bg-white border-b border-[#D8DFEE] px-4 sm:px-6 select-none shadow-xs">
      {/* Search / Context Area */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {/* Mobile Hamburger Navigation Button */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
          aria-label="Open Navigation Drawer"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF0F7]/80 border border-[#D8DFEE] text-[#1F273A] hover:bg-white hover:border-[#1C4CA1]/40 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Global Search Command Trigger Button (Desktop & Tablet) */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="hidden sm:flex items-center justify-between h-9 sm:w-32 md:w-36 lg:w-40 rounded-xl bg-[#EDF0F7]/70 border border-[#D8DFEE] px-2.5 text-xs text-[#1F273A] hover:bg-white hover:border-[#1C4CA1]/50 transition-all shadow-2xs cursor-pointer group shrink-0"
          title={locale === 'hi' ? 'दक्षताएं, मैनुअल खोजें... (⌘K)' : 'Search competencies, manuals... (⌘K)'}
          aria-label={locale === 'hi' ? 'दक्षताएं, मैनुअल खोजें' : 'Search competencies, manuals...'}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#1C4CA1] shrink-0 transition-colors" />
            <span className="truncate text-slate-500 group-hover:text-slate-700">
              {locale === 'hi' ? 'दक्षताएं, मैनुअल...' : 'Search competencies, manuals...'}
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[#D8DFEE] bg-white px-1 py-0.5 font-mono text-[9px] font-semibold text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Global Search Icon Button (Mobile Only) */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF0F7]/80 border border-[#D8DFEE] text-slate-600 hover:text-[#1C4CA1] hover:bg-white transition-colors cursor-pointer shrink-0"
          aria-label="Open Search Palette"
          title={locale === 'hi' ? 'खोजें' : 'Search'}
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Project Bhashini Voice Assistant Trigger */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('toggle-copilot-voice'));
          }}
          className="hidden md:flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-[#1C4CA1]/10 border border-[#1C4CA1]/25 text-xs font-bold text-[#1C4CA1] hover:bg-[#1C4CA1] hover:text-white transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
          title={locale === 'hi' ? 'प्रोजेक्ट भाषिणी वॉइस असिस्टेंट (हिन्दी / English)' : 'Project Bhashini Voice Assistant (Hindi / English)'}
        >
          <Mic className="h-3.5 w-3.5" />
          <span>{locale === 'hi' ? 'भाषिणी वॉइस' : 'Bhashini Voice'}</span>
        </button>

        {/* Role-Specific Context Badge Strip */}
        <div className="hidden xl:flex items-center gap-2 shrink-0 py-1">
          {role === 'learner' && (
            <>
              {/* Interactive Karma Points Counter */}
              <button
                type="button"
                onClick={() => setKarmaModalOpen(true)}
                title="View Karma Points Ledger & Badges"
                className="flex items-center gap-1.5 rounded-xl bg-soft-gold border border-[#FFA72F]/40 px-2 py-1.5 text-xs font-bold text-[#1F273A] hover:bg-soft-gold/80 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              >
                <Award className="h-3.5 w-3.5 text-[#D97706]" />
                <span className="font-mono font-bold">+550</span>
                <span className="text-[10px] text-slate-600 hidden sm:inline">Karma</span>
              </button>

              {/* Interactive CAPI & Offline Vault Engine (Task D1) */}
              <button
                type="button"
                onClick={() => setCapiModalOpen(true)}
                title="Inspect CAPI Storage & Field Offline Vault"
                className={`hidden 2xl:flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 ${
                  isOfflineSimulated
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-800 hover:bg-amber-500/25'
                    : pendingVaultCount > 0
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-900 hover:bg-amber-500/20'
                    : 'bg-emerald-500/12 border-emerald-500/25 text-emerald-800 hover:bg-emerald-500/20'
                }`}
              >
                {pendingVaultCount > 0 ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                ) : (
                  <Check className="h-3 w-3 text-emerald-600" />
                )}
                <Wifi
                  className={`h-3.5 w-3.5 ${
                    isOfflineSimulated ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                />
                <span>{isOfflineSimulated ? 'CAPI Offline' : 'Vault Active'}</span>
                <span className="text-[10px] font-mono text-emerald-700 hidden md:inline">
                  {pendingVaultCount > 0 ? `(${pendingVaultCount} queued)` : '(38 Cached)'}
                </span>
              </button>
            </>
          )}

          {role === 'trainer' && (
            <>
              {/* NSSTA Faculty Studio Badge */}
              <div className="flex items-center gap-1.5 rounded-xl bg-[#1164BE]/10 border border-[#1164BE]/25 px-3 py-1.5 text-xs font-bold text-[#1164BE]">
                <GraduationCap className="h-3.5 w-3.5 text-[#1164BE]" />
                <span>NSSTA Faculty Studio</span>
              </div>

              {/* Pending QA Counter */}
              <Link
                href="/review-queue"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-500/25 transition-colors"
              >
                <ClipboardCheck className="h-3.5 w-3.5 text-amber-700" />
                <span>14 QA Pending</span>
              </Link>

              {/* Ingest Manual Quick CTA */}
              <Link
                href="/documents"
                className="hidden lg:flex items-center gap-1.5 rounded-xl bg-[#1164BE] px-3 py-1.5 text-xs font-bold text-white hover:bg-secondary-hover transition-colors shadow-2xs"
              >
                <FileUp className="h-3.5 w-3.5" />
                <span>Ingest Manual</span>
              </Link>
            </>
          )}

          {role === 'admin' && (
            <>
              {/* National Readiness Index Capsule */}
              <button
                type="button"
                onClick={() => setAdminReadinessOpen(true)}
                title="View National FRAC Readiness Breakdown"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Target className="h-3.5 w-3.5 text-emerald-700" />
                <span>National Readiness: 72.4%</span>
              </button>

              {/* Priority Flagged ROs Capsule */}
              <button
                type="button"
                onClick={() => setAdminFlaggedOpen(true)}
                title="View Critical Flagged Regional Offices"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-800 hover:bg-red-500/25 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Flag className="h-3.5 w-3.5 text-red-600" />
                <span>2 Flagged ROs</span>
              </button>

              {/* Ministerial Briefing CTA */}
              <button
                type="button"
                onClick={() => setAdminBriefingOpen(true)}
                title="Preview Official Secretary Briefing Memo (PDF)"
                className="hidden lg:flex items-center gap-1.5 rounded-xl bg-[#1C4CA1] px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Download className="h-3.5 w-3.5 text-[#FFA72F]" />
                <span>Ministerial PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Action / Profile Area */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* 1-Click Official Persona Switcher */}
        <div className="relative" ref={switcherRef}>
          <button
            id="persona-switcher-button"
            type="button"
            onClick={toggleSwitcher}
            aria-label="Switch persona or cadre role"
            aria-expanded={switcherOpen}
            className="flex items-center gap-1.5 rounded-xl bg-[#EDF0F7]/70 border border-[#D8DFEE] px-2.5 py-1.5 text-xs font-semibold hover:bg-white hover:border-[#1C4CA1]/40 transition shadow-2xs cursor-pointer shrink-0"
            title="Switch Persona / Cadre Role"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#1C4CA1] animate-pulse shrink-0" />
            <span className="font-bold text-[#1F273A] truncate max-w-24 sm:max-w-28">
              {activePersona.name}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${currentRoleStyle.badge}`}
            >
              {role}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>

          {switcherOpen && (
            <div className="absolute right-0 mt-2 w-84 rounded-2xl bg-white border border-[#D8DFEE] p-2 shadow-card-elevated z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#D8DFEE] mb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1F273A]">
                    Switch Official Cadre
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#EDF0F7] text-[#1C4CA1] px-2 py-0.5 rounded-full border border-[#D8DFEE]">
                    Role-Gated
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Select a persona to immediately adapt the dashboard, sidebar, topbar, and tools to that role.
                </p>
              </div>

              <div className="space-y-1">
                {DEMO_PERSONAS.map((persona) => {
                  const isSelected = persona.id === activePersona.id;
                  const style = roleColors[persona.role] || roleColors.learner;

                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => handleSelectPersona(persona)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C4CA1]/10 text-[#1F273A] border border-[#1C4CA1]/25'
                          : 'hover:bg-[#EDF0F7]'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${style.bg} ${style.text}`}
                      >
                        {persona.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#1F273A] truncate">
                            {persona.name}
                          </p>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${style.badge}`}
                          >
                            {persona.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {persona.designation} • {persona.cadre}
                        </p>
                        {persona.preferred_language === 'hi' && (
                          <span className="inline-block mt-1 text-[9px] font-bold text-[#1C4CA1] bg-[#1C4CA1]/10 px-2 py-0.5 rounded-full">
                            🇮🇳 हिन्दी First (NSSO FOD)
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#1C4CA1] mt-1 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Global Language Switcher - Desktop & Tablet (Hidden on mobile to keep topbar uncluttered) */}
        <button
          type="button"
          onClick={() => handleLanguageToggle()}
          aria-label={locale === 'en' ? 'Switch interface to Hindi (हिन्दी)' : 'Switch interface to English'}
          title={locale === 'en' ? 'सम्पूर्ण इंटरफ़ेस हिन्दी में बदलें (Global)' : 'Switch entire interface to English (Global)'}
          className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#EDF0F7]/80 hover:bg-white border border-[#D8DFEE] hover:border-[#1C4CA1]/40 px-3 py-1.5 text-xs font-bold text-[#1F273A] transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer group"
        >
          <Globe className="h-3.5 w-3.5 text-[#1C4CA1] transition-transform duration-300 group-hover:rotate-45" />
          <span className="tracking-tight">{locale === 'en' ? 'हिन्दी' : 'English'}</span>
          <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-md bg-[#1C4CA1]/10 text-[#1C4CA1] border border-[#1C4CA1]/15">
            {locale === 'en' ? 'HI' : 'EN'}
          </span>
        </button>

        {/* Functional Notification Center Bell Button */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={toggleNotifications}
            aria-label={`Notifications${
              unreadCount > 0 ? `, ${unreadCount} unread` : ''
            }`}
            aria-expanded={notificationsOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF0F7]/70 border border-[#D8DFEE] text-[#475569] hover:bg-white hover:text-[#1F273A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4CA1] cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B91C1C] px-1 text-[9px] font-bold text-white shadow-2xs"
                aria-hidden="true"
              >
                {badgeLabel}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClose={() => setNotificationsOpen(false)}
            />
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="User account menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-1.5 rounded-xl bg-white border border-[#D8DFEE] px-2 py-1 text-[#1F273A] shadow-2xs hover:bg-[#EDF0F7] transition-all active:scale-98 cursor-pointer shrink-0"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C4CA1] text-white text-xs font-bold shadow-2xs shrink-0">
              {activePersona.name.charAt(0)}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#1F273A] leading-tight truncate max-w-24">
                {activePersona.name}
              </span>
              <span className="text-[10px] text-muted-foreground -mt-0.5 truncate max-w-24">
                {activePersona.designation}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#D8DFEE] p-2 shadow-card-elevated z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#D8DFEE]">
                <p className="text-xs font-bold text-[#1F273A]">
                  {activePersona.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {activePersona.email}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {activePersona.designation}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#1C4CA1]/10 px-2.5 py-0.5 text-[9px] font-semibold text-[#1C4CA1] border border-[#1C4CA1]/20">
                  {activePersona.cadre} • L1-L5 Track
                </div>
              </div>

              {/* Interface Language Segmented Switcher (Visible on both mobile & desktop inside menu) */}
              <div className="p-2.5 mx-1 my-2 rounded-xl bg-[#EDF0F7]/60 border border-[#D8DFEE]">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#1F273A]">
                    <Globe className="h-3.5 w-3.5 text-[#1C4CA1]" />
                    <span>{locale === 'hi' ? 'भाषा (Language)' : 'Interface Language'}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1C4CA1] bg-white px-2 py-0.5 rounded-full border border-[#D8DFEE]">
                    {locale === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLanguageToggle('en')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      locale === 'en'
                        ? 'bg-[#1C4CA1] text-white shadow-xs font-black'
                        : 'bg-white text-[#475569] hover:text-[#1F273A] hover:bg-slate-50 border border-[#D8DFEE]'
                    }`}
                  >
                    <span>English</span>
                    {locale === 'en' && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageToggle('hi')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      locale === 'hi'
                        ? 'bg-[#1C4CA1] text-white shadow-xs font-black'
                        : 'bg-white text-[#475569] hover:text-[#1F273A] hover:bg-slate-50 border border-[#D8DFEE]'
                    }`}
                  >
                    <span>हिन्दी</span>
                    {locale === 'hi' && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#1F273A] hover:bg-[#EDF0F7] transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-[#1C4CA1]" />
                  <span>{t('profile')}</span>
                </Link>

                <Link
                  href="/credentials"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#1F273A] hover:bg-[#EDF0F7] transition-colors"
                >
                  <Award className="h-3.5 w-3.5 text-[#FFA72F]" />
                  <span>Karmayogi Digital Passport</span>
                </Link>

                {role === 'learner' && (
                  <Link
                    href="/pathways"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#1F273A] hover:bg-[#EDF0F7] transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#FFA72F]" />
                    <span>My Learning Pathways</span>
                  </Link>
                )}

                {role === 'trainer' && (
                  <Link
                    href="/documents"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#1F273A] hover:bg-[#EDF0F7] transition-colors"
                  >
                    <FileUp className="h-3.5 w-3.5 text-[#1164BE]" />
                    <span>Faculty Documents Repository</span>
                  </Link>
                )}

                <a
                  href="https://igotkarmayogi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-[#EDF0F7] hover:text-[#1F273A] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    iGOT Portal
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">Gov.in</span>
                </a>
              </div>

              <div className="pt-1 border-t border-[#D8DFEE]">
                <button
                  type="button"
                  onClick={() => {
                    clearPersonaCookie();
                    setMenuOpen(false);
                    router.push('/auth/login');
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#B91C1C] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Learner Modals */}
      {role === 'learner' && (
        <>
          <LearnerKarmaLedgerModal
            isOpen={karmaModalOpen}
            onClose={() => setKarmaModalOpen(false)}
            isHindi={locale === 'hi'}
          />
          <CAPIConnectivityModal
            isOpen={capiModalOpen}
            onClose={() => setCapiModalOpen(false)}
            isHindi={locale === 'hi'}
            isOfflineSimulated={isOfflineSimulated}
            onToggleOfflineSimulated={() => setIsOfflineSimulated((prev) => !prev)}
          />
        </>
      )}

      {/* Interactive Admin Modals */}
      {role === 'admin' && (
        <>
          <MinisterialBriefingModal
            isOpen={adminBriefingOpen}
            onClose={() => setAdminBriefingOpen(false)}
          />
          <NationalReadinessModal
            isOpen={adminReadinessOpen}
            onClose={() => setAdminReadinessOpen(false)}
          />
          <FlaggedRegionsModal
            isOpen={adminFlaggedOpen}
            onClose={() => setAdminFlaggedOpen(false)}
          />
        </>
      )}

      {/* Global Command Search Palette Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        isHindi={locale === 'hi'}
      />
    </header>
  );
}

export default Topbar;
