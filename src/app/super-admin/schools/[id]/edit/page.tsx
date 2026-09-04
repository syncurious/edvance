import type { Metadata } from 'next';

import { SchoolFormPage } from '@/features/schools/components/school-form';

export const metadata: Metadata = { title: 'Edit School' };

export default async function EditSchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SchoolFormPage schoolId={id} />;
}
