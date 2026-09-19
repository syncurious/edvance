import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export interface ApiClient {
  request<T>(path: string, init?: RequestInit): Promise<T>;
}

export function createApiClient(basePath = '/api'): ApiClient {
  if (!basePath.startsWith('/') || basePath.startsWith('//')) {
    throw new Error('Browser API clients must use a same-origin path.');
  }

  return {
    async request<T>(path: string, init?: RequestInit): Promise<T> {
      const { data, error } =
        await getSupabaseBrowserClient().auth.getSession();
      if (error || !data.session) {
        throw new Error('You must be signed in to make this request.');
      }

      const headers = new Headers(init?.headers);
      headers.set('content-type', 'application/json');
      headers.set('authorization', `Bearer ${data.session.access_token}`);

      const response = await fetch(
        `${basePath.replace(/\/$/, '')}/${path.replace(/^\//, '')}`,
        {
          credentials: 'same-origin',
          ...init,
          headers,
        },
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      if (response.status === 204) return undefined as T;

      return response.json() as Promise<T>;
    },
  };
}

export const apiClient = createApiClient();
