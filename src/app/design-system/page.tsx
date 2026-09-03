import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { DesignSystemShowcase } from '@/features/design-system/components/design-system-showcase';

export const metadata: Metadata = {
  title: 'Design System',
  description: 'The reusable interface foundations for Edvance.',
};

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="grid gap-8 pb-12 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-10 lg:pb-16">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-lg py-2 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Foundation
          </Link>
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Edvance interface system · Day 2
            </p>
            <h1 className="mt-4 text-balance text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              Reusable by design. Predictable in every state.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              Shared foundations for dense school workflows—clear actions,
              accessible input, consistent status, and feedback that never
              leaves users guessing.
            </p>
          </div>
        </header>

        <DesignSystemShowcase />
      </div>
    </main>
  );
}
