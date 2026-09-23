import type { Metadata } from 'next';

import { BillingPage } from '@/features/subscriptions/components/subscription-pages';

export const metadata: Metadata = { title: 'Billing' };

export default function SuperAdminBillingPage() {
  return <BillingPage />;
}
