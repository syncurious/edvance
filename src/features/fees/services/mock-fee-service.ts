import type { CampusId } from '@/features/dashboard/types';
import type { FeeService } from '@/features/fees/services/fee-service';
import type {
  Invoice,
  InvoiceQuery,
  RecordPaymentInput,
} from '@/features/fees/types';
import { feeStructureMocks, invoiceMocks, paymentMocks } from '@/mocks/fees';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const clone = <Value>(value: Value): Value => structuredClone(value);
const inCampus = <Item extends { campusId: string }>(
  item: Item,
  campusId: CampusId,
) => campusId === 'all' || item.campusId === campusId;

export class FeeNotFoundError extends Error {
  constructor() {
    super('This invoice could not be found.');
    this.name = 'FeeNotFoundError';
  }
}

export class PaymentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentValidationError';
  }
}

export class MockFeeService implements FeeService {
  private invoices = clone(invoiceMocks);
  private payments = clone(paymentMocks);

  constructor(private readonly latency = 220) {}

  private async pause() {
    if (this.latency) await wait(this.latency);
  }

  async getOverview(campusId: CampusId) {
    await this.pause();
    const invoices = this.invoices.filter(
      (invoice) =>
        inCampus(invoice, campusId) && invoice.status !== 'cancelled',
    );
    const payments = this.payments.filter((payment) =>
      inCampus(payment, campusId),
    );
    const totalFees = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const collected = invoices.reduce(
      (sum, invoice) => sum + invoice.amountPaid,
      0,
    );
    const pending = invoices.reduce((sum, invoice) => sum + invoice.balance, 0);
    const overdue = invoices
      .filter((invoice) => invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.balance, 0);
    return clone({
      metrics: { totalFees, collected, pending, overdue },
      collectionRate: totalFees ? Math.round((collected / totalFees) * 100) : 0,
      recentInvoices: this.invoices
        .filter((invoice) => inCampus(invoice, campusId))
        .slice(0, 5),
      recentPayments: payments.slice(-5).reverse(),
    });
  }

  async listStructures(campusId: CampusId) {
    await this.pause();
    return clone(
      feeStructureMocks.filter((structure) => inCampus(structure, campusId)),
    );
  }

  async listInvoices(query: InvoiceQuery) {
    await this.pause();
    const search = query.search?.trim().toLowerCase() ?? '';
    return clone(
      this.invoices.filter(
        (invoice) =>
          inCampus(invoice, query.campusId) &&
          (!search ||
            invoice.number.toLowerCase().includes(search) ||
            invoice.studentName.toLowerCase().includes(search)) &&
          (!query.status ||
            query.status === 'all' ||
            invoice.status === query.status) &&
          (!query.className ||
            query.className === 'all' ||
            invoice.className.startsWith(query.className)),
      ),
    );
  }

  async listPayments(campusId: CampusId) {
    await this.pause();
    return clone(
      this.payments
        .filter((payment) => inCampus(payment, campusId))
        .toReversed(),
    );
  }

  async listDefaulters(campusId: CampusId) {
    await this.pause();
    return clone(
      this.invoices.filter(
        (invoice) =>
          inCampus(invoice, campusId) && invoice.status === 'overdue',
      ),
    );
  }

  async recordPayment(input: RecordPaymentInput) {
    await this.pause();
    const index = this.invoices.findIndex(
      (invoice) => invoice.id === input.invoiceId,
    );
    if (index === -1) throw new FeeNotFoundError();
    const current = this.invoices[index];
    if (current.status === 'paid' || current.status === 'cancelled')
      throw new PaymentValidationError(
        'Payments cannot be recorded for this invoice.',
      );
    if (!Number.isFinite(input.amount) || input.amount <= 0)
      throw new PaymentValidationError('Enter an amount greater than zero.');
    if (input.amount > current.balance)
      throw new PaymentValidationError(
        'The payment cannot exceed the outstanding balance.',
      );
    if (!input.date || !input.reference.trim())
      throw new PaymentValidationError(
        'Payment date and reference are required.',
      );

    const amountPaid = current.amountPaid + input.amount;
    const balance = current.total - amountPaid;
    const invoice: Invoice = {
      ...current,
      amountPaid,
      balance,
      status: balance === 0 ? 'paid' : 'partial',
    };
    const payment = {
      id: `payment-${this.payments.length + 1}`,
      receiptNumber: `RCP-2026-${String(this.payments.length + 1).padStart(4, '0')}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      studentName: invoice.studentName,
      campusId: invoice.campusId,
      amount: input.amount,
      method: input.method,
      date: input.date,
      reference: input.reference.trim(),
    };
    this.invoices[index] = invoice;
    this.payments.push(payment);
    return clone({ invoice, payment });
  }
}
