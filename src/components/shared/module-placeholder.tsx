import { ArrowRight, Construction } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export function ModulePlaceholder({
  title,
  description,
}: ModulePlaceholderProps) {
  return (
    <div className="grid gap-7">
      <PageHeader
        eyebrow="Module route"
        title={title}
        description={description}
      />
      <Card>
        <CardContent className="grid min-h-80 place-items-center p-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
              <Construction aria-hidden="true" className="size-5" />
            </span>
            <StatusBadge status="info" className="mt-5">
              Route ready
            </StatusBadge>
            <h2 className="mt-4 text-xl font-black tracking-tight">
              The shell is doing its job.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Navigation, breadcrumbs, responsive layout, and page spacing are
              active. Feature content will replace this state on its scheduled
              day.
            </p>
            <Button variant="outline" className="mt-6" disabled>
              Feature work scheduled <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
