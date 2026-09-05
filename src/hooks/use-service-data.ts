'use client';

import { useEffect, useState } from 'react';

import type { DashboardViewState } from '@/features/dashboard/types';

export function useServiceData<Service, Data>(
  service: Service,
  request: (service: Service) => Promise<Data>,
) {
  const [data, setData] = useState<Data | null>(null);
  const [state, setState] = useState<DashboardViewState>('loading');
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState('loading');
    request(service)
      .then((result) => {
        if (!active) return;
        setData(result);
        setState('ready');
      })
      .catch(() => {
        if (!active) return;
        setData(null);
        setState('error');
      });
    return () => {
      active = false;
    };
  }, [request, requestVersion, service]);

  return {
    data,
    state,
    retry: () => setRequestVersion((version) => version + 1),
  };
}
