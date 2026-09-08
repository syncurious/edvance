import { afterEach, describe, expect, it, vi } from 'vitest';

import { proxyToBackend } from '@/lib/api/backend-proxy';

const originalBackendUrl = process.env.EDVANCE_BACKEND_URL;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalBackendUrl === undefined) {
    delete process.env.EDVANCE_BACKEND_URL;
  } else {
    process.env.EDVANCE_BACKEND_URL = originalBackendUrl;
  }
});

describe('backend API proxy', () => {
  it('returns a safe unavailable response until the server-only origin is configured', async () => {
    delete process.env.EDVANCE_BACKEND_URL;

    const response = await proxyToBackend(
      new Request('http://localhost/api/students'),
      ['students'],
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      code: 'API_NOT_CONFIGURED',
      message: 'The backend integration is not configured yet.',
    });
  });

  it('forwards method, path, query, selected headers, and body without exposing the origin', async () => {
    process.env.EDVANCE_BACKEND_URL = 'https://nest.internal/v1';
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json(
          { id: 'student-1' },
          { headers: { 'cache-control': 'private, no-store' } },
        ),
      );
    vi.stubGlobal('fetch', fetchMock);

    const response = await proxyToBackend(
      new Request('http://localhost/api/students?campusId=north', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          cookie: 'session=opaque',
          host: 'localhost',
          'x-request-id': 'request-15',
        },
        body: JSON.stringify({ firstName: 'Noor' }),
      }),
      ['students'],
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe(
      'https://nest.internal/v1/students?campusId=north',
    );
    expect(init).toEqual(
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        redirect: 'manual',
      }),
    );
    expect(new Headers(init.headers).get('cookie')).toBe('session=opaque');
    expect(new Headers(init.headers).has('host')).toBe(false);
    expect(new TextDecoder().decode(init.body as ArrayBuffer)).toBe(
      JSON.stringify({ firstName: 'Noor' }),
    );
    expect(response.headers.get('x-request-id')).toBe('request-15');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });

  it('normalizes invalid configuration and upstream failures', async () => {
    process.env.EDVANCE_BACKEND_URL = 'file:///private/backend';
    const configurationResponse = await proxyToBackend(
      new Request('http://localhost/api/reports'),
      ['reports'],
    );
    expect(configurationResponse.status).toBe(500);

    process.env.EDVANCE_BACKEND_URL = 'https://nest.internal';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('private error')),
    );
    const unavailableResponse = await proxyToBackend(
      new Request('http://localhost/api/reports'),
      ['reports'],
    );
    expect(unavailableResponse.status).toBe(502);
    await expect(unavailableResponse.json()).resolves.toEqual({
      code: 'API_UNAVAILABLE',
      message: 'The backend is currently unavailable.',
    });
  });
});
