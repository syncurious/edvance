import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApiClient } from '@/lib/api/client';

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
      expect.objectContaining({ credentials: 'same-origin' }),
    );
  });
});
