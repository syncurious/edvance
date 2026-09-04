import type { Metadata } from 'next';

import { SchoolsList } from '@/features/schools/components/schools-list';

export const metadata: Metadata = { title: 'Schools' };

export default function SchoolsPage() {
  return <SchoolsList />;
}
