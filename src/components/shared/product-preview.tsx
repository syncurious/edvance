import {
  ArrowUpRight,
  CalendarCheck2,
  Check,
  GraduationCap,
  LayoutDashboard,
  UsersRound,
  WalletCards,
} from 'lucide-react';

import { Brand } from '@/components/shared/brand';

const previewMetrics = [
  { label: 'Students', value: '2,418', icon: GraduationCap },
  { label: 'Attendance', value: '94.2%', icon: CalendarCheck2 },
  { label: 'Teachers', value: '128', icon: UsersRound },
];

export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_24px_70px_-30px_#0d493b40]">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <Brand />
        <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
          Sample workspace
        </span>
      </div>
      <div className="flex">
        <div
          aria-hidden="true"
          className="hidden w-14 shrink-0 flex-col items-center gap-5 border-r bg-muted/30 py-6 sm:flex"
        >
          {[
            LayoutDashboard,
            GraduationCap,
            UsersRound,
            CalendarCheck2,
            WalletCards,
          ].map((Icon, i) => (
            <span
              key={i}
              className={
                i === 0
                  ? 'rounded-lg bg-accent p-2 text-primary'
                  : 'p-2 text-muted-foreground'
              }
            >
              <Icon className="size-4" />
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1 bg-background p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground">
                CRESCENT ACADEMY
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                Your school, at a glance.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="hidden rounded-lg bg-primary px-3 py-2 text-[10px] font-medium text-primary-foreground sm:block"
            >
              School overview
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {previewMetrics.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border bg-card p-3 sm:p-4">
                <Icon aria-hidden="true" className="mb-3 size-4 text-primary" />
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-semibold tracking-tight sm:text-2xl">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1.1fr_1fr]">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs font-semibold">A clear view of growth</p>
              <div
                aria-label="Illustrative enrollment chart"
                className="mt-5 flex h-24 items-end gap-2 border-b"
              >
                {[35, 46, 40, 63, 58, 76, 88, 95].map((height, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-primary/75"
                    style={{ height: height + '%', opacity: 0.4 + i * 0.08 }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
                <span>JAN</span>
                <span>AUG</span>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs font-semibold">
                Less admin. More progress.
              </p>
              {[
                'Attendance submitted',
                'Fee collection reviewed',
                'Term results published',
              ].map((label) => (
                <div
                  key={label}
                  className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
                    <Check aria-hidden="true" className="size-3" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 flex items-center gap-1 text-[10px] text-muted-foreground">
            <ArrowUpRight aria-hidden="true" className="size-3" /> Academics,
            people, and finance. Connected.
          </p>
        </div>
      </div>
    </div>
  );
}
