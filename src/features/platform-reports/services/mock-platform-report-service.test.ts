import { describe, expect, it } from 'vitest';

import { MockPlatformReportService } from '@/features/platform-reports/services/mock-platform-report-service';
import type { PlatformReportType } from '@/features/platform-reports/types';

const reportTypes: PlatformReportType[] = [
  'school-health',
  'subscriptions',
  'revenue',
  'usage',
];

describe('MockPlatformReportService', () => {
  it.each(reportTypes)('builds the %s dataset', async (type) => {
    const service = new MockPlatformReportService(0);
    const report = await service.getReport({
      type,
      search: '',
      startDate: '2026-09-01',
      endDate: '2026-09-30',
    });

    expect(report.metrics).toHaveLength(4);
    expect(report.columns.length).toBeGreaterThan(0);
    expect(report.rows.length).toBeGreaterThan(0);
    expect(report.rows[0].cells).toHaveLength(report.columns.length);
  });

  it('applies record-level search to the selected dataset', async () => {
    const service = new MockPlatformReportService(0);
    const report = await service.getReport({
      type: 'revenue',
      search: 'no-such-invoice',
      startDate: '2026-09-01',
      endDate: '2026-09-30',
    });

    expect(report.rows).toHaveLength(0);
  });
});
