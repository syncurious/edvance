'use client';

import { useEffect } from 'react';

import { readAuthSession } from '@/features/auth/auth-storage';
import { useAppDispatch } from '@/store/hooks';
import { authHydrated } from '@/store/slices/auth-slice';

export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authHydrated(readAuthSession()));
  }, [dispatch]);

  return null;
}
