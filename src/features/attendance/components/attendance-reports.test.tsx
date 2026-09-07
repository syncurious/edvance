import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AttendanceReports } from '@/features/attendance/components/attendance-reports';
import { MockAttendanceService } from '@/features/attendance/services';
import type { AttendanceService } from '@/features/attendance/services';
import { makeStore } from '@/store';

afterEach(cleanup);
const renderReports = (
  service: AttendanceService = new MockAttendanceService(0),
) =>
  render(
    <Provider store={makeStore()}>
      <AttendanceReports service={service} />
    </Provider>,
  );

describe('AttendanceReports', () => {
  it('switches across all five report views with shared filters and summaries', async () => {
    renderReports();
    expect(await screen.findByText('Daily attendance')).toBeVisible();
    expect(
      screen.getByRole('region', { name: 'Attendance report summary' }),
    ).toBeVisible();
    for (const [tab, title] of [
      ['Weekly', 'Weekly attendance'],
      ['Monthly', 'Monthly attendance'],
      ['Student', 'Student attendance'],
      ['Class', 'Class attendance'],
    ] as const) {
      fireEvent.click(screen.getByRole('tab', { name: tab }));
      expect(await screen.findByText(title)).toBeVisible();
    }
    expect(screen.getByRole('columnheader', { name: 'Rate' })).toBeVisible();
  });

  it('handles a report service failure with retry', async () => {
    const failing: AttendanceService = {
      getSheet: vi.fn(),
      saveSheet: vi.fn(),
      getReport: vi.fn().mockRejectedValue(new Error('offline')),
    };
    renderReports(failing);
    expect(await screen.findByText('Something went wrong')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });
});
