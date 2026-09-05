'use client';

import { useCallback } from 'react';
import {
  CalendarCheck2,
  CalendarDays,
  GraduationCap,
  UsersRound,
  WalletCards,
} from 'lucide-react';

import { AttendanceChart } from '@/components/charts/attendance-chart';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { StudentGrowthChart } from '@/components/charts/student-growth-chart';
import { PageHeader } from '@/components/layout/page-header';
import { ChartCard } from '@/components/shared/chart-card';
import { DashboardErrorState } from '@/components/shared/dashboard-state';
import { RecentActivity } from '@/components/shared/recent-activity';
import { StatCard } from '@/components/shared/stat-card';
import { WorkspaceSelector } from '@/components/shared/workspace-selector';
import { Card, CardContent } from '@/components/ui/card';
import { UpcomingEvents } from '@/features/dashboard/components/upcoming-events';
import { schoolAdminDashboardService } from '@/features/dashboard/services';
import type {
  CampusId,
  DashboardViewState,
  SchoolAdminDashboardData,
  SchoolAdminMetric,
  SchoolAdminMetricId,
} from '@/features/dashboard/types';
import { useServiceData } from '@/hooks/use-service-data';
import { campusOptions } from '@/mocks/school-admin-dashboard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  campusSelected,
  selectSelectedCampusId,
  selectSelectedSchoolId,
} from '@/store/slices/workspace-slice';
import type { LucideIcon } from 'lucide-react';

const metricIcons = {
  students: GraduationCap,
  teachers: UsersRound,
  attendance: CalendarCheck2,
  'fees-collected': WalletCards,
} satisfies Record<SchoolAdminMetricId, LucideIcon>;

const metricTones = {
  students: 'primary',
  teachers: 'info',
  attendance: 'success',
  'fees-collected': 'warning',
} as const;

const metricPlaceholders: SchoolAdminMetric[] = [
  'students',
  'teachers',
  'attendance',
  'fees-collected',
].map((id) => ({
  id: id as SchoolAdminMetricId,
  label:
    id === 'fees-collected'
      ? 'Fees collected'
      : id === 'attendance'
        ? 'Attendance today'
        : `${id.charAt(0).toUpperCase()}${id.slice(1)}`,
  value: '—',
  trendValue: '—',
  trendLabel: 'No comparison available',
  trendDirection: 'flat',
}));

export const emptySchoolAdminDashboard: SchoolAdminDashboardData = {
  schoolName: 'Crescent Academy',
  campusId: 'all',
  campusName: 'All campuses',
  updatedAt: 'No recent update',
  metrics: metricPlaceholders,
  attendance: [],
  feeCollection: [],
  studentGrowth: [],
  upcomingEvents: [],
  recentActivity: [],
};

const selectorOptions = campusOptions.map((campus) => ({
  label: campus.name,
  value: campus.id,
}));

export function SchoolAdminDashboardView({
  data,
  state,
  selectedCampusId,
  onCampusChange,
  onRetry,
}: {
  data: SchoolAdminDashboardData | null;
  state: DashboardViewState;
  selectedCampusId: CampusId;
  onCampusChange: (campusId: CampusId) => void;
  onRetry: () => void;
}) {
  const dashboard = data ?? {
    ...emptySchoolAdminDashboard,
    campusId: selectedCampusId,
    campusName:
      campusOptions.find((campus) => campus.id === selectedCampusId)?.name ??
      'All campuses',
  };

  return (
    <div className="grid gap-7">
      <PageHeader
        eyebrow={`${dashboard.schoolName} · School overview`}
        title="Good afternoon, Sara."
        description={`Track today's academics, attendance, collections, and upcoming work for ${dashboard.campusName.toLowerCase()}.`}
        actions={
          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-[auto_minmax(11rem,1fr)] sm:items-center">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-muted-foreground">
              <CalendarDays aria-hidden="true" className="size-4" /> Updated{' '}
              {dashboard.updatedAt}
            </span>
            <WorkspaceSelector
              id="dashboard-campus-selector"
              label="Select dashboard campus"
              value={selectedCampusId}
              options={selectorOptions}
              onValueChange={(value) => onCampusChange(value as CampusId)}
              disabled={state === 'loading'}
            />
          </div>
        }
      />

      {state === 'error' ? (
        <Card>
          <CardContent>
            <DashboardErrorState
              message="The school overview could not be loaded. Try the request again without losing your campus selection."
              onRetry={onRetry}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <section
            aria-label="School metrics"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
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
            aria-label="Daily operations"
            className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]"
          >
            <ChartCard
              title="Today's attendance"
              description={`${dashboard.campusName} attendance distribution`}
              state={state}
              emptyTitle="No attendance submitted"
              emptyDescription="Today's totals will appear after a class register is submitted."
              onRetry={onRetry}
            >
              <AttendanceChart data={dashboard.attendance} />
            </ChartCard>
            <ChartCard
              title="Fee collection"
              description="Monthly collections compared with target"
              state={state}
              emptyTitle="No fee collections reported"
              onRetry={onRetry}
            >
              <RevenueChart data={dashboard.feeCollection} />
            </ChartCard>
          </section>

          <section
            aria-label="School growth and schedule"
            className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"
          >
            <ChartCard
              title="Student growth"
              description={`New enrollments for ${dashboard.campusName.toLowerCase()}`}
              state={state}
              emptyTitle="No enrollment history"
              onRetry={onRetry}
            >
              <StudentGrowthChart data={dashboard.studentGrowth} />
            </ChartCard>
            <UpcomingEvents
              events={dashboard.upcomingEvents}
              state={state}
              onRetry={onRetry}
            />
          </section>

          <section aria-label="School activity">
            <RecentActivity
              items={dashboard.recentActivity}
              state={state}
              onRetry={onRetry}
            />
          </section>
        </>
      )}
    </div>
  );
}

export function SchoolAdminDashboard() {
  const dispatch = useAppDispatch();
  const schoolId = useAppSelector(selectSelectedSchoolId);
  const campusId = useAppSelector(selectSelectedCampusId);
  const request = useCallback(
    (service: typeof schoolAdminDashboardService) =>
      service.getOverview({ schoolId, campusId }),
    [campusId, schoolId],
  );
  const { data, state, retry } = useServiceData(
    schoolAdminDashboardService,
    request,
  );

  return (
    <SchoolAdminDashboardView
      data={data}
      state={state}
      selectedCampusId={campusId}
      onCampusChange={(nextCampusId) => dispatch(campusSelected(nextCampusId))}
      onRetry={retry}
    />
  );
}
