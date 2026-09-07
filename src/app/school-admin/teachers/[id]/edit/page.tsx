import type { Metadata } from 'next';
import { TeacherFormPage } from '@/features/teachers/components/teacher-form';

export const metadata: Metadata = { title: 'Edit Teacher' };
export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TeacherFormPage teacherId={id} />;
}
