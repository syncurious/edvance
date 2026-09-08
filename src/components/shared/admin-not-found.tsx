import { ArrowLeft, SearchX } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AdminNotFound({
  workspace,
}: {
  workspace: 'super-admin' | 'school-admin';
}) {
  const platform = workspace === 'super-admin';
  const home = platform ? '/super-admin/dashboard' : '/school-admin/dashboard';

  return (
    <div className="grid gap-7">
      <PageHeader
        eyebrow="Page not found"
        title="This route does not exist"
        description="The address may be outdated or you may not have a module at this location."
      />
      <Card>
        <CardContent className="grid min-h-80 place-items-center p-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
              <SearchX aria-hidden="true" className="size-6" />
            </span>
            <h2 className="mt-5 text-xl font-black tracking-tight">
              Return to a known workspace
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the navigation or return to the{' '}
              {platform ? 'platform' : 'school'} dashboard.
            </p>
            <Button
              className="mt-6"
              nativeButton={false}
              render={<Link href={home} />}
            >
              <ArrowLeft /> Back to dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
