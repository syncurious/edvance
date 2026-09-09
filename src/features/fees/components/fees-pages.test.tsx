import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DefaultersPage } from '@/features/fees/components/defaulters-page';
import { FeeStructures } from '@/features/fees/components/fee-structures';
import { FeesOverview } from '@/features/fees/components/fees-overview';
import { InvoicesPage } from '@/features/fees/components/invoices-page';
import { PaymentsPage } from '@/features/fees/components/payments-page';
import { MockFeeService } from '@/features/fees/services';
import type { FeeService } from '@/features/fees/services';
import { makeStore } from '@/store';

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }));

beforeEach(() => {
  vi.mocked(usePathname).mockReturnValue('/school-admin/fees');
});
afterEach(cleanup);

function renderPage(component: React.ReactNode) {
  return render(<Provider store={makeStore()}>{component}</Provider>);
}

describe('fee management pages', () => {
  it('shows all summary metrics and recent finance activity', async () => {
    renderPage(<FeesOverview service={new MockFeeService(0)} />);
    expect(await screen.findByText('Collection progress')).toBeVisible();
    for (const label of ['Total fees', 'Collected', 'Pending', 'Overdue'])
      expect(screen.getAllByText(label)[0]).toBeVisible();
    expect(screen.getByText('Recent invoices')).toBeVisible();
    expect(screen.getByText('Recent payments')).toBeVisible();
  });

  it('renders fee structures, payments, and defaulters', async () => {
    const service = new MockFeeService(0);
    const { rerender } = renderPage(<FeeStructures service={service} />);
    expect(
      (await screen.findAllByText(/Middle school standard/))[0],
    ).toBeVisible();

    rerender(
      <Provider store={makeStore()}>
        <PaymentsPage service={service} />
      </Provider>,
    );
    expect(await screen.findByText('Payment history')).toBeVisible();
    expect(
      screen.getByRole('columnheader', { name: 'Reference' }),
    ).toBeVisible();

    rerender(
      <Provider store={makeStore()}>
        <DefaultersPage service={service} />
      </Provider>,
    );
    expect(await screen.findByText('Overdue accounts')).toBeVisible();
    expect(
      screen.getByRole('columnheader', { name: 'Guardian' }),
    ).toBeVisible();
  });

  it('opens invoice details and validates before payment confirmation', async () => {
    renderPage(<InvoicesPage service={new MockFeeService(0)} />);
    expect(await screen.findByText('Invoice register')).toBeVisible();
    for (const header of [
      'Invoice',
      'Student',
      'Class',
      'Amount',
      'Due date',
      'Status',
      'Actions',
    ])
      expect(screen.getByRole('columnheader', { name: header })).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', { name: 'Open INV-2026-09-002' }),
    );
    expect(await screen.findByText('Line items')).toBeVisible();
    expect(screen.getByText('Record payment')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Review payment' }));
    expect(screen.getByText('Reference is required.')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Reference'), {
      target: { value: 'BANK-UI-9001' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Review payment' }));
    expect(await screen.findByText('Confirm this payment?')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm payment' }));
    await waitFor(() =>
      expect(screen.getAllByText('Paid').length).toBeGreaterThan(0),
    );
  });

  it('shows a recoverable loading failure', async () => {
    const failing = {
      getOverview: vi.fn().mockRejectedValue(new Error('offline')),
      listStructures: vi.fn(),
      listInvoices: vi.fn(),
      listPayments: vi.fn(),
      listDefaulters: vi.fn(),
      recordPayment: vi.fn(),
    } satisfies FeeService;
    renderPage(<FeesOverview service={failing} />);
    expect(await screen.findByText('Something went wrong')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });
});
