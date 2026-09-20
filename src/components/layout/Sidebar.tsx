'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';
import { ChevronLeft, ChevronRight, ShieldCheck, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona, UserRole } from '@/lib/types';
import { OfficerDossierModal } from '@/components/dashboard/learner/modals/OfficerDossierModal';
import {
  getNavigationForRole,
  getRoleIdentity,
  getRoleFooterData,
  type RoleNavItem,
} from './roleNavigation';

function getActivePersonaFromCookie(): DemoPersona {
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
    // fallback
  }
  return DEMO_PERSONAS[0];
}

interface SidebarProps {
  initialRole?: UserRole;
}

export function Sidebar({ initialRole }: SidebarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isHindi = locale === 'hi';
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

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

  // Close mobile drawer on route change (pathname is external system state from Next.js router)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileDrawerOpen(false);
  }, [pathname]);

  const [activePersona, setActivePersona] = useState<DemoPersona>(() => {
    const fromCookie = getActivePersonaFromCookie();
    if (initialRole && fromCookie.role !== initialRole) {
      const matched = DEMO_PERSONAS.find((p) => p.role === initialRole);
      return matched || fromCookie;
    }
    return fromCookie;
  });

  // Keep synced with cookie changes (e.g. from Topbar persona switcher)
  useEffect(() => {
    const checkCookie = () => {
      const persona = getActivePersonaFromCookie();
      setActivePersona((prev) => (prev.email !== persona.email ? persona : prev));
    };

    checkCookie();
    const interval = setInterval(checkCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  const role: UserRole = initialRole || activePersona.role || 'learner';
  const navItems: RoleNavItem[] = getNavigationForRole(role);
  const identity = getRoleIdentity(role, isHindi);
  const footerData = getRoleFooterData(role, isHindi);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    const cleanHref = href.split('#')[0];
    return pathname === cleanHref || pathname.startsWith(cleanHref + '/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

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

      {/* Main Sidebar (Desktop fixed / Mobile off-canvas drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:static flex flex-col bg-white border-r border-[#D8DFEE] transition-all duration-200 ease-out select-none shadow-xl md:shadow-xs ${
          mobileDrawerOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-18' : 'md:w-64'}`}
      >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#D8DFEE]">
        {!collapsed ? (
          <Link href="/dashboard" prefetch={true} className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF0F7] border border-[#D8DFEE] shadow-2xs transition-transform group-hover:scale-105 p-1 shrink-0" suppressHydrationWarning>
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
        ) : (
          <Link
            href="/dashboard"
            prefetch={true}
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF0F7] border border-[#D8DFEE] shadow-2xs p-1"
            suppressHydrationWarning
          >
            <KarmayogiEmblemIcon className="h-7 w-7" />
          </Link>
        )}

        {/* Desktop collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDF0F7] border border-[#D8DFEE] text-[#475569] hover:bg-[#D8DFEE] hover:text-[#1F273A] transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(false)}
          aria-label="Close navigation menu"
          className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDF0F7] border border-[#D8DFEE] text-[#475569] hover:bg-[#D8DFEE] hover:text-[#1F273A] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Role Profile Card at Top of Sidebar */}
      {!collapsed ? (
        <div
          onClick={() => setDossierOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setDossierOpen(true);
          }}
          title="Click to view Official Civil Service Dossier"
          className="p-3 mx-3 mt-3 rounded-2xl bg-[#EDF0F7]/70 border border-[#D8DFEE] hover:border-[#1C4CA1]/40 hover:bg-[#EDF0F7] flex items-center gap-3 transition-all cursor-pointer shadow-2xs group"
        >
          <div
            className="h-10 w-10 rounded-xl text-white flex items-center justify-center font-bold text-xs font-serif shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
            style={{ backgroundColor: identity.themeColor }}
          >
            {getInitials(activePersona.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-[#1F273A] truncate leading-tight group-hover:text-[#1C4CA1] transition-colors">
                {activePersona.name}
              </p>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground truncate mt-0.5">
              {activePersona.designation}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white text-[#1C4CA1] border border-[#D8DFEE]">
                <ShieldCheck className="h-2.5 w-2.5" />
                {identity.roleLabel}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-3 flex justify-center">
          <button
            type="button"
            onClick={() => setDossierOpen(true)}
            className="h-9 w-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: identity.themeColor }}
            title={`${activePersona.name} (${identity.roleLabel}) - Click to view Dossier`}
          >
            {getInitials(activePersona.name)}
          </button>
        </div>
      )}

      {/* Role Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {!collapsed && (
          <div className="px-3 pb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>{identity.subtitle}</span>
            <span className="text-[9px] font-mono text-[#1C4CA1] font-semibold">
              {navItems.length} {isHindi ? 'उपकरण' : 'Tools'}
            </span>
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const labelText = item.label.startsWith('nav.') ? t(item.label) : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setMobileDrawerOpen(false)}
              title={collapsed ? labelText : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative cursor-pointer ${
                collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
              } ${
                active
                  ? 'bg-[#1C4CA1] text-white shadow-xs font-bold'
                  : 'text-[#1F273A] hover:bg-[#EDF0F7] hover:text-[#1C4CA1]'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  active ? 'text-white' : 'text-[#1C4CA1]'
                }`}
              />
              {!collapsed && (
                <span className="truncate flex-1 font-medium">{labelText}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
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
            </Link>
          );
        })}
      </nav>

      {/* Role Status Footer */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-2xl bg-[#EDF0F7]/70 border border-[#D8DFEE] shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[11px] font-bold text-[#1F273A] truncate">
                {footerData.title}
              </span>
            </div>
            {(role === 'learner' || role === 'admin') && (
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
                title={role === 'admin' ? "Synchronize with NSC Central Nodes" : "Force Synchronize 38 Schedules"}
                className="p-1 rounded-lg bg-white border border-[#D8DFEE] text-[#1C4CA1] hover:bg-[#1C4CA1] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
            {synced
              ? role === 'admin'
                ? '✓ Cabinet Protocol Synced with NSC Nodes!'
                : '✓ 38 Forms Synced with MoSPI Central Node!'
              : footerData.subtitle}
          </p>
          <div className="mt-2 pt-2 border-t border-[#D8DFEE] flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span className="font-mono text-[#1C4CA1]">{footerData.badge}</span>
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          </div>
        </div>
      ) : (
        <div className="py-3 flex justify-center border-t border-[#D8DFEE]">
          <span
            className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"
            title={footerData.title}
          />
        </div>
      )}

      {/* Official Officer Dossier Modal */}
      <OfficerDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        persona={activePersona}
      />
      </aside>
    </>
  );
}

export default Sidebar;
