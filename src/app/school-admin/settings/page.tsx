import type { Metadata } from 'next';

import { SchoolSettingsPage } from '@/features/settings/components/school-settings';

export const metadata: Metadata = { title: 'School Settings | Edvance' };

export default function SchoolAdminSettingsPage() {
  return <SchoolSettingsPage />;
}
