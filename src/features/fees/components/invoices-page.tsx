'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Banknote, RotateCcw, Search } from 'lucide-react';
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
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { FinanceNav } from '@/features/fees/components/finance-nav';
import { InvoiceTable } from '@/features/fees/components/finance-tables';
import { InvoicePaymentDrawer } from '@/features/fees/components/invoice-payment-drawer';
import { feeService } from '@/features/fees/services';
import type { FeeService } from '@/features/fees/services';
import { feeStatuses } from '@/features/fees/types';
import type { FeeStatus, Invoice } from '@/features/fees/types';
import { feeStatusLabels } from '@/features/fees/components/fee-status';
import { studentClasses } from '@/features/students/types';
import type { StudentClass } from '@/features/students/types';
import { ROUTES } from '@/constants/routes';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

export function InvoicesPage({
  service = feeService,
}: {
  service?: FeeService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FeeStatus | 'all'>('all');
  const [className, setClassName] = useState<StudentClass | 'all'>('all');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .listInvoices({ campusId, search, status, className })
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
  }, [campusId, className, search, service, status, version]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setSearch(searchInput);
  }
  function reset() {
    setSearchInput('');
    setSearch('');
    setStatus('all');
    setClassName('all');
  }

  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="Receivables"
        title="Invoices"
        description="Search student invoices, review line items, and record payments with confirmation."
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={ROUTES.schoolAdmin.feePayments} />}
          >
            <Banknote /> Payment history
          </Button>
        }
      />
      <FinanceNav />
      <Card>
        <CardHeader>
          <CardTitle>Find invoices</CardTitle>
          <CardDescription>
            Results stay scoped to the selected campus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <search>
            <form
              className="grid gap-3 lg:grid-cols-[minmax(15rem,1fr)_12rem_12rem_auto] lg:items-end"
              onSubmit={submitSearch}
            >
              <div className="grid gap-2">
                <Label htmlFor="invoice-search">Search</Label>
                <div className="flex gap-2">
                  <Input
                    id="invoice-search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Invoice number or student"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    aria-label="Search invoices"
                  >
                    <Search />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice-status">Status</Label>
                <NativeSelect
                  id="invoice-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as FeeStatus | 'all')
                  }
                >
                  <NativeSelectOption value="all">
                    All statuses
                  </NativeSelectOption>
                  {feeStatuses.map((item) => (
                    <NativeSelectOption key={item} value={item}>
                      {feeStatusLabels[item]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice-class">Class</Label>
                <NativeSelect
                  id="invoice-class"
                  value={className}
                  onChange={(event) =>
                    setClassName(event.target.value as StudentClass | 'all')
                  }
                >
                  <NativeSelectOption value="all">
                    All classes
                  </NativeSelectOption>
                  {studentClasses.map((item) => (
                    <NativeSelectOption key={item} value={item}>
                      {item}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                disabled={!search && status === 'all' && className === 'all'}
              >
                <RotateCcw /> Reset
              </Button>
            </form>
          </search>
        </CardContent>
      </Card>
      {state === 'error' ? (
        <DashboardErrorState
          message="Invoices could not be loaded."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : state === 'ready' && invoices.length === 0 ? (
        <DashboardEmptyState
          title="No invoices found"
          description="Try clearing the search or changing the filters."
          action={
            <Button variant="outline" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Invoice register</CardTitle>
            <CardDescription>
              {state === 'loading'
                ? 'Loading invoices…'
                : `${invoices.length} invoices match these filters.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceTable
              invoices={invoices}
              loading={state === 'loading'}
              onOpen={setSelectedInvoice}
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
