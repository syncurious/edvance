import type {
  FeeLineItem,
  FeeStatus,
  FeeStructure,
  Invoice,
  Payment,
  PaymentMethod,
} from '@/features/fees/types';
import { studentMocks } from '@/mocks/students';

const tuitionItems: FeeLineItem[] = [
  { id: 'tuition', label: 'Tuition fee', amount: 22000 },
  { id: 'technology', label: 'Technology and lab', amount: 3500 },
  { id: 'activities', label: 'Student activities', amount: 3000 },
];

export const feeStructureMocks: FeeStructure[] = [
  ['fs-5', 'Middle school standard', 'Grade 5', 'north', 'monthly', 1],
  ['fs-6', 'Middle school standard', 'Grade 6', 'central', 'monthly', 1],
  ['fs-7', 'Middle school plus', 'Grade 7', 'south', 'monthly', 1.08],
  ['fs-8', 'Secondary standard', 'Grade 8', 'north', 'monthly', 1.12],
  ['fs-9', 'Board preparation', 'Grade 9', 'central', 'term', 3.25],
  ['fs-10', 'Board preparation', 'Grade 10', 'south', 'term', 3.4],
].map(([id, name, className, campusId, frequency, multiplier]) => {
  const lineItems = tuitionItems.map((item) => ({
    ...item,
    id: `${id}-${item.id}`,
    amount: Math.round(item.amount * Number(multiplier)),
  }));
  return {
    id: String(id),
    name: String(name),
    className: className as FeeStructure['className'],
    campusId: campusId as FeeStructure['campusId'],
    frequency: frequency as FeeStructure['frequency'],
    lineItems,
    total: lineItems.reduce((sum, item) => sum + item.amount, 0),
    active: true,
  };
});

const statusSequence: FeeStatus[] = [
  'paid',
  'pending',
  'partial',
  'overdue',
  'paid',
  'overdue',
  'cancelled',
  'partial',
  'pending',
  'paid',
  'overdue',
  'partial',
];

export const invoiceMocks: Invoice[] = studentMocks
  .slice(0, 12)
  .map((student, index) => {
    const status = statusSequence[index];
    const classResources = (index % 3) * 1750;
    const lineItems = classResources
      ? [
          ...tuitionItems,
          {
            id: `class-resources-${index + 1}`,
            label: 'Class resources',
            amount: classResources,
          },
        ]
      : tuitionItems;
    const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const amountPaid =
      status === 'paid'
        ? total
        : status === 'partial'
          ? Math.round(total * 0.52)
          : 0;
    return {
      id: `invoice-${index + 1}`,
      number: `INV-2026-09-${String(index + 1).padStart(3, '0')}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      className: `${student.className} · ${student.section}`,
      campusId: student.campusId,
      campusName: student.campusName,
      parentName: student.parent.name,
      parentPhone: student.parent.phone,
      issuedDate: `2026-09-${String((index % 5) + 1).padStart(2, '0')}`,
      dueDate: `2026-09-${String((index % 8) + 8).padStart(2, '0')}`,
      status,
      lineItems,
      total,
      amountPaid,
      balance: status === 'cancelled' ? 0 : total - amountPaid,
    };
  });

const methodSequence: PaymentMethod[] = [
  'bank_transfer',
  'cash',
  'card',
  'mobile_wallet',
];

export const paymentMocks: Payment[] = invoiceMocks
  .filter((invoice) => invoice.amountPaid > 0)
  .map((invoice, index) => ({
    id: `payment-${index + 1}`,
    receiptNumber: `RCP-2026-${String(index + 1).padStart(4, '0')}`,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    studentName: invoice.studentName,
    campusId: invoice.campusId,
    amount: invoice.amountPaid,
    method: methodSequence[index % methodSequence.length],
    date: `2026-09-${String(index + 2).padStart(2, '0')}`,
    reference: `TXN-${82040 + index * 317}`,
  }));
