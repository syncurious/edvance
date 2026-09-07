import { describe, expect, it } from 'vitest';
import { MockAttendanceService } from '@/features/attendance/services';
import { classMocks } from '@/mocks/classes';

describe('MockAttendanceService', () => {
  it('builds a realistic roster that matches class enrollment', async () => {
    const service = new MockAttendanceService(0);
    const sheet = await service.getSheet('grade-6-a-north', '2026-09-07');
    expect(sheet.records).toHaveLength(
      classMocks.find((item) => item.id === 'grade-6-a-north')?.studentCount,
    );
    expect(new Set(sheet.records.map((record) => record.student.id)).size).toBe(
      sheet.records.length,
    );
  });

  it('saves and reloads the complete daily sheet', async () => {
    const service = new MockAttendanceService(0);
    const sheet = await service.getSheet('grade-5-a-north', '2026-09-07');
    const saved = await service.saveSheet({
      classSectionId: sheet.classSection.id,
      date: sheet.date,
      records: sheet.records.map((record) => ({
        studentId: record.student.id,
        status: 'absent',
        note: 'Weather closure',
      })),
    });
    const reloaded = await service.getSheet(sheet.classSection.id, sheet.date);
    expect(saved.savedAt).not.toBeNull();
    expect(
      reloaded.records.every(
        (record) =>
          record.status === 'absent' && record.note === 'Weather closure',
      ),
    ).toBe(true);
  });

  it('returns distinct daily, weekly, monthly, student, and class reports', async () => {
    const service = new MockAttendanceService(0);
    const reports = await Promise.all(
      ['daily', 'weekly', 'monthly', 'student', 'class'].map((view) =>
        service.getReport({
          view: view as 'daily',
          classSectionId: 'grade-5-a-north',
          date: '2026-09-07',
        }),
      ),
    );
    expect(reports.map((report) => report.title)).toEqual([
      'Daily attendance',
      'Weekly attendance',
      'Monthly attendance',
      'Student attendance',
      'Class attendance',
    ]);
    expect(
      reports.every(
        (report) => report.columns.length >= 4 && report.rows.length > 0,
      ),
    ).toBe(true);
  });
});
