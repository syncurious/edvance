import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { DashboardFoundationShowcase } from '@/features/dashboard/components/dashboard-foundation-showcase';

export const metadata: Metadata = {
  title: 'Dashboard Foundation',
  description:
    'Reusable dashboard components and their complete presentation states.',
};

export default function DashboardFoundationPage() {
  return (
    <main className="min-h-screen bg-muted/30 text-foreground">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="grid gap-8 pb-10 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-10 lg:pb-12">
          <Link
            href="/design-system"
            className="inline-flex w-fit items-center gap-2 rounded-lg py-2 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Design system
          </Link>
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Edvance dashboard system · Day 5
            </p>
            <h1 className="mt-4 text-balance text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              One foundation for every operational dashboard.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              Configurable metrics, charts, activity, tables, shortcuts, and
              progress—with the same predictable loading, empty, error, and
              ready behavior.
            </p>
          </div>
        </header>

        <DashboardFoundationShowcase />
      </div>
    </main>
  );
}
