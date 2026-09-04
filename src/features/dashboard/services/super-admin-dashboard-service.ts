import type { SuperAdminDashboardData } from '@/features/dashboard/types';

export interface SuperAdminDashboardService {
  getOverview(): Promise<SuperAdminDashboardData>;
}
