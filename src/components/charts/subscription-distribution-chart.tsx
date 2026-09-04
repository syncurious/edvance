'use client';

import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import type { SubscriptionDataPoint } from '@/features/dashboard/types';

const chartConfig = {
  starter: { label: 'Starter', color: 'var(--chart-3)' },
  professional: { label: 'Professional', color: 'var(--chart-1)' },
  enterprise: { label: 'Enterprise', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function SubscriptionDistributionChart({
  data,
}: {
  data: SubscriptionDataPoint[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <div className="relative">
        <figure
          aria-label={`Subscription distribution across ${total} schools`}
        >
          <figcaption className="sr-only">
            Subscription distribution across {total} schools
          </figcaption>
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-56 w-full max-w-xs aspect-auto"
          >
            <PieChart accessibilityLayer>
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value)} schools`,
                  String(name),
                ]}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((item) => (
                  <Cell key={item.plan} fill={`var(--color-${item.plan})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </figure>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl font-black tracking-tight">{total}</p>
            <p className="text-[11px] font-semibold text-muted-foreground">
              subscriptions
            </p>
          </div>
        </div>
      </div>
      <ul className="grid gap-2" aria-label="Subscription totals">
        {data.map((item) => (
          <li
            key={item.plan}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: `var(--color-${item.plan})` }}
              />
              {item.label}
            </span>
            <span className="font-bold tabular-nums">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
