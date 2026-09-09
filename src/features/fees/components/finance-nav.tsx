'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

const items = [
  ['Overview', ROUTES.schoolAdmin.fees],
  ['Structures', ROUTES.schoolAdmin.feeStructures],
  ['Invoices', ROUTES.schoolAdmin.feeInvoices],
  ['Payments', ROUTES.schoolAdmin.feePayments],
  ['Defaulters', ROUTES.schoolAdmin.feeDefaulters],
] as const;

export function FinanceNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Finance sections"
      className="max-w-full overflow-x-auto pb-1"
    >
      <div className="flex w-max gap-2">
        {items.map(([label, href]) => (
          <Button
            key={href}
            size="sm"
            variant={pathname === href ? 'default' : 'outline'}
            nativeButton={false}
            render={<Link href={href} />}
          >
            {label}
          </Button>
        ))}
      </div>
    </nav>
  );
}
