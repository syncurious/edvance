'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import { cn } from '@/lib/utils';
import type { DashboardViewState } from '@/features/dashboard/types';

export interface DataTableColumn<Row> {
  id: string;
  header: string;
  cell: (row: Row) => React.ReactNode;
  className?: string;
}

export function DataTable<Row>({
  title,
  description,
  data,
  columns,
  getRowKey,
  state = 'ready',
  emptyTitle = 'No records found',
  emptyDescription = 'Records will appear here when they become available.',
  errorMessage = 'The table could not be loaded.',
  onRetry,
  actions,
}: {
  title: string;
  description?: string;
  data: Row[];
  columns: DataTableColumn<Row>[];
  getRowKey: (row: Row) => React.Key;
  state?: DashboardViewState;
  emptyTitle?: string;
  emptyDescription?: string;
  errorMessage?: string;
  onRetry?: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription className="mt-1">{description}</CardDescription>
          ) : null}
        </div>
        {actions}
      </CardHeader>
      <CardContent>
        {state === 'error' ? (
          <DashboardErrorState message={errorMessage} onRetry={onRetry} />
        ) : state === 'empty' || (state === 'ready' && data.length === 0) ? (
          <DashboardEmptyState
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {state === 'loading'
                ? [0, 1, 2, 3].map((row) => (
                    <TableRow key={row} aria-label="Loading row">
                      {columns.map((column) => (
                        <TableCell key={column.id} className={column.className}>
                          <Skeleton className="h-5 w-full min-w-16" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : data.map((row) => (
                    <TableRow key={getRowKey(row)}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          className={cn(column.className)}
                        >
                          {column.cell(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
