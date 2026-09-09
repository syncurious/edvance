import type { CampusId } from '@/features/dashboard/types';
import type {
  FeeOverview,
  FeeStructure,
  Invoice,
  InvoiceQuery,
  Payment,
  RecordPaymentInput,
  RecordPaymentResult,
} from '@/features/fees/types';

export interface FeeService {
  getOverview(campusId: CampusId): Promise<FeeOverview>;
  listStructures(campusId: CampusId): Promise<FeeStructure[]>;
  listInvoices(query: InvoiceQuery): Promise<Invoice[]>;
  listPayments(campusId: CampusId): Promise<Payment[]>;
  listDefaulters(campusId: CampusId): Promise<Invoice[]>;
  recordPayment(input: RecordPaymentInput): Promise<RecordPaymentResult>;
}
