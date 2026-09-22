import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import SkillGapClient from './SkillGapClient';

export default async function SkillGapPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/auth/login');
  }
  return <SkillGapClient user={user} />;
}