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
import { resolveUserRole } from '@/components/dashboard/RoleDashboardRouter';

import { useLocale } from 'next-intl';

interface AppLayoutProps {
  children: React.ReactNode;
}

interface ResolvedUser {
  name: string;
  role: UserRole;
  cadre: string;
  designation: string;
  email: string;
}

function getActiveUserFromCookie(): ResolvedUser {
  if (typeof document === 'undefined') {
    return {
      name: 'Statistical Officer',
      role: 'learner',
      cadre: 'Subordinate Statistical Service (SSS)',
      designation: 'Junior Statistical Officer',
      email: 'officer@mospi.gov.in',
    };
  }
  try {
    const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
    if (match) {
      const decoded = JSON.parse(decodeURIComponent(match[1]));
      const role = (decoded.role as UserRole) || 'learner';
      return {
        name: decoded.name || (role === 'trainer' ? 'Dr. Priya Verma' : role === 'admin' ? 'Rajesh Kumar' : 'Civil Officer'),
        role,
        cadre: decoded.cadre || (role === 'trainer' ? 'NSSTA Faculty' : role === 'admin' ? 'MoSPI Headquarters' : 'Subordinate Statistical Service (SSS)'),
        designation: decoded.designation || (role === 'trainer' ? 'Course Director' : role === 'admin' ? 'Additional Director General' : 'Junior Statistical Officer'),
        email: decoded.email || 'officer@mospi.gov.in',
      };
    }
  } catch {
    // fallback
  }
  return {
    name: 'Statistical Officer',
    role: 'learner',
    cadre: 'Subordinate Statistical Service (SSS)',
    designation: 'Junior Statistical Officer',
    email: 'officer@mospi.gov.in',
  };
}

/** Inner component — reads context after provider has been mounted. */
function AppLayoutInner({ children }: AppLayoutProps) {
  const { isAssessmentActive } = useAssessmentMode();
  const locale = useLocale();
  const [role, setRole] = useState<UserRole>('learner');
  const [currentUser, setCurrentUser] = useState<ResolvedUser>(getActiveUserFromCookie);

  useEffect(() => {
    const syncUser = () => {
      const active = getActiveUserFromCookie();
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
  }, []);

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
    <div className="flex h-screen overflow-hidden bg-[#F4F6FB]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#F4F6FB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="mb-4">
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

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AssessmentModeProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AssessmentModeProvider>
  );
}

export default AppLayout;
