import type { Metadata } from 'next';
import { TeacherProfile } from '@/features/teachers/components/teacher-profile';

export const metadata: Metadata = { title: 'Teacher Profile' };
export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TeacherProfile teacherId={id} />;
}
