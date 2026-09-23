import type { Metadata } from 'next';

import { FeesOverview } from '@/features/fees/components/fees-overview';

export const metadata: Metadata = { title: 'Fees overview' };

export default function FeesPage() {
  return <FeesOverview />;
}
