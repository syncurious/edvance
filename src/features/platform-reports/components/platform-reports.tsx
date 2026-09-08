'use client';

import { CalendarDays, Download, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
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
import { platformReportService } from '@/features/platform-reports/services';
import type { PlatformReportService } from '@/features/platform-reports/services';
import type {
  PlatformReport,
  PlatformReportQuery,
  PlatformReportType,
} from '@/features/platform-reports/types';

const typeLabels: Record<PlatformReportType, string> = {
  'school-health': 'School health',
  subscriptions: 'Subscriptions',
  revenue: 'Revenue collection',
  usage: 'Platform usage',
};

function ReportsLoading() {
  return (
    <div className="grid gap-5" aria-label="Loading platform report">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}

export function PlatformReportsPage({
  service = platformReportService,
}: {
  service?: PlatformReportService;
}) {
  const [query, setQuery] = useState<PlatformReportQuery>({
    type: 'school-health',
    search: '',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
  });
  const [report, setReport] = useState<PlatformReport | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState('loading');
    void service
      .getReport(query)
      .then((result) => {
        if (!active) return;
        setReport(result);
        setState('ready');
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [query, service, version]);

  const exportPreview = () =>
    toast.add({
      title: 'Export preview only',
      description:
        'File generation will be enabled through the relative Next.js `/api/reports/platform/export` route.',
      type: 'info',
    });

  return (
    <div className="grid min-w-0 gap-7">
      <PageHeader
        eyebrow="Platform intelligence"
        title="Platform reports"
        description="Review tenant health, subscriptions, revenue collection, and resource usage from one consistent reporting workspace."
        actions={
          <Button
            type="button"
            onClick={exportPreview}
            disabled={state !== 'ready' || !report?.rows.length}
          >
            <Download /> Export preview
          </Button>
        }
      />

      <Alert>
        <Download />
        <AlertTitle>Export is currently UI-only</AlertTitle>
        <AlertDescription>
          Filters and data are ready; no file is generated until the platform
          export endpoint is connected.
        </AlertDescription>
      </Alert>

      <Card className="min-w-0">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
              <Filter aria-hidden="true" className="size-5" />
            </span>
            <div>
              <CardTitle>Report filters</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Dataset, date range, and record-level search update the report
                together.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <search className="grid gap-4 md:grid-cols-2 xl:grid-cols-[14rem_minmax(15rem,1fr)_11rem_11rem_auto] xl:items-end">
            <div className="grid gap-2">
              <label
                htmlFor="platform-report-type"
                className="text-sm font-bold"
              >
                Report type
              </label>
              <NativeSelect
                id="platform-report-type"
                className="w-full"
                value={query.type}
                onChange={(event) =>
                  setQuery((current) => ({
                    ...current,
                    type: event.target.value as PlatformReportType,
                  }))
                }
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="platform-report-search"
                className="text-sm font-bold"
              >
                Search records
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="platform-report-search"
                  className="pl-9"
                  value={query.search}
                  placeholder="School, code, plan, or invoice"
                  onChange={(event) =>
                    setQuery((current) => ({
                      ...current,
                      search: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="platform-report-start"
                className="text-sm font-bold"
              >
                Start date
              </label>
              <Input
                id="platform-report-start"
                type="date"
                value={query.startDate}
                onChange={(event) =>
                  setQuery((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="platform-report-end"
                className="text-sm font-bold"
              >
                End date
              </label>
              <Input
                id="platform-report-end"
                type="date"
                value={query.endDate}
                onChange={(event) =>
                  setQuery((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={!query.search}
              onClick={() =>
                setQuery((current) => ({ ...current, search: '' }))
              }
            >
              Clear search
            </Button>
          </search>
        </CardContent>
      </Card>

      {state === 'loading' ? <ReportsLoading /> : null}
      {state === 'error' ? (
        <DashboardErrorState
          message="The selected platform report could not be loaded."
          onRetry={() => setVersion((current) => current + 1)}
        />
      ) : null}
      {state === 'ready' && report ? (
        <>
          <section
            aria-label="Platform report summary"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {report.metrics.map((metric) => (
              <Card key={metric.label} className="min-w-0">
                <CardContent className="grid gap-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                      {metric.label}
                    </p>
                    <StatusBadge status={metric.tone}>
                      {typeLabels[query.type]}
                    </StatusBadge>
                  </div>
                  <p className="truncate text-2xl font-black tracking-tight">
                    {metric.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <Card className="min-w-0">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{report.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {query.startDate} to {query.endDate}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {report.rows.length ? (
                <div className="overflow-x-auto rounded-xl border">
                  <Table>
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
                              className={index === 0 ? 'font-bold' : undefined}
                            >
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <DashboardEmptyState
                  title="No report records found"
                  description="Clear the search or choose another report dataset."
                  action={
                    query.search ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setQuery((current) => ({ ...current, search: '' }))
                        }
                      >
                        Clear search
                      </Button>
                    ) : undefined
                  }
                />
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
