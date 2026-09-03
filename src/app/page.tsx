import {
  ArrowRight,
  Building2,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import { PlatformStatus } from '@/components/shared/platform-status';
import { RouteCard } from '@/components/shared/route-card';
import { ROUTES } from '@/constants/routes';
import { systemService } from '@/features/system/services';

const entryPoints = [
  {
    eyebrow: 'Secure entry',
    title: 'Authentication',
    description:
      'Sign in and password recovery flows will live behind one boundary.',
    href: ROUTES.login,
    icon: ShieldCheck,
    action: 'Open login route',
  },
  {
    eyebrow: 'Platform operations',
    title: 'Super Admin',
    description:
      'Manage schools, subscriptions, users, billing, and platform health.',
    href: ROUTES.superAdmin.dashboard,
    icon: Building2,
    action: 'Open platform route',
  },
  {
    eyebrow: 'School operations',
    title: 'School Admin',
    description:
      'Run students, staff, attendance, fees, exams, and daily workflows.',
    href: ROUTES.schoolAdmin.dashboard,
    icon: GraduationCap,
    action: 'Open school route',
  },
] as const;

export default async function Home() {
  const summary = await systemService.getSummary();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-black tracking-tight text-primary-foreground">
              E
            </span>
            <div>
              <p className="text-sm font-bold tracking-tight">Edvance</p>
              <p className="text-xs text-muted-foreground">
                School operations, clearly run.
              </p>
            </div>
          </div>
          <PlatformStatus label={summary.statusLabel} />
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-16">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Frontend foundation · Day 1
            </p>
            <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              One calm workspace for every school operation.
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              The architecture is ready for two focused admin experiences and a
              clean API handoff to the NestJS backend.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6">
              <div>
                <dt className="text-xs text-muted-foreground">Route areas</dt>
                <dd className="mt-1 text-2xl font-black tracking-tight">03</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">State layer</dt>
                <dd className="mt-1 text-sm font-bold">Redux Toolkit</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Data mode</dt>
                <dd className="mt-1 text-sm font-bold">Mock-ready</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-3">
            {entryPoints.map((entry, index) => (
              <RouteCard key={entry.href} {...entry} index={index + 1} />
            ))}
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Built as reusable feature modules, not disconnected screens.</p>
          <Link
            href={ROUTES.designSystem}
            className="flex w-fit items-center gap-2 font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
          >
            View reusable design system{' '}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </footer>
      </section>
    </main>
  );
}
