import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/auth/login');
  }
  return <DashboardClient user={{ ...user, email: user.email || '' }} />;
}
