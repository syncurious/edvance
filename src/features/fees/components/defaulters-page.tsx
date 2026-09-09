'use client';

import { useEffect, useMemo, useState } from 'react';
import { Phone, TriangleAlert } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FinanceNav } from '@/features/fees/components/finance-nav';
import { InvoiceTable } from '@/features/fees/components/finance-tables';
import { InvoicePaymentDrawer } from '@/features/fees/components/invoice-payment-drawer';
import { formatCurrency } from '@/features/fees/format';
import { feeService } from '@/features/fees/services';
import type { FeeService } from '@/features/fees/services';
import type { Invoice } from '@/features/fees/types';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

export function DefaultersPage({
  service = feeService,
}: {
  service?: FeeService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .listDefaulters(campusId)
      .then((data) => {
        if (active) {
          setInvoices(data);
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
  const overdueTotal = useMemo(
    () => invoices.reduce((sum, invoice) => sum + invoice.balance, 0),
    [invoices],
  );
  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="Receivables follow-up"
        title="Defaulters"
        description="Prioritize overdue invoices with guardian contact information and accurate balances."
      />
      <FinanceNav />
      <section
        aria-label="Defaulter summary"
        className="grid gap-4 sm:grid-cols-2"
      >
        <Card>
          <CardContent className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <TriangleAlert />
            </span>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Overdue invoices
              </p>
              <p className="text-2xl font-semibold">
                {state === 'loading' ? '—' : invoices.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-warning text-warning-foreground">
              <Phone />
            </span>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Outstanding overdue
              </p>
              <p className="text-2xl font-semibold">
                {state === 'loading' ? '—' : formatCurrency(overdueTotal)}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
      {state === 'error' ? (
        <DashboardErrorState
          message="The defaulter list could not be loaded."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : state === 'ready' && invoices.length === 0 ? (
        <DashboardEmptyState
          title="No overdue balances"
          description="All active invoices for this campus are within terms."
        />
      ) : (
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Overdue accounts</CardTitle>
            <CardDescription>
              Open an invoice to review charges or record a confirmed payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceTable
              invoices={invoices}
              loading={state === 'loading'}
              onOpen={setSelectedInvoice}
              showContact
            />
          </CardContent>
        </Card>
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
