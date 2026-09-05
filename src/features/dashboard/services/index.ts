import { mockSuperAdminDashboardService } from '@/features/dashboard/services/mock-super-admin-dashboard-service';
import { mockSchoolAdminDashboardService } from '@/features/dashboard/services/mock-school-admin-dashboard-service';
import type { SchoolAdminDashboardService } from '@/features/dashboard/services/school-admin-dashboard-service';
import type { SuperAdminDashboardService } from '@/features/dashboard/services/super-admin-dashboard-service';

// Swap this implementation for the NestJS-backed service without changing the screen.
export const superAdminDashboardService: SuperAdminDashboardService =
  mockSuperAdminDashboardService;
export const schoolAdminDashboardService: SchoolAdminDashboardService =
  mockSchoolAdminDashboardService;

export type { SuperAdminDashboardService } from '@/features/dashboard/services/super-admin-dashboard-service';
export type { SchoolAdminDashboardService } from '@/features/dashboard/services/school-admin-dashboard-service';
