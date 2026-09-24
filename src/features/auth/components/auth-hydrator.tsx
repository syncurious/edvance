'use client';

import { useEffect } from 'react';

import { readAuthSession, saveAuthSession } from '@/features/auth/auth-storage';
import { httpAuthService } from '@/features/auth/services/http-auth-service';
import { useAppDispatch } from '@/store/hooks';
import { authHydrated } from '@/store/slices/auth-slice';

export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const session = readAuthSession();
    if (!session) { dispatch(authHydrated(null)); return; }
    void httpAuthService.refresh().then((renewed) => {
      saveAuthSession(renewed, window.localStorage.getItem('edvance.auth.session') !== null);
      dispatch(authHydrated(renewed));
    }).catch(() => dispatch(authHydrated(null)));
  }, [dispatch]);

  return null;
}
