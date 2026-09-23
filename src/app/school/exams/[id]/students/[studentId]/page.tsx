import type { Metadata } from 'next';

import { StudentResultView } from '@/features/exams/components/student-result';

export const metadata: Metadata = { title: 'Student result' };

export default async function StudentResultPage({
  params,
}: PageProps<'/school-admin/exams/[id]/students/[studentId]'>) {
  const { id, studentId } = await params;
  return <StudentResultView examId={id} studentId={studentId} />;
}
