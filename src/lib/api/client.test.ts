import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApiClient } from '@/lib/api/client';

const getSession = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => ({ auth: { getSession } }),
}));

afterEach(() => vi.unstubAllGlobals());

describe('same-origin API client', () => {
  it('rejects absolute browser API origins', () => {
    expect(() => createApiClient('https://backend.example.com')).toThrow(
      'same-origin path',
    );
    expect(() => createApiClient('//backend.example.com')).toThrow(
      'same-origin path',
    );
  });

  it('calls the Next.js API boundary with same-origin credentials', async () => {
    getSession.mockResolvedValue({
      data: { session: { access_token: 'test-access-token' } },
      error: null,
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ users: 12 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(createApiClient().request('/users')).resolves.toEqual({
      users: 12,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        credentials: 'same-origin',
        headers: expect.objectContaining({
          get: expect.any(Function),
        }),
      }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get('authorization')).toBe('Bearer test-access-token');
  });

  it('does not make a request without a Supabase session', async () => {
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(createApiClient().request('/users')).rejects.toThrow(
      'You must be signed in',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
