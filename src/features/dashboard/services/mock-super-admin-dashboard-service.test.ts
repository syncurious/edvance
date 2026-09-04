import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockSuperAdminDashboardService } from '@/features/dashboard/services/mock-super-admin-dashboard-service';
import { superAdminDashboardMock } from '@/mocks/super-admin-dashboard';

afterEach(() => vi.useRealTimers());

describe('mockSuperAdminDashboardService', () => {
  it('returns a complete cloned dashboard payload behind the service contract', async () => {
    vi.useFakeTimers();
    const request = mockSuperAdminDashboardService.getOverview();

    await vi.runAllTimersAsync();
    const result = await request;

    expect(result.metrics).toHaveLength(6);
    expect(result.revenue).not.toHaveLength(0);
    expect(result.schoolGrowth).not.toHaveLength(0);
    expect(result.subscriptions).not.toHaveLength(0);
    expect(result).not.toBe(superAdminDashboardMock);
  });
});
