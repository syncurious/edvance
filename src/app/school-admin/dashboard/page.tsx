import type { Metadata } from 'next';

import { SchoolAdminDashboard } from '@/features/dashboard/components/school-admin-dashboard';

export const metadata: Metadata = {
  title: 'School Dashboard',
};

export default function SchoolAdminDashboardPage() {
  return <SchoolAdminDashboard />;
}
