'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { StudentGrowthDataPoint } from '@/features/dashboard/types';

const chartConfig = {
  newStudents: { label: 'New students', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function StudentGrowthChart({
  data,
}: {
  data: StudentGrowthDataPoint[];
}) {
  return (
    <figure aria-label="New student enrollments by month">
      <figcaption className="sr-only">
        New student enrollments by month
      </figcaption>
      <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto">
        <BarChart
          data={data}
          margin={{ left: -8, right: 8, top: 8 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={42} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="newStudents"
            fill="var(--color-newStudents)"
            radius={[6, 6, 2, 2]}
            maxBarSize={44}
          />
        </BarChart>
      </ChartContainer>
    </figure>
  );
}
