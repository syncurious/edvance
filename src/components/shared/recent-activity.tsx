import {
  BellRing,
  CircleCheck,
  Clock3,
  Info,
  TriangleAlert,
} from 'lucide-react';

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
import { cn } from '@/lib/utils';
import type {
  ActivityTone,
  DashboardActivity,
  DashboardViewState,
} from '@/features/dashboard/types';

const activityTone = {
  success: {
    icon: CircleCheck,
    className: 'bg-success text-success-foreground',
  },
  info: { icon: Info, className: 'bg-info text-info-foreground' },
  warning: {
    icon: TriangleAlert,
    className: 'bg-warning text-warning-foreground',
  },
  neutral: { icon: BellRing, className: 'bg-muted text-muted-foreground' },
} satisfies Record<ActivityTone, { icon: typeof BellRing; className: string }>;

export function RecentActivity({
  items,
  state = 'ready',
  onRetry,
}: {
  items: DashboardActivity[];
  state?: DashboardViewState;
  onRetry?: () => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest changes across your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        {state === 'loading' ? (
          <div className="grid gap-5" aria-label="Loading recent activity">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="grid flex-1 gap-2">
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : state === 'error' ? (
          <DashboardErrorState
            message="Activity could not be loaded."
            onRetry={onRetry}
          />
        ) : state === 'empty' || items.length === 0 ? (
          <DashboardEmptyState
            title="No recent activity"
            description="New updates will appear here as your team works."
          />
        ) : (
          <ol className="grid gap-5">
            {items.map((item) => {
              const tone = activityTone[item.tone];
              const Icon = tone.icon;
              return (
                <li key={item.id} className="flex gap-3">
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-full',
                      tone.className,
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-5">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <Clock3 aria-hidden="true" className="size-3" />{' '}
                      {item.timestamp}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
