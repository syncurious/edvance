import { ArrowLeft, Check, Layers2 } from 'lucide-react';
import Link from 'next/link';

import { Brand } from '@/components/shared/brand';

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
    <main className="grid min-h-screen bg-card lg:grid-cols-[minmax(0,0.95fr)_minmax(540px,1.05fr)]">
      <section className="relative m-4 hidden flex-col overflow-hidden rounded-2xl bg-[#113f35] px-10 py-9 text-white lg:flex xl:px-14">
        <div
          aria-hidden="true"
          className="dot-pattern absolute inset-0 text-white/15 [mask-image:linear-gradient(transparent,black)]"
        />
        <Link
          href="/"
          className="relative w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Brand />
        </Link>
        <div className="relative my-auto py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#b9e9d6]">
            <Layers2 aria-hidden="true" className="size-3.5" /> A little less
            admin. A lot more impact.
          </span>
          <h2 className="mt-6 max-w-lg text-4xl font-medium leading-[1.12] tracking-[-0.045em] xl:text-5xl">
            Make room for
            <br />
            what matters.
            <br />
            <span className="text-[#9ee2c4]">Your school.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/75">
            A connected home for your people, academics, and finances.
            Everything you need for a school day well run.
          </p>
          <div className="mt-10 max-w-md rounded-xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm">
            <p className="text-xs font-medium text-white/70">
              YOUR DAY, SIMPLIFIED
            </p>
            {[
              'Know who’s here. Keep attendance in sync.',
              'Stay on top of fees and collections.',
              'Give every student a clearer path forward.',
            ].map((item) => (
              <div
                key={item}
                className="mt-4 flex items-center gap-3 text-xs leading-5 text-white/90"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#a3e2c5]/15 text-[#a3e2c5]">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/60">
          Edvance · School operations, clearly run.
        </p>
      </section>
      <section className="flex min-h-screen flex-col px-5 py-7 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden" aria-label="Edvance home">
            <Brand />
          </Link>
          <Link
            href="/"
            className="ml-auto flex items-center gap-2 rounded text-xs text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to home
          </Link>
        </div>
        <div className="mx-auto my-auto w-full max-w-[400px] py-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          A calmer way to manage your school.
        </p>
      </section>
    </main>
  );
}
