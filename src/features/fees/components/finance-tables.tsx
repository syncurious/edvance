import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FeeStatusBadge } from '@/features/fees/components/fee-status';
import { formatCurrency, formatPaymentMethod } from '@/features/fees/format';
import type { Invoice, Payment } from '@/features/fees/types';

export function FinanceTableSkeleton({ columns = 7 }: { columns?: number }) {
  return [0, 1, 2, 3, 4].map((row) => (
    <TableRow key={row} aria-label="Loading finance record">
      {Array.from({ length: columns }, (_, cell) => (
        <TableCell key={cell}>
          <Skeleton className="h-6 min-w-20" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function InvoiceTable({
  invoices,
  loading = false,
  onOpen,
  showContact = false,
}: {
  invoices: Invoice[];
  loading?: boolean;
  onOpen: (invoice: Invoice) => void;
  showContact?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Class</TableHead>
          {showContact ? <TableHead>Guardian</TableHead> : null}
          <TableHead>Amount</TableHead>
          <TableHead>Due date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <FinanceTableSkeleton columns={showContact ? 8 : 7} />
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-mono text-xs font-bold">
                {invoice.number}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-bold">{invoice.studentName}</p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.campusName}
                  </p>
                </div>
              </TableCell>
              <TableCell>{invoice.className}</TableCell>
              {showContact ? (
                <TableCell>
                  <div>
                    <p className="font-semibold">{invoice.parentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.parentPhone}
                    </p>
                  </div>
                </TableCell>
              ) : null}
              <TableCell>
                <div>
                  <p className="font-mono font-bold">
                    {formatCurrency(invoice.total)}
                  </p>
                  {invoice.balance > 0 && invoice.balance !== invoice.total ? (
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(invoice.balance)} due
                    </p>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell>
                <FeeStatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen(invoice)}
                  aria-label={`Open ${invoice.number}`}
                >
                  <Eye /> View
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export function PaymentsTable({
  payments,
  loading = false,
}: {
  payments: Payment[];
  loading?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Receipt</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Reference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <FinanceTableSkeleton />
        ) : (
          payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-mono text-xs font-bold">
                {payment.receiptNumber}
              </TableCell>
              <TableCell className="font-bold">{payment.studentName}</TableCell>
              <TableCell className="font-mono text-xs">
                {payment.invoiceNumber}
              </TableCell>
              <TableCell className="font-mono font-bold text-success-foreground">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell>{formatPaymentMethod(payment.method)}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell className="font-mono text-xs">
                {payment.reference}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
