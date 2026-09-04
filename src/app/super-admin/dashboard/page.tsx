import type { Metadata } from 'next';

import { SuperAdminDashboard } from '@/features/dashboard/components/super-admin-dashboard';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard',
};

export default function SuperAdminDashboardPage() {
  return <SuperAdminDashboard />;
}
