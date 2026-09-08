import { describe, expect, it } from 'vitest';

import { MockSettingsService } from '@/features/settings/services/mock-settings-service';

describe('MockSettingsService', () => {
  it('persists platform settings without exposing mutable service state', async () => {
    const service = new MockSettingsService(0);
    const current = await service.getPlatformSettings();

    await service.savePlatformSettings({
      ...current,
      platformName: 'Edvance Cloud',
    });
    current.platformName = 'Changed outside the service';

    expect((await service.getPlatformSettings()).platformName).toBe(
      'Edvance Cloud',
    );
  });

  it('keeps each school configuration independently scoped', async () => {
    const service = new MockSettingsService(0);
    const first = await service.getSchoolSettings('school-one');

    await service.saveSchoolSettings('school-one', {
      ...first,
      schoolName: 'Northbridge School',
    });

    expect((await service.getSchoolSettings('school-one')).schoolName).toBe(
      'Northbridge School',
    );
    expect((await service.getSchoolSettings('school-two')).schoolName).toBe(
      'Crescent Academy',
    );
  });
});
