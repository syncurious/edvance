import type { Metadata } from 'next';

import { DefaultersPage } from '@/features/fees/components/defaulters-page';

export const metadata: Metadata = { title: 'Defaulters' };

export default function FeeDefaultersPage() {
  return <DefaultersPage />;
}
