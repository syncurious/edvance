import type { Metadata } from 'next';

import { ExamForm } from '@/features/exams/components/exam-form';

export const metadata: Metadata = { title: 'Create exam' };

export default function NewExamPage() {
  return <ExamForm />;
}
