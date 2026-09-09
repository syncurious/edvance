import {
  Banknote,
  CircleDollarSign,
  Clock3,
  TriangleAlert,
} from 'lucide-react';

import { StatCard } from '@/components/shared/stat-card';
import { formatCurrency } from '@/features/fees/format';
import type { FeeMetrics } from '@/features/fees/types';
import type { DashboardViewState } from '@/features/dashboard/types';

export function FeeSummary({
  metrics,
  state = 'ready',
}: {
  metrics?: FeeMetrics;
  state?: DashboardViewState;
}) {
  const items = [
    {
      label: 'Total fees',
      value: formatCurrency(metrics?.totalFees ?? 0),
      description: 'Issued this billing cycle',
      icon: CircleDollarSign,
      tone: 'primary' as const,
    },
    {
      label: 'Collected',
      value: formatCurrency(metrics?.collected ?? 0),
      description: 'Payments received',
      icon: Banknote,
      tone: 'success' as const,
    },
    {
      label: 'Pending',
      value: formatCurrency(metrics?.pending ?? 0),
      description: 'Outstanding balance',
      icon: Clock3,
      tone: 'info' as const,
    },
    {
      label: 'Overdue',
      value: formatCurrency(metrics?.overdue ?? 0),
      description: 'Requires follow-up',
      icon: TriangleAlert,
      tone: 'warning' as const,
    },
  ];
  return (
    <section
      aria-label="Fee summary"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item) => (
        <StatCard key={item.label} {...item} state={state} />
      ))}
    </section>
  );
}
