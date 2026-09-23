import type { Metadata } from 'next';

import { SchoolFormPage } from '@/features/schools/components/school-form';

export const metadata: Metadata = { title: 'Add School' };

export default function NewSchoolPage() {
  return <SchoolFormPage />;
}
