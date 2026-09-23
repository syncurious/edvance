import type { Metadata } from 'next';

import { StudentFormPage } from '@/features/students/components/student-form';

export const metadata: Metadata = { title: 'Add Student' };

export default function NewStudentPage() {
  return <StudentFormPage />;
}
