import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AttendanceEntry } from '@/features/attendance/components/attendance-entry';
import { MockAttendanceService } from '@/features/attendance/services';
import type { AttendanceService } from '@/features/attendance/services';
import { makeStore } from '@/store';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
beforeEach(() => {
  push.mockReset();
  vi.mocked(useRouter).mockReturnValue({ push } as never);
});
afterEach(cleanup);
const renderEntry = (
  service: AttendanceService = new MockAttendanceService(0),
) =>
  render(
    <Provider store={makeStore()}>
      <AttendanceEntry service={service} />
    </Provider>,
  );

describe('AttendanceEntry', () => {
  it('marks a large roster individually or in bulk and saves it', async () => {
    renderEntry();
    expect(await screen.findByText('Grade 5 · Section A')).toBeVisible();
    expect(
      screen.getAllByRole('group', { name: /Attendance for/ }),
    ).toHaveLength(28);
    expect(
      within(
        screen.getAllByRole('group', { name: /Attendance for/ })[0],
      ).getByRole('button', { name: /Present/ }),
    ).toHaveTextContent('Present');
    fireEvent.click(screen.getByRole('button', { name: 'Mark all absent' }));
    expect(
      within(
        screen.getByRole('region', { name: 'Attendance summary' }),
      ).getByText('28'),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Save attendance' }));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Save attendance' }),
      ).toBeDisabled(),
    );
    expect(screen.getByText('Attendance saved')).toBeVisible();
  });

  it('guards class and date changes while the sheet is dirty', async () => {
    renderEntry();
    await screen.findByText('Grade 5 · Section A');
    fireEvent.click(screen.getByRole('button', { name: 'Mark all present' }));
    fireEvent.change(screen.getByLabelText('Attendance date'), {
      target: { value: '2026-09-06' },
    });
    expect(
      await screen.findByText('Discard unsaved attendance?'),
    ).toBeVisible();
    expect(screen.getByLabelText('Attendance date')).toHaveValue('2026-09-07');
    fireEvent.click(screen.getByRole('button', { name: 'Keep editing' }));
    const beforeUnload = new Event('beforeunload', { cancelable: true });
    expect(window.dispatchEvent(beforeUnload)).toBe(false);
  });

  it('shows a recoverable loading failure', async () => {
    const failing: AttendanceService = {
      getSheet: vi.fn().mockRejectedValue(new Error('offline')),
      saveSheet: vi.fn(),
      getReport: vi.fn(),
    };
    renderEntry(failing);
    expect(await screen.findByText('Something went wrong')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });
});
