import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  emptySuperAdminDashboard,
  SuperAdminDashboardView,
} from '@/features/dashboard/components/super-admin-dashboard';
import { superAdminDashboardMock } from '@/mocks/super-admin-dashboard';

afterEach(cleanup);

describe('SuperAdminDashboardView', () => {
  it('composes every required platform metric and information section', () => {
    render(
      <SuperAdminDashboardView
        data={superAdminDashboardMock}
        state="ready"
        onRetry={() => undefined}
      />,
    );

    const metrics = screen.getByRole('region', { name: 'Platform metrics' });

    for (const label of [
      'Total schools',
      'Active schools',
      'Total students',
      'Total teachers',
      'Monthly revenue',
      'SMS usage',
    ]) {
      expect(within(metrics).getByText(label)).toBeVisible();
    }

    for (const heading of [
      'Revenue performance',
      'Subscription distribution',
      'Schools growth',
      'Student growth',
      'Recent schools',
      'Recent payments',
      'Recent activity',
    ]) {
      expect(screen.getByText(heading)).toBeVisible();
    }

    expect(
      screen.getByRole('figure', {
        name: 'Total and active school growth by month',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('figure', {
        name: 'Subscription distribution across 156 schools',
      }),
    ).toBeVisible();
  });

  it('renders dashboard-wide loading and empty presentations', () => {
    const { rerender } = render(
      <SuperAdminDashboardView
        data={null}
        state="loading"
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByLabelText('Loading Total Schools')).toBeVisible();
    expect(screen.getByLabelText('Loading Revenue performance')).toBeVisible();
    expect(screen.getAllByLabelText('Loading row')).toHaveLength(8);

    rerender(
      <SuperAdminDashboardView
        data={emptySuperAdminDashboard}
        state="empty"
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText('No revenue reported')).toBeVisible();
    expect(screen.getByText('No schools added yet')).toBeVisible();
    expect(screen.getByText('No payments received')).toBeVisible();
    expect(screen.getByText('No recent activity')).toBeVisible();
  });

  it('offers one clear retry when the dashboard request fails', () => {
    const onRetry = vi.fn();
    render(
      <SuperAdminDashboardView data={null} state="error" onRetry={onRetry} />,
    );

    expect(screen.getByText('Something went wrong')).toBeVisible();
    expect(screen.queryByText('Revenue performance')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
