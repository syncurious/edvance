import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { DashboardViewState } from '@/features/dashboard/types';
import type { LucideIcon } from 'lucide-react';

type StatTone = 'primary' | 'success' | 'warning' | 'info';
type TrendDirection = 'up' | 'down' | 'flat';

const toneClasses: Record<StatTone, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-info text-info-foreground',
};

const trendIcons: Record<TrendDirection, LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

export interface StatCardProps {
  label: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  tone?: StatTone;
  trend?: {
    direction: TrendDirection;
    value: string;
    label: string;
    positive?: boolean;
  };
  state?: DashboardViewState;
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = 'primary',
  trend,
  state = 'ready',
}: StatCardProps) {
  if (state === 'loading') {
    return (
      <Card aria-label={`Loading ${label}`}>
        <CardContent className="grid gap-5 pt-1">
          <div className="flex justify-between gap-4">
            <div className="grid flex-1 gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="size-11 rounded-xl" />
          </div>
          <Skeleton className="h-6 w-36" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_auto] gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
            {state === 'ready' ? value : '—'}
          </p>
        </div>
        <span
          className={cn(
            'grid size-11 place-items-center rounded-xl',
            toneClasses[tone],
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </CardHeader>
      <CardContent>
        {state === 'error' ? (
          <p className="flex items-center gap-2 text-xs font-semibold text-destructive">
            <ArrowRight aria-hidden="true" className="size-3.5" /> Unable to
            load metric
          </p>
        ) : state === 'empty' ? (
          <p className="text-xs text-muted-foreground">
            No data for this period
          </p>
        ) : trend ? (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span
              className={cn(
                'inline-flex items-center gap-1 font-bold',
                trend.positive === false
                  ? 'text-destructive'
                  : 'text-success-foreground',
              )}
            >
              {(() => {
                const TrendIcon = trendIcons[trend.direction];
                return <TrendIcon aria-hidden="true" className="size-3.5" />;
              })()}
              {trend.value}
            </span>
            <span>{trend.label}</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
