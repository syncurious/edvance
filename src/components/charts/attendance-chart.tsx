'use client';

import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import type { AttendanceDataPoint } from '@/features/dashboard/types';

const chartConfig = {
  present: { label: 'Present', color: 'var(--chart-2)' },
  absent: { label: 'Absent', color: 'var(--chart-5)' },
  late: { label: 'Late', color: 'var(--chart-3)' },
  leave: { label: 'Leave', color: 'var(--chart-4)' },
} satisfies ChartConfig;

export function AttendanceChart({ data }: { data: AttendanceDataPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const present = data.find((item) => item.status === 'present')?.value ?? 0;
  const attendanceRate = total ? Math.round((present / total) * 1000) / 10 : 0;

  return (
    <div>
      <div className="relative">
        <figure
          aria-label={`Attendance distribution, ${attendanceRate}% present`}
        >
          <figcaption className="sr-only">
            Attendance distribution, {attendanceRate}% present
          </figcaption>
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-56 w-full max-w-xs aspect-auto"
          >
            <PieChart accessibilityLayer>
              <Tooltip
                formatter={(value, name) => [
                  Number(value).toLocaleString(),
                  String(name),
                ]}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={64}
                outerRadius={88}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((item) => (
                  <Cell
                    key={item.status}
                    fill={`var(--color-${item.status})`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </figure>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl font-black tracking-tight">
              {attendanceRate}%
            </p>
            <p className="text-[11px] font-semibold text-muted-foreground">
              present today
            </p>
          </div>
        </div>
      </div>
      <ul
        className="grid grid-cols-2 gap-x-4 gap-y-2"
        aria-label="Attendance totals"
      >
        {data.map((item) => (
          <li
            key={item.status}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: `var(--color-${item.status})` }}
              />
              {item.label}
            </span>
            <span className="font-bold tabular-nums">
              {item.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
