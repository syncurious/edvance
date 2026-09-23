import type { Metadata } from 'next';

import { UsagePage } from '@/features/subscriptions/components/subscription-pages';

export const metadata: Metadata = { title: 'Subscription Usage' };

export default function SuperAdminUsagePage() {
  return <UsagePage />;
}
