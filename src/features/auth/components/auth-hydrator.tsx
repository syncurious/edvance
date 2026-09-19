'use client';

import { useEffect } from 'react';

import { toAuthSession } from '@/features/auth/supabase-session';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAppDispatch } from '@/store/hooks';
import { authHydrated } from '@/store/slices/auth-slice';

export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      dispatch(
        authHydrated(
          error || !data.session ? null : toAuthSession(data.session),
        ),
      );
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        dispatch(authHydrated(session ? toAuthSession(session) : null));
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}
