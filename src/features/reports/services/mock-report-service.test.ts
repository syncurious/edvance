import { describe, expect, it } from 'vitest';

import { MockReportService } from '@/features/reports/services';
import type { ReportType } from '@/features/reports/types';

describe('MockReportService', () => {
  it('returns all reusable report shapes with metrics and tables', async () => {
    const service = new MockReportService(0);
    const reports = await Promise.all(
      (['academic', 'attendance', 'fees', 'enrollment'] as ReportType[]).map(
        (type) =>
          service.getReport({
            type,
            campusId: 'all',
            className: 'all',
            startDate: '2026-09-01',
            endDate: '2026-09-30',
          }),
      ),
    );
    expect(reports.map((report) => report.title)).toEqual([
      'Academic performance',
      'Attendance overview',
      'Fee collection',
      'Enrollment distribution',
    ]);
    expect(
      reports.every(
        (report) =>
          report.metrics.length === 4 &&
          report.columns.length >= 5 &&
          report.rows.length > 0,
      ),
    ).toBe(true);
  });

  it('keeps the fee summary aligned with its grouped table', async () => {
    const report = await new MockReportService(0).getReport({
      type: 'fees',
      campusId: 'all',
      className: 'all',
      startDate: '2026-09-01',
      endDate: '2026-09-30',
    });
    const currencyValue = (value: string) =>
      Number(value.replace(/[^\d-]/g, ''));
    const tableBilled = report.rows.reduce(
      (total, row) => total + currencyValue(row.cells[2]),
      0,
    );
    const tableCollected = report.rows.reduce(
      (total, row) => total + currencyValue(row.cells[3]),
      0,
    );

    expect(tableBilled).toBe(currencyValue(report.metrics[0].value));
    expect(tableCollected).toBe(currencyValue(report.metrics[1].value));
  });
});
