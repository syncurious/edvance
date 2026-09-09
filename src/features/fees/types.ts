import type { CampusId } from '@/features/dashboard/types';
import type { StudentClass } from '@/features/students/types';

export const feeStatuses = [
  'paid',
  'pending',
  'partial',
  'overdue',
  'cancelled',
] as const;
export const paymentMethods = [
  'cash',
  'bank_transfer',
  'card',
  'mobile_wallet',
] as const;

export type FeeStatus = (typeof feeStatuses)[number];
export type PaymentMethod = (typeof paymentMethods)[number];

export interface FeeLineItem {
  id: string;
  label: string;
  amount: number;
}

export interface FeeStructure {
  id: string;
  name: string;
  className: StudentClass;
  campusId: Exclude<CampusId, 'all'>;
  frequency: 'monthly' | 'term';
  lineItems: FeeLineItem[];
  total: number;
  active: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  studentId: string;
  studentName: string;
  className: string;
  campusId: Exclude<CampusId, 'all'>;
  campusName: string;
  parentName: string;
  parentPhone: string;
  issuedDate: string;
  dueDate: string;
  status: FeeStatus;
  lineItems: FeeLineItem[];
  total: number;
  amountPaid: number;
  balance: number;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  studentName: string;
  campusId: Exclude<CampusId, 'all'>;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference: string;
}

export interface FeeMetrics {
  totalFees: number;
  collected: number;
  pending: number;
  overdue: number;
}

export interface FeeOverview {
  metrics: FeeMetrics;
  collectionRate: number;
  recentInvoices: Invoice[];
  recentPayments: Payment[];
}

export interface InvoiceQuery {
  campusId: CampusId;
  search?: string;
  status?: FeeStatus | 'all';
  className?: StudentClass | 'all';
}

export interface RecordPaymentInput {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference: string;
}

export interface RecordPaymentResult {
  invoice: Invoice;
  payment: Payment;
}
