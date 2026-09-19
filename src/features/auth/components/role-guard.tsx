'use client';

import { useEffect } from 'react';
import { LockKeyhole } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/store/hooks';
import { selectAuth } from '@/store/slices/auth-slice';

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, session } = useAppSelector(selectAuth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
  }, [hydrated, pathname, router, session]);

  if (!hydrated) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/35 px-5">
        <div
          className="w-full max-w-md space-y-4"
          aria-label="Restoring your session"
        >
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <LockKeyhole aria-hidden="true" />
          </div>
          <Skeleton className="mx-auto h-7 w-48" />
          <Skeleton className="h-28 w-full" />
        </div>
      </main>
    );
  }

  if (!session) return null;

  return children;
}
