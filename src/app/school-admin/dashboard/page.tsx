import type { Metadata } from 'next';

import { DashboardPreview } from '@/components/shared/dashboard-preview';

export const metadata: Metadata = {
  title: 'School Admin',
};

export default function SchoolAdminDashboardPage() {
  return <DashboardPreview adminRole="school-admin" />;
}
