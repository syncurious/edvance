import type { Metadata } from 'next';

import { SchoolDetails } from '@/features/schools/components/school-details';

export const metadata: Metadata = { title: 'School Details' };

export default async function SchoolDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SchoolDetails schoolId={id} />;
}
