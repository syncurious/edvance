'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { RevenueDataPoint } from '@/features/dashboard/types';

const chartConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
  target: { label: 'Target', color: 'var(--chart-2)' },
} satisfies ChartConfig;

function formatMillions(value: number) {
  return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
}

export function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
  return (
    <figure aria-label="Monthly revenue compared with target">
      <figcaption className="sr-only">
        Monthly revenue compared with target
      </figcaption>
      <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
        <LineChart
          data={data}
          margin={{ left: -8, right: 12, top: 8 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={46}
            tickFormatter={formatMillions}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="flex min-w-32 items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {name === 'revenue'
                        ? 'Revenue'
                        : name === 'target'
                          ? 'Target'
                          : String(name)}
                    </span>
                    <span className="font-mono font-bold tabular-nums">
                      Rs {formatMillions(Number(value))}
                    </span>
                  </div>
                )}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--color-target)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={3}
            dot={{ r: 3, fill: 'var(--color-revenue)' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </figure>
  );
}
