'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Layers3 } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FinanceNav } from '@/features/fees/components/finance-nav';
import { formatCurrency } from '@/features/fees/format';
import { feeService } from '@/features/fees/services';
import type { FeeService } from '@/features/fees/services';
import type { FeeStructure } from '@/features/fees/types';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

export function FeeStructures({
  service = feeService,
}: {
  service?: FeeService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [items, setItems] = useState<FeeStructure[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .listStructures(campusId)
      .then((data) => {
        if (active) {
          setItems(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [campusId, service, version]);
  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="Fee setup"
        title="Fee structures"
        description="Review the active line items applied to each class and billing frequency."
      />
      <FinanceNav />
      {state === 'error' ? (
        <DashboardErrorState
          message="Fee structures could not be loaded."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : state === 'ready' && items.length === 0 ? (
        <DashboardEmptyState
          title="No fee structures"
          description="Structures for the selected campus will appear here."
        />
      ) : (
        <section
          aria-label="Fee structures"
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {state === 'loading'
            ? [0, 1, 2].map((item) => (
                <Card key={item}>
                  <CardContent className="grid gap-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-8 w-28" />
                  </CardContent>
                </Card>
              ))
            : items.map((structure) => (
                <Card key={structure.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Layers3 className="size-5" />
                      </span>
                      <StatusBadge
                        status={structure.active ? 'success' : 'neutral'}
                      >
                        {structure.active ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </div>
                    <CardTitle className="mt-3">
                      {structure.className}
                    </CardTitle>
                    <CardDescription>
                      {structure.name} · billed {structure.frequency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul
                      className="grid gap-2"
                      aria-label={`${structure.className} line items`}
                    >
                      {structure.lineItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="size-3.5 text-success-foreground" />
                            {item.label}
                          </span>
                          <span className="font-mono">
                            {formatCurrency(item.amount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex justify-between border-t pt-4">
                      <span className="font-bold">Total</span>
                      <span className="font-mono text-lg font-semibold">
                        {formatCurrency(structure.total)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </section>
      )}
    </div>
  );
}
