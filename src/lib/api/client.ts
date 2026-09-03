export interface ApiClient {
  request<T>(path: string, init?: RequestInit): Promise<T>;
}

export function createApiClient(baseUrl: string): ApiClient {
  return {
    async request<T>(path: string, init?: RequestInit): Promise<T> {
      const headers = new Headers(init?.headers);
      headers.set('content-type', 'application/json');

      const response = await fetch(new URL(path, baseUrl), {
        ...init,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return response.json() as Promise<T>;
    },
  };
}
