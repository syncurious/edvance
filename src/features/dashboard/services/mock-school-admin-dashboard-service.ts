import type { SchoolAdminDashboardService } from '@/features/dashboard/services/school-admin-dashboard-service';
import { schoolAdminDashboardMocks } from '@/mocks/school-admin-dashboard';

function delay(duration = 450) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export const mockSchoolAdminDashboardService: SchoolAdminDashboardService = {
  async getOverview({ schoolId, campusId }) {
    await delay();

    if (schoolId !== 'crescent-academy') {
      throw new Error('School dashboard not found.');
    }

    return structuredClone(schoolAdminDashboardMocks[campusId]);
  },
};
