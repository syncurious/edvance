import type { Metadata } from 'next';

import { RoutePlaceholder } from '@/components/shared/route-placeholder';

export const metadata: Metadata = {
  title: 'Super Admin',
};

export default function SuperAdminDashboardPage() {
  return (
    <RoutePlaceholder
      eyebrow="Super Admin route"
      title="Platform visibility, in one place."
      description="This route will bring schools, subscriptions, users, revenue, and system activity into a focused operating view."
      plannedFor="Days 3–8"
    />
  );
}
