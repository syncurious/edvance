import { Target } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import type {
  DashboardProgressItem,
  DashboardViewState,
} from '@/features/dashboard/types';

export function ProgressCard({
  items,
  state = 'ready',
  onRetry,
}: {
  items: DashboardProgressItem[];
  state?: DashboardViewState;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_auto] gap-4">
        <div>
          <CardTitle>Progress overview</CardTitle>
          <CardDescription className="mt-1">
            Current targets and completion
          </CardDescription>
        </div>
        <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Target aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="grid gap-6">
        {state === 'loading' ? (
          [0, 1, 2].map((item) => (
            <div key={item} className="grid gap-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-1 w-full" />
              <Skeleton className="h-3 w-44" />
            </div>
          ))
        ) : state === 'error' ? (
          <DashboardErrorState
            message="Progress could not be loaded."
            onRetry={onRetry}
          />
        ) : state === 'empty' || items.length === 0 ? (
          <DashboardEmptyState
            title="No targets configured"
            description="Set a target to start tracking progress."
          />
        ) : (
          items.map((item) => {
            const percentage = Math.min(
              100,
              Math.round((item.value / item.target) * 100),
            );
            return (
              <div key={item.id} className="grid gap-2">
                <Progress
                  value={percentage}
                  aria-label={`${item.label}: ${percentage}% complete`}
                >
                  <ProgressLabel>{item.label}</ProgressLabel>
                  <ProgressValue>{() => `${percentage}%`}</ProgressValue>
                </Progress>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
