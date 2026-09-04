'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';

import { AuthHydrator } from '@/features/auth/components/auth-hydrator';
import { makeStore } from '@/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}
