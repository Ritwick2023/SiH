import { getAuthenticatedUser } from '@/lib/auth';
import MyLearningClient from './MyLearningClient';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const user = await getAuthenticatedUser();
  return <MyLearningClient user={user} />;
}
