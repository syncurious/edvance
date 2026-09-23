import type { Metadata } from 'next';

import { StudentProfile } from '@/features/students/components/student-profile';

export const metadata: Metadata = { title: 'Student Profile' };

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentProfile studentId={id} />;
}
