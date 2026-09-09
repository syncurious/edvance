import { MockSettingsService } from '@/features/settings/services/mock-settings-service';

export type { SettingsService } from '@/features/settings/services/settings-service';
export { MockSettingsService } from '@/features/settings/services/mock-settings-service';

// Replace with relative `/api/settings` clients when the NestJS settings contract is connected.
export const settingsService = new MockSettingsService();
