'use client';

import { useState } from 'react';
import {
  Building2,
  GraduationCap,
  MessageSquareText,
  Plus,
  ReceiptText,
  RefreshCw,
  School,
  Send,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';

import { AttendanceChart } from '@/components/charts/attendance-chart';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { StudentGrowthChart } from '@/components/charts/student-growth-chart';
import { ChartCard } from '@/components/shared/chart-card';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/shared/data-table';
import { ProgressCard } from '@/components/shared/progress-card';
import {
  QuickActions,
  type QuickAction,
} from '@/components/shared/quick-actions';
import { RecentActivity } from '@/components/shared/recent-activity';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import type {
  DashboardViewState,
  SchoolSummary,
} from '@/features/dashboard/types';
import {
  attendanceData,
  progressItems,
  recentActivities,
  recentSchools,
  revenueData,
  studentGrowthData,
} from '@/mocks/dashboard';
import { cn } from '@/lib/utils';

const states: Array<{ value: DashboardViewState; label: string }> = [
  { value: 'ready', label: 'Ready' },
  { value: 'loading', label: 'Loading' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'Error' },
];

const schoolColumns: DataTableColumn<SchoolSummary>[] = [
  {
    id: 'school',
    header: 'School',
    cell: (school) => (
      <div>
        <p className="font-bold">{school.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{school.code}</p>
      </div>
    ),
  },
  { id: 'plan', header: 'Plan', cell: (school) => school.plan },
  {
    id: 'students',
    header: 'Students',
    className: 'text-right',
    cell: (school) => school.students.toLocaleString(),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (school) => (
      <StatusBadge
        status={
          school.status === 'Active'
            ? 'success'
            : school.status === 'Trial'
              ? 'info'
              : 'warning'
        }
      >
        {school.status}
      </StatusBadge>
    ),
  },
];

const quickActions: QuickAction[] = [
  {
    label: 'Add a school',
    description: 'Start platform onboarding',
    href: '/super-admin/schools/new',
    icon: Plus,
  },
  {
    label: 'Create invoice',
    description: 'Add a student fee invoice',
    href: '/school-admin/fees/invoices',
    icon: ReceiptText,
  },
  {
    label: 'Send announcement',
    description: 'Message a school community',
    href: '/school-admin/settings',
    icon: Send,
  },
];

export function DashboardFoundationShowcase() {
  const [state, setState] = useState<DashboardViewState>('ready');

  return (
    <div className="grid gap-8">
      <fieldset className="rounded-2xl border border-border bg-card p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <legend className="sr-only">Preview component state</legend>
        <div>
          <p className="text-sm font-semibold">Preview component state</p>
          <p className="mt-1 text-xs text-muted-foreground">
            One control exercises the same state contract across the dashboard.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1 rounded-xl bg-muted p-1 sm:mt-0">
          {states.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={state === option.value}
              className={cn(
                'min-h-9 rounded-lg px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30',
                state === option.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setState(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <section aria-labelledby="dashboard-metrics-heading">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Metrics
          </p>
          <h2
            id="dashboard-metrics-heading"
            className="mt-1 text-xl font-semibold tracking-tight"
          >
            Stat cards
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total schools"
            value="156"
            icon={Building2}
            state={state}
            trend={{ direction: 'up', value: '6.8%', label: 'from last month' }}
          />
          <StatCard
            label="Active students"
            value="82,450"
            icon={GraduationCap}
            tone="info"
            state={state}
            trend={{ direction: 'up', value: '3.2%', label: 'from last month' }}
          />
          <StatCard
            label="Teaching staff"
            value="5,284"
            icon={UsersRound}
            tone="success"
            state={state}
            trend={{ direction: 'up', value: '118', label: 'new this term' }}
          />
          <StatCard
            label="SMS delivery"
            value="98.4%"
            icon={MessageSquareText}
            tone="warning"
            state={state}
            trend={{
              direction: 'down',
              value: '0.4%',
              label: 'from last week',
              positive: false,
            }}
          />
        </div>
      </section>

      <section
        className="grid gap-4 xl:grid-cols-2"
        aria-label="Dashboard chart patterns"
      >
        <ChartCard
          title="Monthly revenue"
          description="Actual revenue compared with the operating target"
          state={state}
          emptyTitle="No revenue reported"
          emptyDescription="Revenue will appear after the first payment is recorded."
          onRetry={() => setState('ready')}
          actions={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Refresh revenue"
            >
              <RefreshCw aria-hidden="true" />
            </Button>
          }
        >
          <RevenueChart data={revenueData} />
        </ChartCard>

        <ChartCard
          title="Student growth"
          description="New enrollments during the last six months"
          state={state}
          emptyTitle="No enrollment history"
          onRetry={() => setState('ready')}
        >
          <StudentGrowthChart data={studentGrowthData} />
        </ChartCard>

        <ChartCard
          title="Today's attendance"
          description="Distribution across North Campus"
          state={state}
          emptyTitle="Attendance not submitted"
          onRetry={() => setState('ready')}
          className="xl:max-w-xl"
        >
          <AttendanceChart data={attendanceData} />
        </ChartCard>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <QuickActions
            actions={quickActions}
            state={state}
            onRetry={() => setState('ready')}
          />
          <ProgressCard
            items={progressItems}
            state={state}
            onRetry={() => setState('ready')}
          />
        </div>
      </section>

      <section
        className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr]"
        aria-label="Dashboard data patterns"
      >
        <DataTable
          title="Recently added schools"
          description="A reusable compact table for dashboard summaries"
          data={recentSchools}
          columns={schoolColumns}
          getRowKey={(school) => school.id}
          state={state}
          emptyTitle="No schools added yet"
          onRetry={() => setState('ready')}
          actions={
            <Link
              href="/super-admin/schools"
              className="rounded-md text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              View all
            </Link>
          }
        />
        <RecentActivity
          items={recentActivities}
          state={state}
          onRetry={() => setState('ready')}
        />
      </section>

      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        <School aria-hidden="true" className="mb-3 size-5 text-primary" />
        These primitives are intentionally independent of the Super Admin and
        School Admin route pages. Days 6 and 9 can compose them with
        role-specific service data without copying chart or state logic.
      </div>
    </div>
  );
}
