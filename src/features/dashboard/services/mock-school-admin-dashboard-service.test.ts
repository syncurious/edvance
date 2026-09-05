import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockSchoolAdminDashboardService } from '@/features/dashboard/services/mock-school-admin-dashboard-service';
import { schoolAdminDashboardMocks } from '@/mocks/school-admin-dashboard';

afterEach(() => vi.useRealTimers());

describe('mockSchoolAdminDashboardService', () => {
  it('returns campus-specific cloned dashboard data', async () => {
    vi.useFakeTimers();
    const request = mockSchoolAdminDashboardService.getOverview({
      schoolId: 'crescent-academy',
      campusId: 'central',
    });

    await vi.runAllTimersAsync();
    const result = await request;

    expect(result.campusName).toBe('Central Campus');
    expect(
      result.metrics.find((metric) => metric.id === 'students')?.value,
    ).toBe('860');
    expect(result).not.toBe(schoolAdminDashboardMocks.central);
  });

  it('rejects a school outside the active workspace', async () => {
    vi.useFakeTimers();
    const request = mockSchoolAdminDashboardService.getOverview({
      schoolId: 'missing-school',
      campusId: 'all',
    });
    const rejection = expect(request).rejects.toThrow(
      'School dashboard not found.',
    );

    await vi.runAllTimersAsync();
    await rejection;
  });
});
