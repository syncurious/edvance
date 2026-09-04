import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Building2, Plus } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AttendanceChart } from '@/components/charts/attendance-chart';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { StudentGrowthChart } from '@/components/charts/student-growth-chart';
import { ChartCard } from '@/components/shared/chart-card';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/shared/data-table';
import { ProgressCard } from '@/components/shared/progress-card';
import { QuickActions } from '@/components/shared/quick-actions';
import { RecentActivity } from '@/components/shared/recent-activity';
import { StatCard } from '@/components/shared/stat-card';
import {
  attendanceData,
  progressItems,
  recentActivities,
  revenueData,
  studentGrowthData,
} from '@/mocks/dashboard';

afterEach(cleanup);

interface TestRow {
  id: string;
  name: string;
}

const columns: DataTableColumn<TestRow>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name },
];

describe('dashboard foundation', () => {
  it('renders a metric and its directional context', () => {
    render(
      <StatCard
        label="Total schools"
        value="156"
        icon={Building2}
        trend={{ direction: 'up', value: '6.8%', label: 'from last month' }}
      />,
    );

    expect(screen.getByText('156')).toBeVisible();
    expect(screen.getByText('6.8%')).toBeVisible();
    expect(screen.getByText('from last month')).toBeVisible();
  });

  it('renders generic table rows and a useful empty state', () => {
    const { rerender } = render(
      <DataTable
        title="Schools"
        data={[{ id: '1', name: 'Crescent Academy' }]}
        columns={columns}
        getRowKey={(row) => row.id}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    expect(screen.getByText('Crescent Academy')).toBeVisible();

    rerender(
      <DataTable
        title="Schools"
        data={[]}
        columns={columns}
        getRowKey={(row) => row.id}
        state="empty"
      />,
    );
    expect(screen.getByText('No records found')).toBeVisible();
  });

  it('supports retry from a chart error state', () => {
    const onRetry = vi.fn();
    render(
      <ChartCard title="Revenue" state="error" onRetry={onRetry}>
        <span>Chart content</span>
      </ChartCard>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders activity, quick-action, and progress data accessibly', () => {
    render(
      <>
        <RecentActivity items={recentActivities.slice(0, 1)} />
        <QuickActions
          actions={[
            {
              label: 'Add school',
              description: 'Start onboarding',
              href: '/super-admin/schools/new',
              icon: Plus,
            },
          ]}
        />
        <ProgressCard items={progressItems.slice(0, 1)} />
      </>,
    );

    expect(
      screen.getByText('Crescent Academy joined Professional'),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /Add school/ })).toHaveAttribute(
      'href',
      '/super-admin/schools/new',
    );
    expect(screen.getByRole('progressbar')).toHaveAccessibleName(
      'School onboarding',
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '75',
    );
  });

  it('labels the line, bar, and donut chart patterns', () => {
    render(
      <>
        <RevenueChart data={revenueData} />
        <StudentGrowthChart data={studentGrowthData} />
        <AttendanceChart data={attendanceData} />
      </>,
    );

    expect(
      screen.getByRole('figure', {
        name: 'Monthly revenue compared with target',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('figure', { name: 'New student enrollments by month' }),
    ).toBeVisible();
    expect(
      screen.getByRole('figure', {
        name: /Attendance distribution, 94% present/,
      }),
    ).toBeVisible();
  });

  it('renders loading and error states without exposing stale data', () => {
    const { rerender } = render(
      <RecentActivity items={recentActivities} state="loading" />,
    );
    expect(screen.getByLabelText('Loading recent activity')).toBeVisible();
    expect(
      screen.queryByText('Crescent Academy joined Professional'),
    ).not.toBeInTheDocument();

    rerender(<RecentActivity items={recentActivities} state="error" />);
    expect(screen.getByText('Something went wrong')).toBeVisible();
    expect(
      screen.queryByText('Crescent Academy joined Professional'),
    ).not.toBeInTheDocument();
  });
});
