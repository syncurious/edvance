'use client';

import { useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import {
  canAccessAudience,
  getAuthorizationSession,
  type LoginAudience,
} from '@/features/auth/authorization';
import { useAppSelector } from '@/store/hooks';
import { selectAuth } from '@/store/slices/auth-slice';

export function RoleGuard({
  children,
  audience,
}: {
  children: React.ReactNode;
  audience: LoginAudience;
}) {
  const { hydrated, session } = useAppSelector(selectAuth);
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setAuthorized(false);
    void getAuthorizationSession()
      .then((authorization) => {
        if (canAccessAudience(authorization, audience)) {
          setAuthorized(true);
          return;
        }
        router.replace(audience === 'platform' ? '/platform/login' : '/login');
      })
      .catch(() => router.replace(audience === 'platform' ? '/platform/login' : '/login'));
  }, [audience, hydrated, pathname, router, session]);

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

  if (!session || !authorized) return null;

  return children;
}
