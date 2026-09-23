import type { Metadata } from 'next';
import { ClassDetails } from '@/features/classes/components/class-details';

export const metadata: Metadata = { title: 'Class Details' };
export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClassDetails classId={id} />;
}
