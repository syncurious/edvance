import type { LucideIcon } from 'lucide-react';

import { DashboardErrorState } from '@/components/shared/dashboard-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <CardTitle>{title}</CardTitle>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 pt-6">{children}</CardContent>
    </Card>
  );
}

export function SettingsField({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-semibold text-destructive"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function SettingsToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5 rounded-xl border bg-muted/25 p-4">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-sm font-bold">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        className="mt-1"
      />
    </div>
  );
}

export function SettingsLoading() {
  return (
    <div className="grid gap-6" aria-label="Loading settings">
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <Skeleton className="h-10 w-full max-w-2xl" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export function SettingsError({ onRetry }: { onRetry: () => void }) {
  return (
    <DashboardErrorState
      message="Settings could not be loaded. Your existing configuration has not changed."
      onRetry={onRetry}
    />
  );
}
