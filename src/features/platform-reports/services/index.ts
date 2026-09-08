import { MockPlatformReportService } from '@/features/platform-reports/services/mock-platform-report-service';

export type { PlatformReportService } from '@/features/platform-reports/services/platform-report-service';
export { MockPlatformReportService } from '@/features/platform-reports/services/mock-platform-report-service';

// Future transport calls relative `/api/reports/platform`; the NestJS origin stays server-only.
export const platformReportService = new MockPlatformReportService();
