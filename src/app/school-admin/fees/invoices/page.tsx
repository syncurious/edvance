import type { Metadata } from 'next';

import { InvoicesPage } from '@/features/fees/components/invoices-page';

export const metadata: Metadata = { title: 'Invoices' };

export default function FeeInvoicesPage() {
  return <InvoicesPage />;
}
