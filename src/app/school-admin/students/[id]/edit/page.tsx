import type { Metadata } from 'next';

import { StudentFormPage } from '@/features/students/components/student-form';

export const metadata: Metadata = { title: 'Edit Student' };

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentFormPage studentId={id} />;
}
