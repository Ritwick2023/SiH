'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumb } from './Breadcrumb';
import dynamic from 'next/dynamic';

const CopilotFAB = dynamic(
  () => import('@/components/copilot/CopilotFAB').then((mod) => mod.CopilotFAB),
  { ssr: false }
);
import {
  AssessmentModeProvider,
  useAssessmentMode,
} from '@/contexts/AssessmentModeContext';
import type { UserRole } from '@/lib/types';
import type { AppUser } from '@/lib/auth';
import { resolveUserRole } from '@/components/dashboard/RoleDashboardRouter';

import { useLocale } from 'next-intl';

interface AppLayoutProps {
  children: React.ReactNode;
  initialRole?: UserRole;
  initialUser?: AppUser | null;
}

interface ResolvedUser {
  name: string;
  role: UserRole;
  cadre: string;
  designation: string;
  email: string;
}

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
    preferred_language?: 'en' | 'hi';
  };
  app_metadata?: {
    role?: UserRole;
  };
}

function getActiveUserFromCookie(initialUser?: AppUser | null, initialRole?: UserRole): ResolvedUser {
  if (initialUser) {
    const role = (initialUser.app_metadata?.role as UserRole) || initialRole || 'learner';
    return {
      name: (initialUser.user_metadata?.name as string) || (role === 'trainer' ? 'Dr. Priya Verma' : role === 'admin' ? 'Rajesh Kumar' : 'Sunita Devi'),
      role,
      cadre: (initialUser.user_metadata?.cadre as string) || (role === 'trainer' ? 'NSSTA Faculty' : role === 'admin' ? 'MoSPI Headquarters' : 'NSSO Field Operations Division'),
      designation: (initialUser.user_metadata?.designation as string) || (role === 'trainer' ? 'Course Director' : role === 'admin' ? 'Additional Director General' : 'Field Investigator'),
      email: initialUser.email || 'sunita.devi@nsso.gov.in',
    };
  }

  if (typeof document === 'undefined') {
    const role = initialRole || 'learner';
    return {
      name: role === 'trainer' ? 'Dr. Priya Verma' : role === 'admin' ? 'Rajesh Kumar' : 'Sunita Devi',
      role,
      cadre: role === 'trainer' ? 'NSSTA Faculty' : role === 'admin' ? 'MoSPI Headquarters' : 'NSSO Field Operations Division',
      designation: role === 'trainer' ? 'Course Director' : role === 'admin' ? 'Additional Director General' : 'Field Investigator',
      email: role === 'trainer' ? 'priya.verma@nssta.gov.in' : role === 'admin' ? 'rajesh.kumar@mospi.gov.in' : 'sunita.devi@nsso.gov.in',
    };
  }

  try {
    const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
    if (match) {
      const decoded = safeDecodeCookie(match[1]) as DemoCookiePayload | null;
      if (decoded) {
        const role = (decoded.role as UserRole) || (decoded.app_metadata?.role as UserRole) || initialRole || 'learner';
        const name = decoded.name || decoded.user_metadata?.name;
        const cadre = decoded.cadre || decoded.user_metadata?.cadre;
        const designation = decoded.designation || decoded.user_metadata?.designation;
        return {
          name: name || (role === 'trainer' ? 'Dr. Priya Verma' : role === 'admin' ? 'Rajesh Kumar' : 'Sunita Devi'),
          role,
          cadre: cadre || (role === 'trainer' ? 'NSSTA Faculty' : role === 'admin' ? 'MoSPI Headquarters' : 'NSSO Field Operations Division'),
          designation: designation || (role === 'trainer' ? 'Course Director' : role === 'admin' ? 'Additional Director General' : 'Field Investigator'),
          email: decoded.email || 'sunita.devi@nsso.gov.in',
        };
      }
    }

    const matchPersona = document.cookie.match(/(?:^|; )demo_persona=([^;]*)/);
    if (matchPersona) {
      const pId = decodeURIComponent(matchPersona[1]).trim();
      if (pId === 'demo-sunita') {
        return {
          name: 'Sunita Devi',
          role: 'learner',
          cadre: 'NSSO Field Operations Division',
          designation: 'Field Investigator',
          email: 'sunita.devi@nsso.gov.in',
        };
      } else if (pId === 'demo-amit') {
        return {
          name: 'Amit Sharma',
          role: 'learner',
          cadre: 'Subordinate Statistical Service (SSS)',
          designation: 'Junior Statistical Officer',
          email: 'amit.sharma@mospi.gov.in',
        };
      } else if (pId === 'demo-priya') {
        return {
          name: 'Dr. Priya Verma',
          role: 'trainer',
          cadre: 'NSSTA Faculty',
          designation: 'Course Director',
          email: 'priya.verma@nssta.gov.in',
        };
      } else if (pId === 'demo-rajesh') {
        return {
          name: 'Rajesh Kumar',
          role: 'admin',
          cadre: 'MoSPI Headquarters',
          designation: 'Additional Director General',
          email: 'rajesh.kumar@mospi.gov.in',
        };
      }
    }
  } catch {
    // fallback
  }

  const role = initialRole || 'learner';
  return {
    name: role === 'trainer' ? 'Dr. Priya Verma' : role === 'admin' ? 'Rajesh Kumar' : 'Sunita Devi',
    role,
    cadre: role === 'trainer' ? 'NSSTA Faculty' : role === 'admin' ? 'MoSPI Headquarters' : 'NSSO Field Operations Division',
    designation: role === 'trainer' ? 'Course Director' : role === 'admin' ? 'Additional Director General' : 'Field Investigator',
    email: role === 'trainer' ? 'priya.verma@nssta.gov.in' : role === 'admin' ? 'rajesh.kumar@mospi.gov.in' : 'sunita.devi@nsso.gov.in',
  };
}

/** Inner component — reads context after provider has been mounted. */
function AppLayoutInner({ children, initialRole, initialUser }: AppLayoutProps) {
  const { isAssessmentActive } = useAssessmentMode();
  const locale = useLocale();
  const [role, setRole] = useState<UserRole>(() => initialRole || (initialUser?.app_metadata?.role as UserRole) || 'learner');
  const [currentUser, setCurrentUser] = useState<ResolvedUser>(() => getActiveUserFromCookie(initialUser, initialRole));

  useEffect(() => {
    const syncUser = () => {
      const active = getActiveUserFromCookie(initialUser, initialRole);
      setRole(resolveUserRole());
      setCurrentUser((prev) => {
        if (
          prev.name !== active.name ||
          prev.role !== active.role ||
          prev.email !== active.email ||
          prev.designation !== active.designation
        ) {
          return active;
        }
        return prev;
      });
    };

    syncUser();
    const interval = setInterval(syncUser, 1000);
    const handleUpdate = () => syncUser();
    window.addEventListener('statvidya-user-updated', handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('statvidya-user-updated', handleUpdate);
    };
  }, [initialRole, initialUser]);

  const userContext = {
    name: currentUser.name,
    role,
    cadre: currentUser.cadre,
    designation: currentUser.designation,
    readinessIndex: role === 'admin' ? 72 : 42,
    preferredLanguage: locale,
    topGaps: [
      { competency: 'CAPI Tablet Operations', levelDelta: 2, priority: 'critical' },
      { competency: 'Census Boundary Demarcation', levelDelta: 2, priority: 'critical' },
      { competency: 'Household Listing & Stratification', levelDelta: 1, priority: 'important' },
    ],
  };

  if (isAssessmentActive) {
    // Full-screen assessment mode: no sidebar, no topbar, no max-width padding
    return (
      <div className="flex h-full flex-col bg-[#F4F6FB]">
        {children}
        <CopilotFAB userContext={userContext} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F8FAFC]">
      <Topbar initialRole={role} initialUser={initialUser} currentUser={currentUser} />
      <div className="flex flex-1 overflow-hidden min-w-0 relative">
        <Sidebar initialRole={role} currentUser={currentUser} />
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="mb-2">
              <Breadcrumb />
            </div>
            <div>{children}</div>
          </div>
        </main>
      </div>
      <CopilotFAB userContext={userContext} />
    </div>
  );
}

export function AppLayout({ children, initialRole, initialUser }: AppLayoutProps) {
  return (
    <AssessmentModeProvider>
      <AppLayoutInner initialRole={initialRole} initialUser={initialUser}>
        {children}
      </AppLayoutInner>
    </AssessmentModeProvider>
  );
}

export default AppLayout;
