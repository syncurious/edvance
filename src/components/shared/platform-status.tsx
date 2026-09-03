'use client';

import { CircleCheck } from 'lucide-react';

import { useAppSelector } from '@/store/hooks';

export function PlatformStatus({ label }: { label: string }) {
  const environment = useAppSelector((state) => state.app.environment);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-sm">
      <CircleCheck aria-hidden="true" className="size-3.5 text-emerald-600" />
      <span className="hidden sm:inline">{label} · </span>
      <span className="capitalize text-muted-foreground">
        {environment} data
      </span>
    </span>
  );
}
