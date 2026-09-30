import { getAuthenticatedUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import { NotificationsClient } from './NotificationsClient';

export const metadata = {
  title: 'Notifications — StatVidya',
  description: 'View and manage all system and competency notifications.',
};

export default async function NotificationsPage() {
  const user = await getAuthenticatedUser();
  const initialRole = (user?.app_metadata?.role as UserRole) || 'learner';

  return <NotificationsClient initialRole={initialRole} />;
}

