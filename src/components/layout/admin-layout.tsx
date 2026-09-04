'use client';

import { useState } from 'react';

import { AdminBreadcrumbs } from '@/components/layout/admin-breadcrumbs';
import { AdminHeader } from '@/components/layout/admin-header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { schoolAdminConfig, superAdminConfig } from '@/constants/navigation';
import { cn } from '@/lib/utils';
import type { AdminRole } from '@/types/navigation';

interface AdminLayoutProps {
  adminRole: AdminRole;
  children: React.ReactNode;
}

export function AdminLayout({ adminRole, children }: AdminLayoutProps) {
  const config =
    adminRole === 'super-admin' ? superAdminConfig : schoolAdminConfig;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/35 text-foreground">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border transition-[width] duration-200 lg:block',
          collapsed ? 'w-20' : 'w-64',
        )}
      >
        <AdminSidebar
          config={config}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
      </aside>

      <div
        className={cn(
          'min-h-screen transition-[padding] duration-200',
          collapsed ? 'lg:pl-20' : 'lg:pl-64',
        )}
      >
        <AdminHeader
          config={config}
          onOpenNavigation={() => setMobileOpen(true)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8"
        >
          <div className="mx-auto w-full max-w-[1440px]">
            <AdminBreadcrumbs config={config} />
            <div className="mt-5">{children}</div>
          </div>
        </main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[min(88vw,320px)] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{config.roleLabel} navigation</SheetTitle>
            <SheetDescription>Navigate the Edvance workspace.</SheetDescription>
          </SheetHeader>
          <AdminSidebar
            config={config}
            mobile
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
