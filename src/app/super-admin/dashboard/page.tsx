import type { Metadata } from 'next';

import { DashboardPreview } from '@/components/shared/dashboard-preview';

export const metadata: Metadata = {
  title: 'Super Admin',
};

export default function SuperAdminDashboardPage() {
  return <DashboardPreview adminRole="super-admin" />;
}
