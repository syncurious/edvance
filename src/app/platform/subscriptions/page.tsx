import type { Metadata } from 'next';

import { SubscriptionsPage } from '@/features/subscriptions/components/subscription-pages';

export const metadata: Metadata = { title: 'Subscriptions' };

export default function SuperAdminSubscriptionsPage() {
  return <SubscriptionsPage />;
}
