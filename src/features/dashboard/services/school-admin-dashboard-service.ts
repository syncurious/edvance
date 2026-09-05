import type {
  CampusId,
  SchoolAdminDashboardData,
} from '@/features/dashboard/types';

export interface SchoolAdminDashboardService {
  getOverview(query: {
    schoolId: string;
    campusId: CampusId;
  }): Promise<SchoolAdminDashboardData>;
}
