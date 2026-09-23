import type { Metadata } from 'next';

import { StudentsList } from '@/features/students/components/students-list';

export const metadata: Metadata = { title: 'Students' };

export default function StudentsPage() {
  return <StudentsList />;
}
