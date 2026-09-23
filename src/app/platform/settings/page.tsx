import type { Metadata } from 'next';

import { PlatformSettingsPage } from '@/features/settings/components/platform-settings';

export const metadata: Metadata = { title: 'Platform Settings | Edvance' };

export default function SuperAdminSettingsPage() {
  return <PlatformSettingsPage />;
}
