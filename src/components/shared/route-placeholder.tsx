import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';

interface RoutePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  plannedFor: string;
}

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  plannedFor,
}: RoutePlaceholderProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12 text-foreground">
      <section className="w-full max-w-2xl rounded-3xl border border-border bg-card p-7 shadow-[0_24px_70px_-48px_oklch(0.2_0.08_255)] sm:p-10">
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
          <Construction aria-hidden="true" className="size-5" />
        </span>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">
            Full experience planned for {plannedFor}
          </p>
          <Link
            href={ROUTES.home}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Back to
            foundation
          </Link>
        </div>
      </section>
    </main>
  );
}
