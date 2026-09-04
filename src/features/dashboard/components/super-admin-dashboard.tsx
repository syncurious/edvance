'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  CalendarDays,
  GraduationCap,
  MessageSquareText,
  Plus,
  ReceiptText,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import Link from 'next/link';

import { RevenueChart } from '@/components/charts/revenue-chart';
import { SchoolsGrowthChart } from '@/components/charts/schools-growth-chart';
import { StudentGrowthChart } from '@/components/charts/student-growth-chart';
import { SubscriptionDistributionChart } from '@/components/charts/subscription-distribution-chart';
import { PageHeader } from '@/components/layout/page-header';
import { ChartCard } from '@/components/shared/chart-card';
import { DashboardErrorState } from '@/components/shared/dashboard-state';
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
import { Card, CardContent } from '@/components/ui/card';
import { superAdminDashboardService } from '@/features/dashboard/services';
import type {
  DashboardViewState,
  PaymentSummary,
  SchoolSummary,
  SuperAdminDashboardData,
  SuperAdminMetric,
  SuperAdminMetricId,
} from '@/features/dashboard/types';
import type { LucideIcon } from 'lucide-react';

const metricIcons = {
  'total-schools': Building2,
  'active-schools': ShieldCheck,
  'total-students': GraduationCap,
  'total-teachers': UsersRound,
  'monthly-revenue': WalletCards,
  'sms-usage': MessageSquareText,
} satisfies Record<SuperAdminMetricId, LucideIcon>;

const metricTones = {
  'total-schools': 'primary',
  'active-schools': 'success',
  'total-students': 'info',
  'total-teachers': 'primary',
  'monthly-revenue': 'success',
  'sms-usage': 'warning',
} as const;

const metricPlaceholders: SuperAdminMetric[] = [
  'total-schools',
  'active-schools',
  'total-students',
  'total-teachers',
  'monthly-revenue',
  'sms-usage',
].map((id) => ({
  id: id as SuperAdminMetricId,
  label: id
    .split('-')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' '),
  value: '—',
  trendValue: '—',
  trendLabel: 'No comparison available',
  trendDirection: 'flat',
}));

export const emptySuperAdminDashboard: SuperAdminDashboardData = {
  updatedAt: 'No recent update',
  metrics: metricPlaceholders,
  revenue: [],
  schoolGrowth: [],
  studentGrowth: [],
  subscriptions: [],
  recentSchools: [],
  recentPayments: [],
  recentActivity: [],
  progress: [],
};

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

const paymentColumns: DataTableColumn<PaymentSummary>[] = [
  {
    id: 'invoice',
    header: 'Invoice',
    cell: (payment) => (
      <div>
        <p className="font-mono text-xs font-bold">{payment.invoice}</p>
        <p className="mt-0.5 max-w-48 truncate text-xs text-muted-foreground">
          {payment.school}
        </p>
      </div>
    ),
  },
  {
    id: 'amount',
    header: 'Amount',
    className: 'text-right',
    cell: (payment) => (
      <span className="font-bold">
        Rs {payment.amount.toLocaleString('en-PK')}
      </span>
    ),
  },
  { id: 'date', header: 'Received', cell: (payment) => payment.paidAt },
  {
    id: 'status',
    header: 'Status',
    cell: (payment) => (
      <StatusBadge
        status={
          payment.status === 'Paid'
            ? 'success'
            : payment.status === 'Pending'
              ? 'warning'
              : 'error'
        }
      >
        {payment.status}
      </StatusBadge>
    ),
  },
];

const quickActions: QuickAction[] = [
  {
    label: 'Add school',
    description: 'Create a new school workspace',
    href: '/super-admin/schools/new',
    icon: Plus,
  },
  {
    label: 'Manage plans',
    description: 'Review subscription options',
    href: '/super-admin/subscriptions',
    icon: ReceiptText,
  },
  {
    label: 'Review users',
    description: 'Manage platform access',
    href: '/super-admin/users',
    icon: UsersRound,
  },
];

function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      {children}
    </Link>
  );
}

export function SuperAdminDashboardView({
  data,
  state,
  onRetry,
}: {
  data: SuperAdminDashboardData | null;
  state: DashboardViewState;
  onRetry: () => void;
}) {
  const dashboard = data ?? emptySuperAdminDashboard;

  return (
    <div className="grid gap-7">
      <PageHeader
        eyebrow="Platform overview"
        title="Good afternoon, Areeb."
        description="Monitor school adoption, revenue, usage, and the activity that needs your attention."
        actions={
          <>
            <div className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-muted-foreground">
              <CalendarDays aria-hidden="true" className="size-4" /> Updated{' '}
              {dashboard.updatedAt}
            </div>
            <Button
              render={<Link href="/super-admin/schools/new" />}
              nativeButton={false}
            >
              <Plus data-icon="inline-start" /> Add school
            </Button>
          </>
        }
      />

      {state === 'error' ? (
        <Card>
          <CardContent>
            <DashboardErrorState
              message="The platform overview could not be loaded. Your data is safe—try the request again."
              onRetry={onRetry}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <section
            aria-label="Platform metrics"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {dashboard.metrics.map((metric) => (
              <StatCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                icon={metricIcons[metric.id]}
                tone={metricTones[metric.id]}
                state={state}
                trend={{
                  direction: metric.trendDirection,
                  value: metric.trendValue,
                  label: metric.trendLabel,
                  positive: metric.positive,
                }}
              />
            ))}
          </section>

          <section
            className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr]"
            aria-label="Revenue and subscriptions"
          >
            <ChartCard
              title="Revenue performance"
              description="Monthly revenue compared with target"
              state={state}
              emptyTitle="No revenue reported"
              onRetry={onRetry}
            >
              <RevenueChart data={dashboard.revenue} />
            </ChartCard>
            <ChartCard
              title="Subscription distribution"
              description="Current plan mix across all schools"
              state={state}
              emptyTitle="No active subscriptions"
              onRetry={onRetry}
            >
              <SubscriptionDistributionChart data={dashboard.subscriptions} />
            </ChartCard>
          </section>

          <section
            className="grid gap-4 xl:grid-cols-2"
            aria-label="Platform growth"
          >
            <ChartCard
              title="Schools growth"
              description="Total and active schools over six months"
              state={state}
              emptyTitle="No school history"
              onRetry={onRetry}
            >
              <SchoolsGrowthChart data={dashboard.schoolGrowth} />
            </ChartCard>
            <ChartCard
              title="Student growth"
              description="New enrollments across the network"
              state={state}
              emptyTitle="No enrollment history"
              onRetry={onRetry}
            >
              <StudentGrowthChart data={dashboard.studentGrowth} />
            </ChartCard>
          </section>

          <section
            className="grid gap-4 xl:grid-cols-2"
            aria-label="Recent platform records"
          >
            <DataTable
              title="Recent schools"
              description="Newest school workspaces"
              data={dashboard.recentSchools}
              columns={schoolColumns}
              getRowKey={(school) => school.id}
              state={state}
              emptyTitle="No schools added yet"
              onRetry={onRetry}
              actions={
                <SectionLink href="/super-admin/schools">
                  View all schools
                </SectionLink>
              }
            />
            <DataTable
              title="Recent payments"
              description="Latest subscription transactions"
              data={dashboard.recentPayments}
              columns={paymentColumns}
              getRowKey={(payment) => payment.id}
              state={state}
              emptyTitle="No payments received"
              onRetry={onRetry}
              actions={
                <SectionLink href="/super-admin/billing">
                  View billing
                </SectionLink>
              }
            />
          </section>

          <section
            className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr_0.9fr]"
            aria-label="Platform activity and actions"
          >
            <RecentActivity
              items={dashboard.recentActivity}
              state={state}
              onRetry={onRetry}
            />
            <ProgressCard
              items={dashboard.progress}
              state={state}
              onRetry={onRetry}
            />
            <QuickActions
              actions={quickActions}
              state={state}
              onRetry={onRetry}
            />
          </section>
        </>
      )}
    </div>
  );
}

export function SuperAdminDashboard() {
  const [state, setState] = useState<DashboardViewState>('loading');
  const [data, setData] = useState<SuperAdminDashboardData | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState('loading');

    superAdminDashboardService
      .getOverview()
      .then((result) => {
        if (!active) return;
        setData(result);
        setState(result.metrics.length ? 'ready' : 'empty');
      })
      .catch(() => {
        if (!active) return;
        setData(null);
        setState('error');
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  return (
    <SuperAdminDashboardView
      data={data}
      state={state}
      onRetry={() => setRequestVersion((version) => version + 1)}
    />
  );
}
