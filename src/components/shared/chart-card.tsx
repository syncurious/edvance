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
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import type { DashboardViewState } from '@/features/dashboard/types';

export function ChartCard({
  title,
  description,
  state = 'ready',
  emptyTitle,
  emptyDescription,
  errorMessage,
  onRetry,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  state?: DashboardViewState;
  emptyTitle?: string;
  emptyDescription?: string;
  errorMessage?: string;
  onRetry?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription className="mt-1">{description}</CardDescription>
          ) : null}
        </div>
        {actions}
      </CardHeader>
      <CardContent>
        {state === 'loading' ? (
          <div
            className="grid min-h-64 content-end gap-4"
            aria-label={`Loading ${title}`}
          >
            <Skeleton className="h-3 w-32" />
            <div className="flex h-48 items-end gap-3">
              {[45, 68, 52, 82, 63, 90, 74].map((height) => (
                <Skeleton
                  key={height}
                  className="flex-1"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        ) : state === 'empty' ? (
          <DashboardEmptyState
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : state === 'error' ? (
          <DashboardErrorState message={errorMessage} onRetry={onRetry} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
