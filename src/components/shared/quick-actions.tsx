import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

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
import type { LucideIcon } from 'lucide-react';

export interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function QuickActions({
  actions,
  state = 'ready',
  onRetry,
}: {
  actions: QuickAction[];
  state?: DashboardViewState;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump into common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {state === 'loading' ? (
          [0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-16 w-full" />
          ))
        ) : state === 'error' ? (
          <DashboardErrorState
            message="Quick actions could not be loaded."
            onRetry={onRetry}
          />
        ) : state === 'empty' || actions.length === 0 ? (
          <DashboardEmptyState
            title="No quick actions"
            description="Available shortcuts will appear here."
          />
        ) : (
          actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex min-h-16 items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/35 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
