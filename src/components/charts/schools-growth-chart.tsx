'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { SchoolGrowthDataPoint } from '@/features/dashboard/types';

const chartConfig = {
  total: { label: 'Total schools', color: 'var(--chart-1)' },
  active: { label: 'Active schools', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function SchoolsGrowthChart({
  data,
}: {
  data: SchoolGrowthDataPoint[];
}) {
  return (
    <figure aria-label="Total and active school growth by month">
      <figcaption className="sr-only">
        Total and active school growth by month
      </figcaption>
      <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
        <AreaChart
          data={data}
          margin={{ left: -18, right: 12, top: 8 }}
          accessibilityLayer
        >
          <defs>
            <linearGradient id="total-school-fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-total)"
                stopOpacity={0.28}
              />
              <stop
                offset="95%"
                stopColor="var(--color-total)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
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
            width={38}
            domain={['dataMin - 8', 'dataMax + 4']}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--color-total)"
            fill="url(#total-school-fill)"
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="active"
            stroke="var(--color-active)"
            fill="transparent"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        </AreaChart>
      </ChartContainer>
    </figure>
  );
}
