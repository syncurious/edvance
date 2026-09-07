'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, School } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { attendanceService } from '@/features/attendance/services';
import type { AttendanceService } from '@/features/attendance/services';
import type {
  AttendanceReport,
  AttendanceReportView,
} from '@/features/attendance/types';
import { classMocks } from '@/mocks/classes';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

const today = '2026-09-07';
const views: Array<{ value: AttendanceReportView; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'student', label: 'Student' },
  { value: 'class', label: 'Class' },
];
const statusTones = {
  Present: 'success',
  Absent: 'error',
  Late: 'warning',
  Leave: 'info',
} as const;

function ReportSummary({ report }: { report: AttendanceReport }) {
  const metrics = [
    ['Students', report.summary.total, 'neutral'],
    ['Present', report.summary.present, 'success'],
    ['Absent', report.summary.absent, 'error'],
    ['Late', report.summary.late, 'warning'],
    ['Leave', report.summary.leave, 'info'],
    [
      'Attendance',
      `${report.summary.attendanceRate}%`,
      report.summary.attendanceRate >= 90 ? 'success' : 'warning',
    ],
  ] as const;
  return (
    <section
      aria-label="Attendance report summary"
      className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
    >
      {metrics.map(([label, value, tone]) => (
        <Card key={label}>
          <CardContent className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <div className="mt-2">
              <StatusBadge status={tone}>{value}</StatusBadge>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function AttendanceReports({
  service = attendanceService,
}: {
  service?: AttendanceService;
}) {
  const selectedCampusId = useAppSelector(selectSelectedCampusId);
  const classes = useMemo(
    () =>
      classMocks.filter(
        (item) =>
          selectedCampusId === 'all' || item.campusId === selectedCampusId,
      ),
    [selectedCampusId],
  );
  const [view, setView] = useState<AttendanceReportView>('daily');
  const [classSectionId, setClassSectionId] = useState(classes[0]?.id ?? '');
  const [date, setDate] = useState(today);
  const [studentId, setStudentId] = useState<string>();
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (classes.some((item) => item.id === classSectionId)) return;
    setClassSectionId(classes[0]?.id ?? '');
    setStudentId(undefined);
  }, [classSectionId, classes]);
  useEffect(() => {
    if (!classSectionId) {
      setReport(null);
      setState('ready');
      return;
    }
    let active = true;
    setState('loading');
    service
      .getReport({ view, classSectionId, date, studentId })
      .then((data) => {
        if (active) {
          setReport(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [classSectionId, date, service, studentId, version, view]);

  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="Attendance insights"
        title="Attendance reports"
        description="Move from a daily register to weekly, monthly, student, and class-level patterns with one consistent report layout."
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/school-admin/attendance" />}
          >
            <ArrowLeft /> Mark attendance
          </Button>
        }
      />
      <Tabs
        className="min-w-0"
        value={view}
        onValueChange={(value) => {
          setView(value as AttendanceReportView);
          setStudentId(undefined);
        }}
      >
        <div className="max-w-full overflow-x-auto pb-2">
          <TabsList aria-label="Attendance report views" className="w-max">
            {views.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="px-4 py-2"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Report filters</CardTitle>
          <CardDescription>
            The selected campus from the workspace limits available class
            sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="report-class">Class section</Label>
            <NativeSelect
              id="report-class"
              value={classSectionId}
              onChange={(event) => {
                setClassSectionId(event.target.value);
                setStudentId(undefined);
              }}
            >
              {classes.map((item) => (
                <NativeSelectOption key={item.id} value={item.id}>
                  {item.gradeName} · Section {item.section} · {item.campusName}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="report-date">
              {view === 'monthly'
                ? 'Month ending'
                : view === 'weekly' || view === 'class'
                  ? 'Period ending'
                  : 'Report date'}
            </Label>
            <Input
              id="report-date"
              type="date"
              max={today}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          {view === 'student' ? (
            <div className="grid gap-2">
              <Label htmlFor="report-student">Student</Label>
              <NativeSelect
                id="report-student"
                value={studentId ?? report?.students[0]?.id ?? ''}
                onChange={(event) => setStudentId(event.target.value)}
              >
                {report?.students.map((student) => (
                  <NativeSelectOption key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ·{' '}
                    {student.rollNumber}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          ) : (
            <div className="hidden items-center gap-3 rounded-xl border bg-muted/40 p-4 xl:flex">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                {view === 'class' ? (
                  <School className="size-4" />
                ) : (
                  <CalendarDays className="size-4" />
                )}
              </span>
              <p className="text-sm text-muted-foreground">
                Results refresh automatically when filters change.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {state === 'loading' ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </>
      ) : null}
      {state === 'error' ? (
        <DashboardErrorState
          message="We could not load this attendance report."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : null}
      {state === 'ready' && !report ? (
        <DashboardEmptyState
          title="No report available"
          description="Choose a campus with an active class section."
        />
      ) : null}
      {state === 'ready' && report ? (
        <>
          <ReportSummary report={report} />
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {report.rows.length ? (
                <div className="overflow-x-auto rounded-xl border">
                  <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow>
                        {report.columns.map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.cells.map((cell, index) => (
                            <TableCell
                              key={`${row.id}-${report.columns[index]}`}
                              className={
                                index === 0 ? 'font-semibold' : undefined
                              }
                            >
                              {cell in statusTones ? (
                                <StatusBadge
                                  status={
                                    statusTones[
                                      cell as keyof typeof statusTones
                                    ]
                                  }
                                >
                                  {cell}
                                </StatusBadge>
                              ) : (
                                cell
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <DashboardEmptyState
                  title="No attendance records"
                  description="Saved attendance will appear in this report."
                />
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
