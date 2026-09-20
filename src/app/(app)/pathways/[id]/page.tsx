import { getAuthenticatedUser } from '@/lib/auth';
import { LearningCatalogService } from '@/services/learningCatalogService';
import { notFound } from 'next/navigation';
import CourseDetailClient from './CourseDetailClient';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  const item = LearningCatalogService.getById(id);

  if (!item) {
    notFound();
  }

  return <CourseDetailClient item={item} user={user} />;
}
