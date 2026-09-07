'use client';

import { useEffect, useMemo, useState } from 'react';
import { ReceiptText, Search } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';
import { FinanceNav } from '@/features/fees/components/finance-nav';
import { PaymentsTable } from '@/features/fees/components/finance-tables';
import { feeService } from '@/features/fees/services';
import type { FeeService } from '@/features/fees/services';
import type { Payment } from '@/features/fees/types';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

export function PaymentsPage({
  service = feeService,
}: {
  service?: FeeService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .listPayments(campusId)
      .then((data) => {
        if (active) {
          setPayments(data);
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
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return payments;
    return payments.filter((payment) =>
      [
        payment.receiptNumber,
        payment.invoiceNumber,
        payment.studentName,
        payment.reference,
      ].some((value) => value.toLowerCase().includes(term)),
    );
  }, [payments, search]);
  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="Collections"
        title="Payments"
        description="Review receipts, payment methods, transaction dates, and references."
        actions={
          <Button
            nativeButton={false}
            render={<Link href={ROUTES.schoolAdmin.feeInvoices} />}
          >
            <ReceiptText /> Record a payment
          </Button>
        }
      />
      <FinanceNav />
      <Card>
        <CardContent>
          <div className="grid max-w-xl gap-2">
            <Label htmlFor="payment-search">Search payments</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="payment-search"
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Receipt, invoice, student, or reference"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {state === 'error' ? (
        <DashboardErrorState
          message="Payments could not be loaded."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : state === 'ready' && filtered.length === 0 ? (
        <DashboardEmptyState
          title="No payments found"
          description={
            search
              ? 'Try a different search.'
              : 'Recorded payments will appear here.'
          }
          action={
            search ? (
              <Button variant="outline" onClick={() => setSearch('')}>
                Clear search
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
            <CardDescription>
              {state === 'loading'
                ? 'Loading receipts…'
                : `${filtered.length} payment records.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentsTable payments={filtered} loading={state === 'loading'} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
