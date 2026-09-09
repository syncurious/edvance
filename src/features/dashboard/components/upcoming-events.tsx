import { CalendarClock, Clock3 } from 'lucide-react';

import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  DashboardViewState,
  UpcomingEvent,
} from '@/features/dashboard/types';

export function UpcomingEvents({
  events,
  state = 'ready',
  onRetry,
}: {
  events: UpcomingEvent[];
  state?: DashboardViewState;
  onRetry?: () => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="grid grid-cols-[1fr_auto] gap-4">
        <div>
          <CardTitle>Upcoming events</CardTitle>
          <CardDescription className="mt-1">
            Dates coming up across this campus
          </CardDescription>
        </div>
        <span className="grid size-9 place-items-center rounded-lg bg-info text-info-foreground">
          <CalendarClock aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        {state === 'loading' ? (
          <div className="grid gap-4" aria-label="Loading upcoming events">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex gap-3">
                <Skeleton className="h-14 w-12 shrink-0 rounded-lg" />
                <div className="grid flex-1 gap-2">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : state === 'error' ? (
          <DashboardErrorState
            message="Upcoming events could not be loaded."
            onRetry={onRetry}
          />
        ) : state === 'empty' || events.length === 0 ? (
          <DashboardEmptyState
            title="No upcoming events"
            description="New school dates will appear here."
          />
        ) : (
          <ol className="grid gap-3">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex gap-3 rounded-xl border border-border bg-background p-3"
              >
                <time className="grid h-14 w-12 shrink-0 place-content-center rounded-lg bg-primary/10 text-center text-primary">
                  <span className="text-lg font-semibold leading-none">
                    {event.day}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold tracking-wider">
                    {event.month}
                  </span>
                </time>
                <div className="min-w-0">
                  <p className="font-bold leading-5">{event.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {event.detail}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                    <Clock3 aria-hidden="true" className="size-3" />
                    {event.time}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
