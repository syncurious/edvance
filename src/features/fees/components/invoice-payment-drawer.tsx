'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Banknote, CalendarDays, Loader2, ReceiptText } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { FeeStatusBadge } from '@/features/fees/components/fee-status';
import { formatCurrency } from '@/features/fees/format';
import { feeService } from '@/features/fees/services';
import type { FeeService } from '@/features/fees/services';
import { paymentMethods } from '@/features/fees/types';
import type { Invoice, PaymentMethod } from '@/features/fees/types';

const today = '2026-09-07';

export function InvoicePaymentDrawer({
  invoice,
  open,
  onOpenChange,
  onPaymentRecorded,
  service = feeService,
}: {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentRecorded: (invoice: Invoice) => void;
  service?: FeeService;
}) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('bank_transfer');
  const [date, setDate] = useState(today);
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!invoice || !open) return;
    setAmount(invoice.balance ? String(invoice.balance) : '');
    setMethod('bank_transfer');
    setDate(today);
    setReference('');
    setErrors({});
    setConfirming(false);
  }, [invoice, open]);

  if (!invoice) return null;
  const payable = invoice.status !== 'paid' && invoice.status !== 'cancelled';

  function validate() {
    const nextErrors: Record<string, string> = {};
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0)
      nextErrors.amount = 'Enter an amount greater than zero.';
    else if (numericAmount > invoice!.balance)
      nextErrors.amount = 'Amount cannot exceed the outstanding balance.';
    if (!date) nextErrors.date = 'Payment date is required.';
    if (!reference.trim()) nextErrors.reference = 'Reference is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function requestConfirmation(event: FormEvent) {
    event.preventDefault();
    if (validate()) setConfirming(true);
  }

  async function submitPayment() {
    setSaving(true);
    try {
      const result = await service.recordPayment({
        invoiceId: invoice!.id,
        amount: Number(amount),
        method,
        date,
        reference,
      });
      onPaymentRecorded(result.invoice);
      setConfirming(false);
      toast.add({
        title: 'Payment recorded',
        description: `${result.payment.receiptNumber} was created successfully.`,
        type: 'success',
      });
    } catch (error) {
      setConfirming(false);
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : 'The payment could not be saved.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="data-[side=right]:w-full sm:data-[side=right]:max-w-xl">
          <SheetHeader className="border-b pr-12">
            <div className="flex items-center gap-2 text-primary">
              <ReceiptText className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Invoice
              </span>
            </div>
            <SheetTitle>{invoice.number}</SheetTitle>
            <SheetDescription>
              {invoice.studentName} · {invoice.className} · due{' '}
              {invoice.dueDate}
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/30 p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Balance
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatCurrency(invoice.balance)}
                </p>
              </div>
              <FeeStatusBadge status={invoice.status} />
            </div>

            <section aria-labelledby="invoice-items-title">
              <h3 id="invoice-items-title" className="mb-3 font-bold">
                Line items
              </h3>
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.label}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <dl className="mt-3 grid gap-2 text-sm">
                <div className="flex justify-between">
                  <dt>Total</dt>
                  <dd className="font-bold">{formatCurrency(invoice.total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Paid</dt>
                  <dd className="font-bold text-success-foreground">
                    {formatCurrency(invoice.amountPaid)}
                  </dd>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <dt>Outstanding</dt>
                  <dd className="font-semibold">
                    {formatCurrency(invoice.balance)}
                  </dd>
                </div>
              </dl>
            </section>

            {payable ? (
              <form
                id="payment-form"
                className="grid gap-4"
                onSubmit={requestConfirmation}
                noValidate
              >
                <div>
                  <h3 className="font-bold">Record payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Review details before the final confirmation.
                  </p>
                </div>
                {errors.form ? (
                  <p
                    role="alert"
                    className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive"
                  >
                    {errors.form}
                  </p>
                ) : null}
                <div className="grid gap-2">
                  <Label htmlFor="payment-amount">Amount</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    min="1"
                    max={invoice.balance}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    aria-invalid={Boolean(errors.amount)}
                    aria-describedby={
                      errors.amount ? 'payment-amount-error' : undefined
                    }
                  />
                  {errors.amount ? (
                    <p
                      id="payment-amount-error"
                      className="text-xs font-semibold text-destructive"
                    >
                      {errors.amount}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="payment-method">Method</Label>
                    <NativeSelect
                      id="payment-method"
                      value={method}
                      onChange={(event) =>
                        setMethod(event.target.value as PaymentMethod)
                      }
                    >
                      {paymentMethods.map((item) => (
                        <NativeSelectOption key={item} value={item}>
                          {item.split('_').join(' ')}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment-date">Payment date</Label>
                    <Input
                      id="payment-date"
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      aria-invalid={Boolean(errors.date)}
                    />
                    {errors.date ? (
                      <p className="text-xs font-semibold text-destructive">
                        {errors.date}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payment-reference">Reference</Label>
                  <Input
                    id="payment-reference"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Bank transaction or receipt reference"
                    aria-invalid={Boolean(errors.reference)}
                    aria-describedby={
                      errors.reference ? 'payment-reference-error' : undefined
                    }
                  />
                  {errors.reference ? (
                    <p
                      id="payment-reference-error"
                      className="text-xs font-semibold text-destructive"
                    >
                      {errors.reference}
                    </p>
                  ) : null}
                </div>
              </form>
            ) : (
              <p className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                This invoice is {invoice.status}; no payment can be recorded.
              </p>
            )}
          </div>
          <SheetFooter className="border-t">
            {payable ? (
              <Button form="payment-form" type="submit" disabled={saving}>
                <Banknote /> Review payment
              </Button>
            ) : null}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm this payment?</AlertDialogTitle>
            <AlertDialogDescription>
              Record {formatCurrency(Number(amount))} for {invoice.studentName}{' '}
              using reference {reference || '—'}. This updates the invoice
              balance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={submitPayment} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <CalendarDays />}
              {saving ? 'Recording…' : 'Confirm payment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
