import type {
  PlatformReport,
  PlatformReportQuery,
} from '@/features/platform-reports/types';

export interface PlatformReportService {
  getReport(query: PlatformReportQuery): Promise<PlatformReport>;
}
