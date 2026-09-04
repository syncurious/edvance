import { ArrowUpRight, CalendarDays, Plus, Sparkles } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminRole } from '@/types/navigation';

const dashboardContent = {
  'super-admin': {
    eyebrow: 'Platform workspace',
    title: 'Good afternoon, Areeb.',
    description:
      'Your reusable shell is ready for platform-level metrics, school activity, and revenue insights.',
    action: 'Add school',
    stats: [
      { label: 'Active schools', value: '147', note: '+8 this month' },
      { label: 'Students', value: '82,450', note: 'Across all schools' },
      { label: 'Monthly revenue', value: 'Rs 4.2M', note: 'Preview data' },
    ],
  },
  'school-admin': {
    eyebrow: 'North Campus',
    title: 'Good afternoon, Sara.',
    description:
      'The daily school workspace is ready for attendance, students, fees, and academic operations.',
    action: 'Add student',
    stats: [
      { label: 'Students', value: '2,450', note: 'North Campus' },
      { label: 'Attendance', value: '94%', note: 'Today · 2,303 present' },
      { label: 'Fees collected', value: 'Rs 8.4M', note: 'Current term' },
    ],
  },
} as const;

export function DashboardPreview({ adminRole }: { adminRole: AdminRole }) {
  const content = dashboardContent[adminRole];

  return (
    <div className="grid gap-7">
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        actions={
          <>
            <Button variant="outline">
              <CalendarDays data-icon="inline-start" /> 03 Sep 2026
            </Button>
            <Button>
              <Plus data-icon="inline-start" /> {content.action}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {content.stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-black tracking-tight sm:text-3xl">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status="success">{stat.note}</StatusBadge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="min-h-80">
          <CardHeader>
            <CardTitle>Dashboard foundation</CardTitle>
            <CardDescription>
              The reusable chart and activity modules arrive on Day 5.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid flex-1 place-items-center">
            <div className="w-full max-w-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Workspace readiness
                  </p>
                  <p className="mt-1 text-xl font-black">Shell complete</p>
                </div>
                <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Sparkles aria-hidden="true" className="size-5" />
                </span>
              </div>
              <div
                className="grid grid-cols-8 items-end gap-2"
                aria-label="Chart placeholder"
              >
                {[38, 52, 44, 68, 59, 76, 71, 88].map((height, index) => (
                  <div
                    key={index}
                    className="flex h-32 items-end rounded-md bg-muted"
                  >
                    <span
                      className="w-full rounded-md bg-primary/75"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Structure preview</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="grid flex-1 gap-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground/50"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
