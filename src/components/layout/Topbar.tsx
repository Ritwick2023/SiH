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
  BookOpen,
} from 'lucide-react';
import { Notification } from '@/components/notifications/types';
import { getInitialNotifications } from '@/components/notifications/notification-data';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona, UserRole } from '@/lib/types';
import type { AppUser } from '@/lib/auth';
import { LearnerKarmaLedgerModal } from '@/components/dashboard/learner/modals/LearnerKarmaLedgerModal';
import { CAPIConnectivityModal } from '@/components/dashboard/learner/modals/CAPIConnectivityModal';
import { MinisterialBriefingModal } from '@/components/dashboard/admin/modals/MinisterialBriefingModal';
import { NationalReadinessModal } from '@/components/dashboard/admin/modals/NationalReadinessModal';
import { FlaggedRegionsModal } from '@/components/dashboard/admin/modals/FlaggedRegionsModal';
import { AshokaEmblem } from '@/components/auth/AshokaEmblem';
import { GlobalSearchModal } from './GlobalSearchModal';
import { getPendingCount, clearAllSensitiveOfflineData } from '@/services/offlineService';

function safeDecodeCookie(val: string): unknown {
  let str = val;
  try {
    while (str.includes('%')) {
      const decoded = decodeURIComponent(str);
      if (decoded === str) break;
      str = decoded;
    }
    return JSON.parse(str);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(val));
    } catch {
      try {
        return JSON.parse(val);
      } catch {
        return null;
      }
    }
  }
}

export interface ResolvedUserContext {
  name: string;
  role: UserRole;
  cadre: string;
  designation: string;
  email: string;
}

interface DemoCookiePayload {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  designation?: string;
  cadre?: string;
  department?: string;
  organization_id?: string;
  preferred_language?: 'en' | 'hi';
  user_metadata?: {
    name?: string;
    designation?: string;
    cadre?: string;
    department?: string;
    organization_id?: string;
    preferred_language?: 'en' | 'hi';
  };
  app_metadata?: {
    role?: UserRole;
  };
}

function getInitialPersona(
  initialUser?: AppUser | null,
  initialRole?: UserRole,
  currentUser?: ResolvedUserContext | null
): DemoPersona {
  // 1. Prioritize active user context if passed
  if (currentUser?.name) {
    const role = currentUser.role || initialRole || 'learner';
    const found = DEMO_PERSONAS.find(
      (p) =>
        (currentUser.email && p.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
        p.name.toLowerCase() === currentUser.name.toLowerCase()
    );
    if (found) {
      return {
        ...found,
        name: currentUser.name,
        designation: currentUser.designation || found.designation,
        cadre: currentUser.cadre || found.cadre,
        role: currentUser.role || found.role,
      };
    }
    return {
      id: 'logged-in-user',
      name: currentUser.name,
      email: currentUser.email || 'user@mospi.gov.in',
      role,
      designation: currentUser.designation || 'Statistical Officer',
      cadre: currentUser.cadre || 'MoSPI Cadre',
      organization_id: 'org-mospi',
      preferred_language: 'en',
      department: 'MoSPI Headquarters',
    };
  }

  // 2. Prioritize initial server-authenticated user
  if (initialUser) {
    const userName = (initialUser.user_metadata?.name as string) || (initialUser.email ? initialUser.email.split('@')[0] : '');
    const role = (initialUser.app_metadata?.role as UserRole) || initialRole || 'learner';
    const found = DEMO_PERSONAS.find(
      (p) =>
        p.id === initialUser.id ||
        (initialUser.email && p.email?.toLowerCase() === initialUser.email.toLowerCase()) ||
        (userName && p.name.toLowerCase() === userName.toLowerCase())
    );
    if (found) {
      return {
        ...found,
        name: userName || found.name,
        designation: (initialUser.user_metadata?.designation as string) || found.designation,
        cadre: (initialUser.user_metadata?.cadre as string) || found.cadre,
        department: (initialUser.user_metadata?.department as string) || found.department,
        preferred_language: (initialUser.user_metadata?.preferred_language as 'en' | 'hi') || found.preferred_language,
        role: (initialUser.app_metadata?.role as UserRole) || found.role,
      };
    }
    return {
      id: initialUser.id || 'custom-user',
      name: userName || (role === 'trainer' ? 'Dr. Priya Verma' : role === 'admin' ? 'Rajesh Kumar' : 'Sunita Devi'),
      email: initialUser.email || 'user@mospi.gov.in',
      role,
      designation: (initialUser.user_metadata?.designation as string) || (role === 'trainer' ? 'Course Director' : role === 'admin' ? 'Additional Director General' : 'Field Investigator'),
      cadre: (initialUser.user_metadata?.cadre as string) || (role === 'trainer' ? 'NSSTA Faculty' : role === 'admin' ? 'MoSPI Headquarters' : 'NSSO Field Operations Division'),
      organization_id: (initialUser.user_metadata?.organization_id as string) || 'org-mospi',
      preferred_language: (initialUser.user_metadata?.preferred_language as 'en' | 'hi') || 'en',
      department: (initialUser.user_metadata?.department as string) || 'MoSPI Headquarters',
    };
  }

  // 3. Client cookie lookup
  if (typeof document !== 'undefined') {
    const matchUser = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
    if (matchUser) {
      const decoded = safeDecodeCookie(matchUser[1]) as DemoCookiePayload | null;
      if (decoded) {
        const decodedName = decoded.user_metadata?.name || decoded.name;
        const decodedEmail = decoded.email;
        const decodedId = decoded.id;
        const found = DEMO_PERSONAS.find(
          (p) =>
            (decodedEmail && p.email?.toLowerCase() === decodedEmail.toLowerCase()) ||
            p.id === decodedId ||
            (decodedName && p.name.toLowerCase() === decodedName.toLowerCase())
        );
        if (found) {
          return {
            ...found,
            name: decodedName || found.name,
            designation: decoded.user_metadata?.designation || decoded.designation || found.designation,
            cadre: decoded.user_metadata?.cadre || decoded.cadre || found.cadre,
            department: decoded.user_metadata?.department || decoded.department || found.department,
            preferred_language: decoded.user_metadata?.preferred_language || decoded.preferred_language || found.preferred_language,
            role: decoded.app_metadata?.role || decoded.role || found.role,
          };
        }
        if (decodedName || decodedEmail) {
          return {
            id: decodedId || 'custom-user',
            name: decodedName || 'Civil Officer',
            email: decodedEmail || 'user@mospi.gov.in',
            role: (decoded.app_metadata?.role as UserRole) || (decoded.role as UserRole) || initialRole || 'learner',
            designation: decoded.user_metadata?.designation || decoded.designation || 'Statistical Officer',
            cadre: decoded.user_metadata?.cadre || decoded.cadre || 'MoSPI Cadre',
            organization_id: decoded.user_metadata?.organization_id || decoded.organization_id || 'org-mospi',
            preferred_language: (decoded.user_metadata?.preferred_language as 'en' | 'hi') || decoded.preferred_language || 'en',
            department: decoded.user_metadata?.department || decoded.department || 'MoSPI Headquarters',
          };
        }
      }
    }

    const matchPersona = document.cookie.match(/(?:^|; )demo_persona=([^;]*)/);
    if (matchPersona) {
      const personaId = decodeURIComponent(matchPersona[1]).trim();
      const found = DEMO_PERSONAS.find(
        (p) => p.id === personaId || p.email?.toLowerCase() === personaId.toLowerCase()
      );
      if (found) return found;
    }
  }

  // 4. Default persona based on role
  if (initialRole === 'trainer') return DEMO_PERSONAS.find((p) => p.id === 'demo-priya') || DEMO_PERSONAS[3];
  if (initialRole === 'admin') return DEMO_PERSONAS.find((p) => p.id === 'demo-rajesh') || DEMO_PERSONAS[4];
  return DEMO_PERSONAS.find((p) => p.id === 'demo-sunita') || DEMO_PERSONAS[2];
}

function setPersonaCookie(persona: DemoPersona) {
  if (typeof document === 'undefined') return;
  document.cookie = `demo_user=${encodeURIComponent(
    JSON.stringify(persona)
  )}; path=/; max-age=604800`;
  document.cookie = `demo_persona=${persona.id}; path=/; max-age=604800; SameSite=Lax`;
  document.cookie = `karmayogi_demo_role=${persona.role}; path=/; max-age=604800; SameSite=Lax`;
  // Clear any existing session token cookies so that the server resolves the new demo persona immediately
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'statvidya_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'sb-demo-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('statvidya-user-updated', { detail: persona }));
  }
}

async function clearPersonaCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // Purge sensitive offline queue & cached media from IndexedDB
  try {
    await clearAllSensitiveOfflineData();
  } catch (err) {
    console.error('Failed to clear sensitive offline data on logout:', err);
  }

  // Purge sensitive offline route & assessment caches from Service Worker
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'PURGE_SENSITIVE_CACHE' });
  }
}

interface TopbarProps {
  initialRole?: UserRole;
  initialUser?: AppUser | null;
  currentUser?: ResolvedUserContext | null;
}

export function Topbar({ initialRole, initialUser, currentUser }: TopbarProps) {
  const router = useRouter();
  const locale = useLocale();
  const isHindi = locale === 'hi';
  const t = useTranslations('nav');

  const [menuOpen, setMenuOpen] = useState(false);
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

  const [internalPersona, setInternalPersona] = useState<DemoPersona>(() =>
    getInitialPersona(initialUser, initialRole, currentUser)
  );

  // Derive activePersona with active user precedence
  const activePersona: DemoPersona = currentUser?.name
    ? {
        ...internalPersona,
        name: currentUser.name,
        designation: currentUser.designation || internalPersona.designation,
        cadre: currentUser.cadre || internalPersona.cadre,
        role: currentUser.role || internalPersona.role,
        email: currentUser.email || internalPersona.email,
      }
    : internalPersona;

  const menuRef = useRef<HTMLDivElement>(null);
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

  // Sync with cookie changes & profile update events
  useEffect(() => {
    const checkCookie = () => {
      const persona = getInitialPersona(initialUser, initialRole, currentUser);
      setInternalPersona((prev) =>
        prev.email !== persona.email ||
        prev.name !== persona.name ||
        prev.role !== persona.role ||
        prev.designation !== persona.designation
          ? persona
          : prev
      );
    };

    checkCookie();
    const interval = setInterval(checkCookie, 1000);
    const handleUserUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<DemoPersona>;
      if (customEvent.detail?.name) {
        setInternalPersona(customEvent.detail);
      } else {
        checkCookie();
      }
    };
    window.addEventListener('statvidya-user-updated', handleUserUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('statvidya-user-updated', handleUserUpdate);
    };
  }, [initialUser, initialRole, currentUser]);

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
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
        setMenuOpen(false);
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
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    setNotificationsOpen(false);
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
      try {
        const storageKey = `statvidya_scroll_${window.location.pathname}`;
        sessionStorage.setItem(storageKey, JSON.stringify({ x: window.scrollX, y: window.scrollY, ts: Date.now() }));
      } catch {
        // Ignore
      }
      window.location.reload();
    },
    [locale]
  );

  const handleSelectPersona = async (persona: DemoPersona) => {
    setInternalPersona(persona);
    setMenuOpen(false);
    setNotifications(getInitialNotifications(persona.role));
    setPersonaCookie(persona);
    try {
      await fetch('/api/sso/demo-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: persona.email }),
      });
    } catch {
      // Non-blocking fallback to cookie authentication
    }
    if (typeof window !== 'undefined') {
      window.location.replace('/dashboard');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="relative z-30 flex h-16 items-center bg-white border-b border-[#D8DFEE] px-4 sm:px-6 select-none shadow-xs">
      {/* 1. Brand & Department Area (Left) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile Hamburger Navigation Button */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
          aria-label="Open Navigation Drawer"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF0F7]/80 border border-[#D8DFEE] text-[#1F273A] hover:bg-white hover:border-[#1C4CA1]/40 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* MoSPI Emblem & Full Department Typography */}
        <div className="flex items-center gap-2.5">
          <AshokaEmblem className="h-10 w-auto text-[#1F273A] shrink-0" />
          <div className="hidden sm:flex flex-col text-[#1F273A] leading-tight select-none">
            <span className="font-extrabold text-[12.5px] tracking-tight">MoSPI</span>
            <span className="text-[8.5px] text-slate-500 font-medium leading-[11px]">Ministry of Statistics and</span>
            <span className="text-[8.5px] text-slate-500 font-medium leading-[11px]">Programme Implementation</span>
            <span className="text-[8.5px] text-slate-500 font-medium leading-[11px]">Government of India</span>
          </div>
        </div>

        {/* StatVidya Brand Lockup */}
        <Link href="/dashboard" prefetch={true} className="flex flex-col pl-3 border-l border-slate-200 group">
          <span className="font-black text-lg text-[#1C4CA1] tracking-tight leading-none group-hover:text-[#1164BE] transition-colors">
            StatVidya
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
            Learn | Assess | Grow
          </span>
        </Link>
      </div>

      {/* 2. Global Search Bar (Center, Cleanly Proportioned) */}
      <div className="flex-1 max-w-md mx-6 hidden xl:flex items-center">
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="w-full flex items-center justify-between h-9 px-3.5 rounded-xl bg-[#F1F5F9]/80 hover:bg-white border border-[#D8DFEE] hover:border-[#1C4CA1]/40 text-xs text-slate-500 transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
          title={locale === 'hi' ? 'खोजें (Ctrl + K)' : 'Search (Ctrl + K)'}
          aria-label="Search"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#1C4CA1] transition-colors shrink-0" />
            <span className="truncate text-slate-500 font-normal">
              {locale === 'hi' ? 'दक्षताएँ, नियमावली खोजें...' : 'Search competencies, manuals...'}
            </span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[9px] font-medium text-slate-400 group-hover:text-slate-600 shadow-2xs shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Unified Right Area: All Badges & Action Controls with Uniform Gaps & Equal h-9 Heights */}
      <div className="flex items-center gap-2.5 shrink-0 ml-auto">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="xl:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white hover:bg-slate-50 border border-[#D8DFEE] text-slate-600 transition-all cursor-pointer shadow-2xs shrink-0"
          aria-label="Open Search Palette"
          title={locale === 'hi' ? 'खोजें' : 'Search'}
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Project Bhashini Voice Assistant */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('toggle-copilot-voice'));
          }}
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1C4CA1]/10 border border-[#1C4CA1]/25 text-xs font-bold text-[#1C4CA1] hover:bg-[#1C4CA1] hover:text-white transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
          title={locale === 'hi' ? 'प्रोजेक्ट भाषिणी वॉइस असिस्टेंट (हिन्दी / English)' : 'Project Bhashini Voice Assistant (Hindi / English)'}
        >
          <Mic className="h-3.5 w-3.5" />
          <span>{locale === 'hi' ? 'भाषिणी वॉइस' : 'Bhashini Voice'}</span>
        </button>

        {/* Role Badges (All unified to h-9 px-3 rounded-xl inline-flex items-center gap-1.5) */}
        {role === 'learner' && (
          <>
            {/* Interactive Karma Points Counter */}
            <button
              type="button"
              onClick={() => setKarmaModalOpen(true)}
              title="View Karma Points Ledger & Badges"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-soft-gold border border-[#FFA72F]/40 text-xs font-bold text-[#1F273A] hover:bg-soft-gold/80 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            >
              <Award className="h-3.5 w-3.5 text-[#D97706]" />
              <span className="font-mono font-bold">+550</span>
              <span className="text-[10px] text-slate-600 hidden 2xl:inline">Karma Points</span>
            </button>

            {/* Interactive CAPI & Offline Vault Engine */}
            <button
              type="button"
              onClick={() => setCapiModalOpen(true)}
              title="Inspect CAPI Storage & Field Offline Vault"
              className={`hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0 ${
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
              <span>{isOfflineSimulated ? 'CAPI Offline' : 'CAPI Vault'}</span>
              <span className="text-[10px] font-mono text-emerald-700 hidden 2xl:inline">
                {pendingVaultCount > 0 ? `(${pendingVaultCount} queued)` : '(38 Cached)'}
              </span>
            </button>
          </>
        )}

        {role === 'trainer' && (
          <>
            <div className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1164BE]/10 border border-[#1164BE]/25 text-xs font-bold text-[#1164BE] shrink-0">
              <GraduationCap className="h-3.5 w-3.5 text-[#1164BE]" />
              <span>{locale === 'hi' ? 'एनएसएसटीए संकाय' : 'NSSTA Faculty'}</span>
            </div>

            <Link
              href="/review-queue"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-800 hover:bg-amber-500/25 transition-colors shrink-0"
            >
              <ClipboardCheck className="h-3.5 w-3.5 text-amber-700" />
              <span>{locale === 'hi' ? '14 लंबित' : '14 QA Pending'}</span>
            </Link>

            <Link
              href="/documents"
              className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1164BE] text-xs font-bold text-white hover:bg-secondary-hover transition-colors shadow-2xs shrink-0"
            >
              <FileUp className="h-3.5 w-3.5" />
              <span>{locale === 'hi' ? 'नियमावली' : 'Ingest Manual'}</span>
            </Link>
          </>
        )}

        {role === 'admin' && (
          <>
            <button
              type="button"
              onClick={() => setAdminReadinessOpen(true)}
              title="View National FRAC Readiness Breakdown"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-800 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            >
              <Target className="h-3.5 w-3.5 text-emerald-700" />
              <span>{locale === 'hi' ? 'राष्ट्रीय तत्परता: 72.4%' : 'National Readiness: 72.4%'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminFlaggedOpen(true)}
              title="View Critical Flagged Regional Offices"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-bold text-red-800 hover:bg-red-500/25 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            >
              <Flag className="h-3.5 w-3.5 text-red-600" />
              <span>{locale === 'hi' ? '2 चिह्नित' : '2 Flagged ROs'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminBriefingOpen(true)}
              title="Preview Official Secretary Briefing Memo (PDF)"
              className="hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1C4CA1] text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            >
              <Download className="h-3.5 w-3.5 text-[#FFA72F]" />
              <span>{locale === 'hi' ? 'पीडीएफ' : 'Ministerial PDF'}</span>
            </button>
          </>
        )}

        {/* Global Language Switcher */}
        <button
          type="button"
          onClick={() => handleLanguageToggle()}
          aria-label={locale === 'en' ? 'Switch interface to Hindi' : 'Switch interface to English'}
          title="Toggle Language (English / हिन्दी)"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#D8DFEE] bg-white hover:bg-slate-50 text-xs font-semibold text-[#1F273A] transition shadow-2xs cursor-pointer shrink-0"
        >
          <Globe className="h-3.5 w-3.5 text-slate-400" />
          <span>{locale === 'hi' ? 'हिन्दी' : 'English'}</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>

        {/* Functional Notification Center Bell Button */}
        <div className="relative shrink-0" ref={notificationsRef}>
          <button
            type="button"
            onClick={toggleNotifications}
            aria-label={`Notifications${
              unreadCount > 0 ? `, ${unreadCount} unread` : ''
            }`}
            aria-expanded={notificationsOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white hover:bg-slate-50 border border-[#D8DFEE] text-slate-600 transition shadow-2xs cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
                aria-hidden="true"
              />
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

        {/* Unified Single User Account Profile Button & Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            id="user-profile-menu-button"
            type="button"
            onClick={toggleMenu}
            aria-label="User account and profile menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#D8DFEE] text-[#1F273A] shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer shrink-0"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1C4CA1] text-white text-xs font-bold shadow-2xs shrink-0">
              {activePersona.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="font-bold text-xs text-[#1F273A] truncate max-w-28 leading-snug">
                {activePersona.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate max-w-28 leading-none">
                {activePersona.designation}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#D8DFEE] p-2.5 shadow-card-elevated z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#D8DFEE] space-y-2">
              <div className="px-2 pt-1 pb-2">
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

              {/* Interface Language Segmented Switcher */}
              <div className="pt-2 px-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#1F273A]">
                    <Globe className="h-3.5 w-3.5 text-[#1C4CA1]" />
                    <span>{locale === 'hi' ? 'भाषा (Language)' : 'Interface Language'}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1C4CA1] bg-slate-100 px-2 py-0.5 rounded-full border border-[#D8DFEE]">
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

              {/* Official Cadre Switcher Section inside User Menu */}
              <div className="pt-2 px-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F273A]">
                    {isHindi ? 'संवर्ग बदलें' : 'Switch Official Cadre'}
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-[#EDF0F7] text-[#1C4CA1] px-1.5 py-0.5 rounded-full border border-[#D8DFEE]">
                    Role-Gated
                  </span>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5">
                  {DEMO_PERSONAS.map((persona) => {
                    const isSelected = persona.id === activePersona.id;
                    const style = roleColors[persona.role] || roleColors.learner;

                    return (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => handleSelectPersona(persona)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C4CA1]/10 text-[#1F273A] border border-[#1C4CA1]/25'
                            : 'hover:bg-[#EDF0F7]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-bold text-[11px] ${style.bg} ${style.text}`}
                          >
                            {persona.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F273A] truncate">
                              {persona.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {persona.designation}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span
                            className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded-full ${style.badge}`}
                          >
                            {persona.role}
                          </span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-[#1C4CA1]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="pt-2 px-1 space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#1F273A] hover:bg-[#EDF0F7] transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-[#1C4CA1]" />
                  <span>{t('profile')}</span>
                </Link>

                <Link
                  href="/credentials"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#1F273A] hover:bg-[#EDF0F7] transition-colors"
                >
                  <Award className="h-3.5 w-3.5 text-[#FFA72F]" />
                  <span>Karmayogi Digital Passport</span>
                </Link>

                {role === 'learner' && (
                  <Link
                    href="/courses"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#1F273A] hover:bg-[#EDF0F7] transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-[#1C4CA1]" />
                    <span>My Learning & Progress</span>
                  </Link>
                )}

                {role === 'trainer' && (
                  <Link
                    href="/documents"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-[#1F273A] hover:bg-[#EDF0F7] transition-colors"
                  >
                    <FileUp className="h-3.5 w-3.5 text-[#1164BE]" />
                    <span>Faculty Documents Repository</span>
                  </Link>
                )}

                <a
                  href="https://igotkarmayogi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-[#EDF0F7] hover:text-[#1F273A] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    iGOT Portal
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">Gov.in</span>
                </a>
              </div>

              {/* Logout Button */}
              <div className="pt-2 px-1">
                <button
                  type="button"
                  onClick={async () => {
                    await clearPersonaCookie();
                    setMenuOpen(false);
                    router.push('/auth/login');
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-[#B91C1C] hover:bg-red-50 transition-colors cursor-pointer"
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
        userRole={role}
        userCadre={activePersona.cadre}
      />
    </header>
  );
}

export default Topbar;
