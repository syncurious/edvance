import { Building2 } from 'lucide-react';

import type { School } from '@/features/schools/types';
import { cn } from '@/lib/utils';

export function SchoolIdentity({
  school,
  compact = false,
  showCode = true,
}: {
  school: Pick<School, 'name' | 'code' | 'logoUrl'>;
  compact?: boolean;
  showCode?: boolean;
}) {
  return (
    <div className="flex min-w-52 items-center gap-3">
      <div
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary',
          compact ? 'size-9' : 'size-12',
        )}
      >
        {school.logoUrl ? (
          // External school logos are optional mock content; errors fall back visually to the tile.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={school.logoUrl} alt="" className="size-full object-cover" />
        ) : (
          <Building2
            aria-hidden="true"
            className={compact ? 'size-4' : 'size-5'}
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-bold">{school.name}</p>
        {showCode ? (
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {school.code}
          </p>
        ) : null}
      </div>
    </div>
  );
}
