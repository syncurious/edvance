import type { Metadata } from 'next';

import { ExamDetail } from '@/features/exams/components/exam-detail';

export const metadata: Metadata = { title: 'Exam details' };

export default async function ExamDetailPage({
  params,
}: PageProps<'/school-admin/exams/[id]'>) {
  const { id } = await params;
  return <ExamDetail examId={id} />;
}
