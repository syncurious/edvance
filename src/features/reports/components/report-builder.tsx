'use client';

import { useEffect, useState } from 'react';
import {
  CalendarRange,
  Download,
  Filter,
  Layers3,
  TableProperties,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { toast } from '@/components/ui/toast';
import { reportService } from '@/features/reports/services';
import type { ReportService } from '@/features/reports/services';
import { reportTypes } from '@/features/reports/types';
import type { ReportType, SchoolReport } from '@/features/reports/types';
import { studentClasses } from '@/features/students/types';
import type { StudentClass } from '@/features/students/types';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

const reportLabels = {
  academic: 'Academic performance',
  attendance: 'Attendance overview',
  fees: 'Fee collection',
  enrollment: 'Enrollment distribution',
} as const;

export function ReportBuilder({
  service = reportService,
}: {
  service?: ReportService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [type, setType] = useState<ReportType>('academic');
  const [className, setClassName] = useState<StudentClass | 'all'>('all');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [report, setReport] = useState<SchoolReport | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .getReport({ type, campusId, className, startDate, endDate })
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
  }, [campusId, className, endDate, service, startDate, type, version]);

  function exportPreview() {
    toast.add({
      title: 'Export preview only',
      description:
        'File generation will be enabled when the reporting API is connected.',
      type: 'info',
    });
  }

  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="School insights"
        title="Reports"
        description="Use one predictable workflow for academic, attendance, fee, and enrollment reporting."
        actions={
          <Button
            onClick={exportPreview}
            disabled={state !== 'ready' || !report?.rows.length}
          >
            <Download /> Export preview
          </Button>
        }
      />
      <ol
        aria-label="Report workflow"
        className="flex max-w-full gap-2 overflow-x-auto pb-1"
      >
        {[
          ['Filters', Filter],
          ['Data', Layers3],
          ['Summary', CalendarRange],
          ['Table', TableProperties],
          ['Export', Download],
        ].map(([label, Icon], index) => (
          <li key={String(label)} className="flex shrink-0 items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <Icon className="size-4 text-primary" />
            <span className="text-sm font-bold">{String(label)}</span>
            {index < 4 ? (
              <span aria-hidden="true" className="text-muted-foreground">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <Alert>
        <Download />
        <AlertTitle>Export is currently UI-only</AlertTitle>
        <AlertDescription>
          The export action demonstrates the final workflow; no file is
          generated until the NestJS reporting endpoint is integrated through
          Next.js `/api/reports`.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>1. Filters</CardTitle>
          <CardDescription>
            Choose the report dataset and reporting scope.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="report-type">Report type</Label>
            <NativeSelect
              id="report-type"
              value={type}
              onChange={(event) => setType(event.target.value as ReportType)}
            >
              {reportTypes.map((item) => (
                <NativeSelectOption key={item} value={item}>
                  {reportLabels[item]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="report-class">Class</Label>
            <NativeSelect
              id="report-class"
              value={className}
              onChange={(event) =>
                setClassName(event.target.value as StudentClass | 'all')
              }
            >
              <NativeSelectOption value="all">All classes</NativeSelectOption>
              {studentClasses.map((item) => (
                <NativeSelectOption key={item} value={item}>
                  {item}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="report-start">Start date</Label>
            <Input
              id="report-start"
              type="date"
              value={startDate}
              max={endDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="report-end">End date</Label>
            <Input
              id="report-end"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {state === 'error' ? (
        <DashboardErrorState
          message="The report could not be generated."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>2. Data</CardTitle>
              <CardDescription>
                {state === 'loading'
                  ? 'Loading the selected dataset…'
                  : report?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state === 'loading' ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <dl className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Dataset</dt>
                    <dd className="font-bold">{report?.title}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Period</dt>
                    <dd className="font-bold">{report?.generatedFor}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Scope</dt>
                    <dd className="font-bold">
                      {className === 'all' ? 'All classes' : className}
                    </dd>
                  </div>
                </dl>
              )}
            </CardContent>
          </Card>
          <section aria-labelledby="report-summary-title">
            <h2
              id="report-summary-title"
              className="mb-3 text-lg font-semibold"
            >
              3. Summary
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {state === 'loading'
                ? [0, 1, 2, 3].map((item) => (
                    <Card key={item}>
                      <CardContent>
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : report?.metrics.map((metric) => (
                    <Card key={metric.label}>
                      <CardContent>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {metric.label}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={metric.tone}>
                            {metric.value}
                          </StatusBadge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </section>
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>4. Table</CardTitle>
              <CardDescription>
                {report?.title ?? 'Report records'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state === 'ready' && report?.rows.length === 0 ? (
                <DashboardEmptyState
                  title="No report records"
                  description="Change the class or campus filter to broaden the report."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {report?.columns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      )) ??
                        [0, 1, 2, 3, 4].map((item) => (
                          <TableHead key={item}>
                            <Skeleton className="h-4 w-20" />
                          </TableHead>
                        ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state === 'loading'
                      ? [0, 1, 2, 3].map((row) => (
                          <TableRow key={row}>
                            {[0, 1, 2, 3, 4].map((cell) => (
                              <TableCell key={cell}>
                                <Skeleton className="h-5 min-w-20" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      : report?.rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.cells.map((cell, index) => (
                              <TableCell
                                key={`${row.id}-${report.columns[index]}`}
                              >
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>5. Export</CardTitle>
              <CardDescription>
                Review the table before handing the selected filters to the
                future export endpoint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={exportPreview}
                disabled={state !== 'ready' || !report?.rows.length}
              >
                <Download /> Export preview
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                UI demonstration only—no file is downloaded.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
