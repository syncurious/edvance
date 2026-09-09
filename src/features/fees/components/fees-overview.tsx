'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, FileWarning, Landmark, ReceiptText } from 'lucide-react';
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
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { FinanceNav } from '@/features/fees/components/finance-nav';
import { FeeSummary } from '@/features/fees/components/fee-summary';
import { InvoicePaymentDrawer } from '@/features/fees/components/invoice-payment-drawer';
import {
  InvoiceTable,
  PaymentsTable,
} from '@/features/fees/components/finance-tables';
import { feeService } from '@/features/fees/services';
import type { FeeService } from '@/features/fees/services';
import type { FeeOverview, Invoice } from '@/features/fees/types';
import { ROUTES } from '@/constants/routes';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

export function FeesOverview({
  service = feeService,
}: {
  service?: FeeService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [overview, setOverview] = useState<FeeOverview | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .getOverview(campusId)
      .then((data) => {
        if (active) {
          setOverview(data);
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
        eyebrow="School finance"
        title="Fees overview"
        description="Monitor billing, collections, overdue balances, and recent transactions for the selected campus."
        actions={
          <Button
            nativeButton={false}
            render={<Link href={ROUTES.schoolAdmin.feeInvoices} />}
          >
            <ReceiptText /> Review invoices
          </Button>
        }
      />
      <FinanceNav />
      <FeeSummary
        metrics={overview?.metrics}
        state={state === 'error' ? 'error' : state}
      />
      {state === 'error' ? (
        <DashboardErrorState
          message="The fee overview could not be loaded."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : state === 'ready' && !overview ? (
        <DashboardEmptyState
          title="No fee data"
          description="Fee activity will appear after structures and invoices are created."
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Collection progress</CardTitle>
              <CardDescription>
                Collected value across active invoices in this workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={overview?.collectionRate ?? 0}
                aria-label="Fee collection progress"
              >
                <ProgressLabel>Collection rate</ProgressLabel>
                <ProgressValue>
                  {() => `${overview?.collectionRate ?? 0}%`}
                </ProgressValue>
              </Progress>
            </CardContent>
          </Card>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              [
                'Fee structures',
                'Review class-wise billing plans.',
                ROUTES.schoolAdmin.feeStructures,
                Landmark,
              ],
              [
                'Record payment',
                'Open an invoice and safely record a receipt.',
                ROUTES.schoolAdmin.feeInvoices,
                ReceiptText,
              ],
              [
                'Follow up',
                'Contact guardians with overdue balances.',
                ROUTES.schoolAdmin.feeDefaulters,
                FileWarning,
              ],
            ].map(([title, description, href, Icon]) => (
              <Card key={String(title)}>
                <CardContent className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-bold">{String(title)}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {String(description)}
                    </p>
                    <Button
                      className="mt-3"
                      size="sm"
                      variant="ghost"
                      nativeButton={false}
                      render={<Link href={String(href)} />}
                    >
                      Open <ArrowRight />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Recent invoices</CardTitle>
              <CardDescription>
                Latest issued invoices and their current balances.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceTable
                invoices={overview?.recentInvoices ?? []}
                loading={state === 'loading'}
                onOpen={setSelectedInvoice}
              />
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Recent payments</CardTitle>
              <CardDescription>
                Latest receipts recorded across the selected campus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsTable
                payments={overview?.recentPayments ?? []}
                loading={state === 'loading'}
              />
            </CardContent>
          </Card>
        </>
      )}
      <InvoicePaymentDrawer
        invoice={selectedInvoice}
        open={Boolean(selectedInvoice)}
        onOpenChange={(open) => {
          if (!open) setSelectedInvoice(null);
        }}
        onPaymentRecorded={(invoice) => {
          setSelectedInvoice(invoice);
          setVersion((value) => value + 1);
        }}
        service={service}
      />
    </div>
  );
}
