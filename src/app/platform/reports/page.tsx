import type { Metadata } from 'next';

import { PlatformReportsPage } from '@/features/platform-reports/components/platform-reports';

export const metadata: Metadata = { title: 'Platform Reports | Edvance' };

export default function SuperAdminReportsPage() {
  return <PlatformReportsPage />;
}
