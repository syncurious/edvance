import { cva, type VariantProps } from 'class-variance-authority';
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleX,
  Info,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
  {
    variants: {
      status: {
        neutral: 'border-border bg-muted text-muted-foreground',
        info: 'border-info-foreground/15 bg-info text-info-foreground',
        success:
          'border-success-foreground/15 bg-success text-success-foreground',
        warning:
          'border-warning-foreground/15 bg-warning text-warning-foreground',
        error:
          'border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20',
      },
    },
    defaultVariants: {
      status: 'neutral',
    },
  },
);

const statusIcons = {
  neutral: CircleDashed,
  info: Info,
  success: CircleCheck,
  warning: CircleAlert,
  error: CircleX,
} as const;

interface StatusBadgeProps
  extends
    React.ComponentProps<'span'>,
    VariantProps<typeof statusBadgeVariants> {}

export function StatusBadge({
  className,
  status = 'neutral',
  children,
  ...props
}: StatusBadgeProps) {
  const Icon = statusIcons[status ?? 'neutral'];

  return (
    <span
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {children}
    </span>
  );
}

export { statusBadgeVariants };
