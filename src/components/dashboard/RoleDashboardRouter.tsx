'use client';

import React, { useState, useEffect } from 'react';
import type { UserRole } from '@/lib/types';
import LearnerDashboard from './learner/LearnerDashboard';
import TrainerDashboard from './trainer/TrainerDashboard';
import AdminDashboard from './admin/AdminDashboard';
import { useSafeLocale } from '@/lib/useSafeLocale';

export interface DashboardUserProps {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    organization_id?: string;
    cadre?: string;
    designation?: string;
    department?: string;
    preferred_language?: string;
    role?: string;
  };
  app_metadata?: {
    role?: string;
    [key: string]: unknown;
  };
}

export function resolveUserRole(user?: Partial<DashboardUserProps> | null): UserRole {
  // Check client cookie if present
  if (typeof document !== 'undefined') {
    try {
      const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
      if (match) {
        const decoded = JSON.parse(decodeURIComponent(match[1]));
        if (decoded?.role === 'trainer' || decoded?.role === 'admin' || decoded?.role === 'learner') {
          return decoded.role as UserRole;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!user) return 'learner';

  const roleFromApp = user.app_metadata?.role;
  if (roleFromApp === 'trainer' || roleFromApp === 'admin' || roleFromApp === 'learner') {
    return roleFromApp as UserRole;
  }

  const roleFromMeta = user.user_metadata?.role;
  if (roleFromMeta === 'trainer' || roleFromMeta === 'admin' || roleFromMeta === 'learner') {
    return roleFromMeta as UserRole;
  }

  // Fallback by email heuristic
  if (user.email?.includes('priya') || user.email?.includes('nssta')) return 'trainer';
  if (user.email?.includes('rajesh')) return 'admin';

  return 'learner';
}

function getMergedUser(baseUser: DashboardUserProps): DashboardUserProps {
  if (typeof document === 'undefined') return baseUser;
  try {
    const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
    if (match) {
      const decoded = JSON.parse(decodeURIComponent(match[1]));
      return {
        ...baseUser,
        id: decoded.id || baseUser.id,
        email: decoded.email || baseUser.email,
        user_metadata: {
          ...(baseUser.user_metadata || {}),
          name: decoded.name || baseUser.user_metadata?.name,
          designation: decoded.designation || baseUser.user_metadata?.designation,
          department: decoded.department || baseUser.user_metadata?.department,
          cadre: decoded.cadre || baseUser.user_metadata?.cadre,
          preferred_language: decoded.preferred_language || baseUser.user_metadata?.preferred_language,
        },
        app_metadata: {
          ...(baseUser.app_metadata || {}),
          role: decoded.role || baseUser.app_metadata?.role,
        },
      };
    }
  } catch {
    // ignore
  }
  return baseUser;
}

export function RoleDashboardRouter({ user }: { user: DashboardUserProps }) {
  const [currentUser, setCurrentUser] = useState<DashboardUserProps>(() => getMergedUser(user));
  const [role, setRole] = useState<UserRole>(() => resolveUserRole(currentUser));

  // Sync role and user metadata if cookie changes or user updates profile
  useEffect(() => {
    const handleSync = () => {
      const merged = getMergedUser(user);
      const currentRole = resolveUserRole(merged);
      setCurrentUser((prev) => {
        if (
          prev.user_metadata?.name !== merged.user_metadata?.name ||
          prev.email !== merged.email ||
          prev.user_metadata?.designation !== merged.user_metadata?.designation ||
          prev.user_metadata?.preferred_language !== merged.user_metadata?.preferred_language
        ) {
          return merged;
        }
        return prev;
      });
      setRole((prev) => (prev !== currentRole ? currentRole : prev));
    };

    handleSync();
    const interval = setInterval(handleSync, 1000);
    const handleUserUpdate = () => handleSync();
    window.addEventListener('statvidya-user-updated', handleUserUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('statvidya-user-updated', handleUserUpdate);
    };
  }, [user]);

  const activeLocale = useSafeLocale('en');
  const isHindi = activeLocale === 'hi';

  switch (role) {
    case 'trainer':
      return <TrainerDashboard user={currentUser} isHindi={isHindi} />;
    case 'admin':
      return <AdminDashboard user={currentUser} isHindi={isHindi} />;
    case 'learner':
    default:
      return <LearnerDashboard user={currentUser} isHindi={isHindi} />;
  }
}

export default RoleDashboardRouter;
