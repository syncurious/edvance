import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface RouteCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  action: string;
  index: number;
}

export function RouteCard({
  eyebrow,
  title,
  description,
  href,
  icon: Icon,
  action,
  index,
}: RouteCardProps) {
  return (
    <Link
      href={href}
      aria-label={action}
      className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-[0_14px_40px_-32px_oklch(0.2_0.08_255)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_20px_50px_-32px_oklch(0.45_0.16_253)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 sm:p-6"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span>
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          0{index} · {eyebrow}
        </span>
        <span className="mt-1 block text-lg font-semibold tracking-tight">
          {title}
        </span>
        <span className="mt-1 block max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="mt-1 size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
      />
    </Link>
  );
}
