import { Layers2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Brand({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="brand-mark">
        <Layers2 aria-hidden="true" className="size-5" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="text-xl font-semibold tracking-[-0.055em]">
          edvance<span className="text-primary">.</span>
        </span>
      )}
    </span>
  );
}
