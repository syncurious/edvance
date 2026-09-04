import { mockSuperAdminDashboardService } from '@/features/dashboard/services/mock-super-admin-dashboard-service';
import type { SuperAdminDashboardService } from '@/features/dashboard/services/super-admin-dashboard-service';

// Swap this implementation for the NestJS-backed service without changing the screen.
export const superAdminDashboardService: SuperAdminDashboardService =
  mockSuperAdminDashboardService;

export type { SuperAdminDashboardService } from '@/features/dashboard/services/super-admin-dashboard-service';
