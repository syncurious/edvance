import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  emptySchoolAdminDashboard,
  SchoolAdminDashboardView,
} from '@/features/dashboard/components/school-admin-dashboard';
import { schoolAdminDashboardMocks } from '@/mocks/school-admin-dashboard';

afterEach(cleanup);

describe('SchoolAdminDashboardView', () => {
  it('shows the required school metrics and operational sections', () => {
    render(
      <SchoolAdminDashboardView
        data={schoolAdminDashboardMocks.all}
        state="ready"
        selectedCampusId="all"
        onCampusChange={() => undefined}
        onRetry={() => undefined}
      />,
    );

    const metrics = screen.getByRole('region', { name: 'School metrics' });
    for (const label of [
      'Students',
      'Teachers',
      'Attendance today',
      'Fees collected',
    ]) {
      expect(within(metrics).getByText(label)).toBeVisible();
    }

    for (const heading of [
      "Today's attendance",
      'Fee collection',
      'Student growth',
      'Upcoming events',
      'Recent activity',
    ]) {
      expect(screen.getByText(heading)).toBeVisible();
    }
  });

  it('renders campus-specific content and reports selector changes', () => {
    const onCampusChange = vi.fn();
    render(
      <SchoolAdminDashboardView
        data={schoolAdminDashboardMocks.central}
        state="ready"
        selectedCampusId="central"
        onCampusChange={onCampusChange}
        onRetry={() => undefined}
      />,
    );

    expect(screen.getAllByText(/for central campus/i)).toHaveLength(2);
    expect(
      within(screen.getByRole('region', { name: 'School metrics' })).getByText(
        '860',
      ),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole('combobox', { name: 'Select dashboard campus' }),
    );
    const southCampus = screen.getByRole('option', { name: 'South Campus' });
    fireEvent.pointerDown(southCampus, { pointerType: 'mouse' });
    fireEvent.click(southCampus);
    expect(onCampusChange).toHaveBeenCalledWith('south');
  });

  it('handles loading, empty, and recoverable error states', () => {
    const onRetry = vi.fn();
    const { rerender } = render(
      <SchoolAdminDashboardView
        data={null}
        state="loading"
        selectedCampusId="all"
        onCampusChange={() => undefined}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByLabelText('Loading Students')).toBeVisible();
    expect(screen.getByLabelText("Loading Today's attendance")).toBeVisible();
    expect(screen.getByLabelText('Loading upcoming events')).toBeVisible();
    expect(
      screen.getByRole('combobox', { name: 'Select dashboard campus' }),
    ).toBeDisabled();

    rerender(
      <SchoolAdminDashboardView
        data={emptySchoolAdminDashboard}
        state="empty"
        selectedCampusId="all"
        onCampusChange={() => undefined}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText('No attendance submitted')).toBeVisible();
    expect(screen.getByText('No fee collections reported')).toBeVisible();
    expect(screen.getByText('No enrollment history')).toBeVisible();
    expect(screen.getByText('No upcoming events')).toBeVisible();
    expect(screen.getByText('No recent activity')).toBeVisible();

    rerender(
      <SchoolAdminDashboardView
        data={null}
        state="error"
        selectedCampusId="all"
        onCampusChange={() => undefined}
        onRetry={onRetry}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
