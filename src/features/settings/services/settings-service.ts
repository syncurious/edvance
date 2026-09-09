import type {
  PlatformSettings,
  SchoolSettings,
} from '@/features/settings/types';

export interface SettingsService {
  getPlatformSettings(): Promise<PlatformSettings>;
  savePlatformSettings(values: PlatformSettings): Promise<PlatformSettings>;
  getSchoolSettings(schoolId: string): Promise<SchoolSettings>;
  saveSchoolSettings(
    schoolId: string,
    values: SchoolSettings,
  ): Promise<SchoolSettings>;
}
