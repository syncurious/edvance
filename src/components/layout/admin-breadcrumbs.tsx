'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getBreadcrumbs } from '@/lib/navigation';
import type { AdminShellConfig } from '@/types/navigation';

export function AdminBreadcrumbs({ config }: { config: AdminShellConfig }) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname, config.roleLabel, config.navigation);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={`${crumb.label}-${index}`}>
            <BreadcrumbItem>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {crumb.label}
                </Link>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
