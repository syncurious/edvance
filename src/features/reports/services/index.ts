import type { ReportService } from '@/features/reports/services/report-service';
import { MockReportService } from '@/features/reports/services/mock-report-service';

// Replace with a client that calls relative Next.js /api/reports routes when NestJS integration starts.
export const reportService: ReportService = new MockReportService();

export type { ReportService } from '@/features/reports/services/report-service';
export { MockReportService } from '@/features/reports/services/mock-report-service';
