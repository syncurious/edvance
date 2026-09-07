import type { SchoolReport, SchoolReportQuery } from '@/features/reports/types';

export interface ReportService {
  getReport(query: SchoolReportQuery): Promise<SchoolReport>;
}
