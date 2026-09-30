'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';
import { ChevronLeft, CheckCircle2, RefreshCw, X, Pin } from 'lucide-react';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona, UserRole } from '@/lib/types';
import { BuildingDataIndiaCard } from './BuildingDataIndiaCard';
import {
  getNavigationForRole,
  getRoleIdentity,
  getRoleFooterData,
  type RoleNavItem,
} from './roleNavigation';

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

function getActivePersonaFromCookie(
  initialRole?: UserRole,
  currentUser?: { name: string; role: UserRole; cadre: string; designation: string; email: string } | null
): DemoPersona {
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

  if (typeof document === 'undefined') {
    if (initialRole === 'trainer') return DEMO_PERSONAS.find((p) => p.id === 'demo-priya') || DEMO_PERSONAS[3];
    if (initialRole === 'admin') return DEMO_PERSONAS.find((p) => p.id === 'demo-rajesh') || DEMO_PERSONAS[4];
    return DEMO_PERSONAS.find((p) => p.id === 'demo-sunita') || DEMO_PERSONAS[2];
  }

  try {
    const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
    if (match) {
      const decoded = safeDecodeCookie(match[1]) as DemoCookiePayload | null;
      if (decoded) {
        const decodedName = decoded.user_metadata?.name || decoded.name;
        const decodedEmail = decoded.email;
        const decodedId = decoded.id;
        const found = DEMO_PERSONAS.find(
          (p) =>
            (decodedEmail && p.email?.toLowerCase() === decodedEmail.toLowerCase()) ||
            p.id === decodedId ||
            (decodedName && p.name?.toLowerCase() === decodedName.toLowerCase())
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
        if (decoded.role || decodedName || decodedEmail) {
          return {
            id: decodedId || 'custom-user',
            name: decodedName || 'Civil Officer',
            email: decodedEmail || 'user@mospi.gov.in',
            role: (decoded.app_metadata?.role as UserRole) || (decoded.role as UserRole) || initialRole || 'learner',
            designation: decoded.user_metadata?.designation || decoded.designation || 'Statistical Officer',
            cadre: decoded.user_metadata?.cadre || decoded.cadre || 'MoSPI Cadre',
            organization_id: decoded.user_metadata?.organization_id || decoded.organization_id || 'org-mospi',
            preferred_language: (decoded.user_metadata?.preferred_language as 'en' | 'hi') || 'en',
            department: decoded.user_metadata?.department || 'MoSPI Headquarters',
          };
        }
      }
    }

    const matchPersona = document.cookie.match(/(?:^|; )demo_persona=([^;]*)/);
    if (matchPersona) {
      const pId = decodeURIComponent(matchPersona[1]).trim();
      const found = DEMO_PERSONAS.find(
        (p) => p.id === pId || p.email?.toLowerCase() === pId.toLowerCase()
      );
      if (found) return found;
    }
  } catch {
    // fallback
  }

  if (initialRole === 'trainer') return DEMO_PERSONAS.find((p) => p.id === 'demo-priya') || DEMO_PERSONAS[3];
  if (initialRole === 'admin') return DEMO_PERSONAS.find((p) => p.id === 'demo-rajesh') || DEMO_PERSONAS[4];
  return DEMO_PERSONAS.find((p) => p.id === 'demo-sunita') || DEMO_PERSONAS[2];
}

interface SidebarProps {
  initialRole?: UserRole;
  currentUser?: {
    name: string;
    role: UserRole;
    cadre: string;
    designation: string;
    email: string;
  } | null;
}

export function Sidebar({ initialRole, currentUser }: SidebarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isHindi = locale === 'hi';
  const pathname = usePathname();

  // Auto-collapsible state: collapsed by default, expands on mouse hover or when pinned
  const [isHovered, setIsHovered] = useState(false);
  // Track pinned preference via useSyncExternalStore to eliminate hydration and render cascades
  const isPinned = useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      window.addEventListener('statvidya_pin_changed', callback);
      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener('statvidya_pin_changed', callback);
      };
    },
    () => {
      try {
        return localStorage.getItem('statvidya_sidebar_pinned') === 'true';
      } catch {
        return false;
      }
    },
    () => false // SSR fallback is always unpinned
  );

  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileDrawerOpen(false);
  }

  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const togglePin = () => {
    try {
      const next = !isPinned;
      localStorage.setItem('statvidya_sidebar_pinned', String(next));
      window.dispatchEvent(new Event('statvidya_pin_changed'));
    } catch {
      // ignore
    }
  };

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    // Subtle debounce ensures cursor crossing boundaries doesn't trigger jitter
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Toggle mobile drawer via global window event from Topbar
  useEffect(() => {
    const handleToggle = () => setMobileDrawerOpen((prev) => !prev);
    const handleClose = () => setMobileDrawerOpen(false);
    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    window.addEventListener('close-mobile-sidebar', handleClose);
    return () => {
      window.removeEventListener('toggle-mobile-sidebar', handleToggle);
      window.removeEventListener('close-mobile-sidebar', handleClose);
    };
  }, []);

  const [internalPersona, setInternalPersona] = useState<DemoPersona>(() => {
    return getActivePersonaFromCookie(initialRole, currentUser);
  });

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

  // Keep synced with cookie changes
  useEffect(() => {
    const checkCookie = () => {
      const persona = getActivePersonaFromCookie(initialRole, currentUser);
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
  }, [initialRole, currentUser]);

  const role: UserRole = initialRole || activePersona.role || 'learner';
  const navItems: RoleNavItem[] = getNavigationForRole(role, isHindi);
  const identity = getRoleIdentity(role, isHindi);
  const footerData = getRoleFooterData(role, isHindi);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    const cleanHref = href.split('#')[0];
    return pathname === cleanHref || pathname.startsWith(cleanHref + '/');
  };

  const isExpanded = isPinned || isHovered;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Desktop Layout Rail Spacer: preserves fixed rail width in document flow so content never shifts on hover */}
      <div
        className={`hidden md:block shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isPinned ? 'w-64' : 'w-18'
        }`}
        aria-hidden="true"
      />

      {/* Main Sidebar (Desktop absolute overlay over rail / Mobile off-canvas drawer) */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={handleMouseEnter}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            handleMouseLeave();
          }
        }}
        aria-label="Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-50 md:z-30 md:absolute flex flex-col bg-white border-r border-[#D8DFEE] will-change-[width,box-shadow] transition-[width,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none overflow-x-hidden ${
          mobileDrawerOpen
            ? 'translate-x-0 w-72 shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        } ${
          isExpanded
            ? 'md:w-64 md:shadow-[6px_0_30px_-6px_rgba(28,76,161,0.14)]'
            : 'md:w-18 md:shadow-none'
        }`}
      >
        {/* Mobile Drawer Brand Header */}
        <div className="flex md:hidden h-16 items-center justify-between px-4 border-b border-[#D8DFEE] shrink-0">
          <Link href="/dashboard" prefetch={true} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF0F7] border border-[#D8DFEE] shadow-2xs p-1 shrink-0" suppressHydrationWarning>
              <KarmayogiEmblemIcon className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[#1F273A] tracking-tight">
                {identity.title}
              </span>
              <span className="text-[10px] font-bold text-[#1C4CA1] uppercase tracking-wider -mt-0.5">
                {identity.subtitle}
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDF0F7] border border-[#D8DFEE] text-[#475569] hover:bg-[#D8DFEE] hover:text-[#1F273A] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Role Navigation Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const labelText = item.label.startsWith('nav.') ? t(item.label) : item.label;

            const handleClick = (e: React.MouseEvent) => {
              setMobileDrawerOpen(false);
              if (item.href === '#help') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('toggle-copilot'));
              }
            };

            return (
              <React.Fragment key={item.href}>
                {item.isDividerBefore && (
                  <div className="my-2 border-t border-[#E2E8F0] mx-1" />
                )}
                <Link
                  href={item.href}
                  prefetch={item.href !== '#help'}
                  onClick={handleClick}
                  title={!isExpanded ? labelText : undefined}
                  className={`flex items-center h-10 px-2 rounded-xl text-xs transition-colors duration-150 group relative cursor-pointer ${
                    active
                      ? 'bg-[#E8F1FC] text-[#1C4CA1] font-bold'
                      : 'text-[#475569] hover:bg-[#EDF0F7] hover:text-[#1F273A] font-medium'
                  }`}
                >
                  {/* Left edge active indicator pill */}
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#1C4CA1] transition-all duration-200 ${
                      active ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                    }`}
                  />

                  {/* Icon container: fixed 32px box ensuring absolute coordinate stability during expansion */}
                  <div className="flex h-8 w-8 items-center justify-center shrink-0">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                        active ? 'text-[#1C4CA1]' : 'text-[#64748B] group-hover:text-[#1C4CA1]'
                      }`}
                    />
                  </div>

                  {/* Nav label and badge: buttery smooth opacity + transform slide */}
                  <div
                    className={`flex items-center justify-between flex-1 min-w-0 ml-2.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isExpanded
                        ? 'opacity-100 translate-x-0 max-w-[200px]'
                        : 'opacity-0 -translate-x-2 max-w-0 pointer-events-none'
                    }`}
                  >
                    <span className="truncate flex-1 whitespace-nowrap">
                      {labelText}
                    </span>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ml-2 shrink-0 whitespace-nowrap transition-transform duration-300 ${
                          isExpanded ? 'scale-100' : 'scale-75'
                        } ${
                          item.badgeType === 'warning'
                            ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                            : item.badgeType === 'accent'
                              ? 'bg-soft-gold text-[#1F273A] border border-[#FFA72F]/40'
                              : 'bg-[#EDF0F7] text-[#475569] border border-[#D8DFEE]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Sidebar Bottom Presentation Card (Learner) or Role Status Footer (Admin/Trainer) */}
        <div className="mt-auto shrink-0">
          {/* Expanded view card */}
          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
              isExpanded
                ? 'max-h-96 opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {role === 'learner' ? (
              <BuildingDataIndiaCard isHindi={isHindi} />
            ) : (
              <div className="p-3 m-3 rounded-2xl bg-[#EDF0F7]/70 border border-[#D8DFEE] shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-[11px] font-bold text-[#1F273A] truncate">
                      {footerData.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSyncing(true);
                      setTimeout(() => {
                        setSyncing(false);
                        setSynced(true);
                        setTimeout(() => setSynced(false), 2500);
                      }, 700);
                    }}
                    disabled={syncing}
                    title="Sync your data"
                    className="p-1 rounded-lg bg-white border border-[#D8DFEE] text-[#1C4CA1] hover:bg-[#1C4CA1] hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {synced ? '✓ Data synced successfully!' : footerData.subtitle}
                </p>
                <div className="mt-2 pt-2 border-t border-[#D8DFEE] flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                  <span className="font-mono text-[#1C4CA1]">{footerData.badge}</span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                </div>
              </div>
            )}
          </div>

          {/* Collapsed view status dot */}
          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex justify-center items-center ${
              !isExpanded
                ? 'max-h-12 py-3 opacity-100 border-t border-[#D8DFEE]'
                : 'max-h-0 py-0 opacity-0 pointer-events-none border-transparent'
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"
              title={footerData.title}
            />
          </div>
        </div>

        {/* Desktop Sidebar Controls (Auto-collapse status & Pin/Lock toggle) */}
        <div className="hidden md:flex items-center h-11 px-2.5 border-t border-[#D8DFEE] bg-[#F8FAFC]/80 backdrop-blur-xs shrink-0">
          <div
            className={`flex items-center justify-between w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded ? 'opacity-100' : 'justify-center'
            }`}
          >
            {/* Mode Indicator & Quick Pin Switcher (visible when expanded) */}
            <div
              className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                isExpanded
                  ? 'opacity-100 max-w-[130px] translate-x-0'
                  : 'opacity-0 max-w-0 -translate-x-2 pointer-events-none'
              }`}
            >
              <button
                type="button"
                onClick={togglePin}
                className="flex items-center gap-1.5 text-[11px] font-medium text-[#475569] hover:text-[#1C4CA1] transition-colors cursor-pointer group"
                title={isPinned ? 'Sidebar is pinned. Click to enable auto-collapse.' : 'Auto-collapse active. Click to pin open.'}
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 transition-colors ${
                    isPinned ? 'bg-[#1C4CA1]' : 'bg-emerald-500 animate-pulse'
                  }`}
                />
                <span className="whitespace-nowrap font-medium text-[11px]">
                  {isPinned ? 'Pinned' : 'Auto-expand'}
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center gap-1 ${!isExpanded ? 'mx-auto' : ''}`}>
              {/* Pin / Lock Toggle */}
              <button
                type="button"
                onClick={togglePin}
                aria-label={isPinned ? 'Unpin sidebar (auto-collapse mode)' : 'Pin sidebar open'}
                title={isPinned ? 'Unpin sidebar (auto-collapse mode)' : 'Pin sidebar open'}
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  isPinned
                    ? 'bg-[#E8F1FC] border-[#1C4CA1]/30 text-[#1C4CA1] shadow-2xs'
                    : 'bg-white border-[#D8DFEE] text-[#64748B] hover:bg-[#EDF0F7] hover:text-[#1F273A]'
                }`}
              >
                <Pin className={`h-3.5 w-3.5 transition-transform duration-200 ${isPinned ? 'rotate-45 fill-[#1C4CA1]' : ''}`} />
              </button>

              {/* Quick Collapse Chevron */}
              <div
                className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                  isExpanded ? 'opacity-100 max-w-[32px]' : 'opacity-0 max-w-0 pointer-events-none'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isPinned) setIsPinned(false);
                    setIsHovered(false);
                  }}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                  className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-white border border-[#D8DFEE] text-[#64748B] hover:bg-[#EDF0F7] hover:text-[#1F273A] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

