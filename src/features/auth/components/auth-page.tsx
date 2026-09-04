import { CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function AuthPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,0.9fr)_minmax(540px,1.1fr)]">
      <section className="relative hidden overflow-hidden bg-sidebar px-10 py-12 text-sidebar-foreground lg:flex lg:flex-col">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-sidebar-primary/15 blur-3xl" />
        <Link
          href="/"
          className="relative flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-sidebar-primary text-sm font-black text-sidebar-primary-foreground">
            E
          </span>
          <span>
            <span className="block text-base font-black tracking-tight">
              Edvance
            </span>
            <span className="block text-xs text-sidebar-foreground/60">
              School operations, clearly run.
            </span>
          </span>
        </Link>

        <div className="relative my-auto max-w-xl py-16">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sidebar-primary">
            One secure workspace
          </p>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] xl:text-5xl">
            From platform oversight to the school day.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-sidebar-foreground/68">
            Role-aware access keeps every administrator focused on the students,
            teams, and operations they are responsible for.
          </p>
          <ul className="mt-9 grid gap-4 text-sm text-sidebar-foreground/80">
            <li className="flex items-center gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="size-5 text-sidebar-primary"
              />
              Protected workspaces with clear role boundaries
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="size-5 text-sidebar-primary"
              />
              Accessible recovery and validation feedback
            </li>
          </ul>
        </div>

        <div className="relative grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-4">
            <ShieldCheck
              aria-hidden="true"
              className="size-5 text-sidebar-primary"
            />
            <p className="mt-3 text-sm font-bold">Super Admin</p>
            <p className="mt-1 text-xs text-sidebar-foreground/55">
              Platform operations
            </p>
          </div>
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-4">
            <GraduationCap
              aria-hidden="true"
              className="size-5 text-sidebar-primary"
            />
            <p className="mt-3 text-sm font-bold">School Admin</p>
            <p className="mt-1 text-xs text-sidebar-foreground/55">
              Daily school operations
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex w-fit items-center gap-2 rounded-lg text-sm font-black tracking-tight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 lg:hidden"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-xs text-primary-foreground">
              E
            </span>
            Edvance
          </Link>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
