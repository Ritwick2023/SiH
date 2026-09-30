import { AppLayout } from '@/components/layout';
import { getAuthenticatedUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

export default async function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  const initialRole = (user?.app_metadata?.role as UserRole) || 'learner';

  return (
    <AppLayout initialUser={user} initialRole={initialRole}>
      {children}
    </AppLayout>
  );
}
