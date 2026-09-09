import { describe, expect, it } from 'vitest';

import {
  MockFeeService,
  PaymentValidationError,
} from '@/features/fees/services';

describe('MockFeeService', () => {
  it('summarizes active invoices and exposes all required statuses', async () => {
    const service = new MockFeeService(0);
    const overview = await service.getOverview('all');
    const invoices = await service.listInvoices({ campusId: 'all' });
    expect(overview.metrics.totalFees).toBeGreaterThan(
      overview.metrics.collected,
    );
    expect(overview.metrics.pending).toBeGreaterThan(0);
    expect(overview.metrics.overdue).toBeGreaterThan(0);
    expect(new Set(invoices.map((invoice) => invoice.status))).toEqual(
      new Set(['paid', 'pending', 'partial', 'overdue', 'cancelled']),
    );
  });

  it('filters invoices and returns only overdue defaulters', async () => {
    const service = new MockFeeService(0);
    const filtered = await service.listInvoices({
      campusId: 'all',
      status: 'partial',
      search: 'INV-2026',
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((invoice) => invoice.status === 'partial')).toBe(
      true,
    );
    const defaulters = await service.listDefaulters('all');
    expect(defaulters.every((invoice) => invoice.status === 'overdue')).toBe(
      true,
    );
  });

  it('records partial and final payments into shared invoice state', async () => {
    const service = new MockFeeService(0);
    const [invoice] = await service.listInvoices({
      campusId: 'all',
      status: 'pending',
    });
    const partial = await service.recordPayment({
      invoiceId: invoice.id,
      amount: 5000,
      method: 'bank_transfer',
      date: '2026-09-07',
      reference: 'BANK-1001',
    });
    expect(partial.invoice.status).toBe('partial');
    const final = await service.recordPayment({
      invoiceId: invoice.id,
      amount: partial.invoice.balance,
      method: 'cash',
      date: '2026-09-07',
      reference: 'CASH-1002',
    });
    expect(final.invoice.status).toBe('paid');
    expect(final.invoice.balance).toBe(0);
    expect((await service.listPayments('all'))[0].reference).toBe('CASH-1002');
  });

  it('rejects invalid, excessive, and missing-reference payments', async () => {
    const service = new MockFeeService(0);
    const [invoice] = await service.listInvoices({
      campusId: 'all',
      status: 'pending',
    });
    await expect(
      service.recordPayment({
        invoiceId: invoice.id,
        amount: invoice.balance + 1,
        method: 'cash',
        date: '2026-09-07',
        reference: '',
      }),
    ).rejects.toBeInstanceOf(PaymentValidationError);
  });
});
