import type { SuperAdminDashboardService } from '@/features/dashboard/services/super-admin-dashboard-service';
import { superAdminDashboardMock } from '@/mocks/super-admin-dashboard';

function delay(duration = 500) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export const mockSuperAdminDashboardService: SuperAdminDashboardService = {
  async getOverview() {
    await delay();
    return structuredClone(superAdminDashboardMock);
  },
};
