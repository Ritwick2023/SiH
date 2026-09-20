import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailAliasPage({ params }: Props) {
  const { id } = await params;
  redirect(`/pathways/${id}`);
}
