import {
  ArrowRight,
  Building2,
  CalendarCheck2,
  ChartNoAxesCombined,
  Check,
  GraduationCap,
  Layers2,
  WalletCards,
} from 'lucide-react';
import Link from 'next/link';

import { Brand } from '@/components/shared/brand';
import { ProductPreview } from '@/components/shared/product-preview';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: GraduationCap,
    title: 'People, brought together.',
    description:
      'Keep student profiles, staff assignments, and campus records in one organized workspace.',
  },
  {
    icon: CalendarCheck2,
    title: 'A smoother school day.',
    description:
      'Move from attendance to class schedules and exam results with a clear view of what comes next.',
  },
  {
    icon: WalletCards,
    title: 'Every payment in view.',
    description:
      'Follow fee collection, review invoices, and record payments without losing the bigger picture.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
        >
          <Link href="/" aria-label="Edvance home">
            <Brand />
          </Link>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#platform" className="hover:text-primary">
              Platform
            </a>
            <a href="#workspaces" className="hover:text-primary">
              For your team
            </a>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            className="gap-2"
          >
            Sign in <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="dot-pattern pointer-events-none absolute inset-0 -z-10 text-primary/15 [mask-image:linear-gradient(black,transparent_85%)]"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-accent px-3 py-1.5 text-[11px] font-medium text-accent-foreground">
              <Layers2 aria-hidden="true" className="size-3.5" /> THE CONNECTED
              SCHOOL WORKSPACE
            </span>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.08] tracking-[-0.065em] sm:text-6xl">
              Great schools.
              <br />
              Less busywork.
              <br />
              <span className="text-primary">More possibility.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              Bring your students, teams, and daily operations together. Edvance
              gives every school a clearer way to work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Explore the demo <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<a href="#platform" aria-label="See the platform" />}
              >
                See the platform
              </Button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Check aria-hidden="true" className="size-3.5 text-primary" /> Two
              demo workspaces. No setup required.
            </p>
          </div>
          <div className="relative min-w-0">
            <ProductPreview />
            <div className="mx-auto mt-5 flex w-fit items-center gap-2 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" /> One
              workspace. A more connected school.
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="scroll-mt-8 border-y bg-card">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Built around your school day
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
                Everything has its place.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              From the first attendance check to the final fee receipt, keep
              your team moving together.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, i) => (
              <article key={title} className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="workspaces"
        className="mx-auto grid max-w-7xl scroll-mt-8 gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
            The right view for every role
          </p>
          <h2 className="mt-3 max-w-sm text-3xl font-semibold tracking-[-0.045em]">
            One school or a whole network.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Give your team a workspace that fits their responsibilities.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'School workspace',
              icon: GraduationCap,
              description: 'Students, staff, attendance, exams, and fees.',
              href: '/school-admin/dashboard',
            },
            {
              title: 'Platform workspace',
              icon: Building2,
              description: 'Schools, subscriptions, billing, and growth.',
              href: '/super-admin/dashboard',
            },
          ].map(({ title, icon: Icon, description, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <Icon aria-hidden="true" className="size-6 text-primary" />
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
              <span className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary">
                Open workspace{' '}
                <ArrowRight
                  aria-hidden="true"
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-7 sm:px-8">
          <Brand />
          <p className="text-xs text-muted-foreground">
            School operations, clearly run.
          </p>
          <Link
            href="/design-system"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
          >
            <ChartNoAxesCombined aria-hidden="true" className="size-3.5" />{' '}
            Design system
          </Link>
        </div>
      </footer>
    </main>
  );
}
