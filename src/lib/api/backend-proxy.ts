const REQUEST_HEADERS = [
  'accept',
  'authorization',
  'content-type',
  'cookie',
  'if-match',
  'if-none-match',
  'x-campus-id',
  'x-csrf-token',
  'x-request-id',
  'x-school-id',
] as const;

const RESPONSE_HEADERS = [
  'cache-control',
  'content-disposition',
  'content-type',
  'etag',
  'last-modified',
  'retry-after',
] as const;

const API_TIMEOUT_MS = 15_000;

function apiError(
  status: number,
  code: string,
  message: string,
  requestId: string,
) {
  return Response.json(
    { code, message, requestId },
    {
      status,
      headers: {
        'cache-control': 'no-store',
        'x-request-id': requestId,
      },
    },
  );
}

function backendBaseUrl() {
  const configured = process.env.EDVANCE_BACKEND_URL;
  if (!configured) return null;

  const url = new URL(configured);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('EDVANCE_BACKEND_URL must use HTTP or HTTPS.');
  }
  url.search = '';
  url.hash = '';
  return url;
}

function upstreamUrl(request: Request, path: string[], base: URL) {
  const target = new URL(base);
  const basePath = target.pathname.replace(/\/$/, '');
  const routePath = path
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  target.pathname = `${basePath}/${routePath}`;
  target.search = new URL(request.url).search;
  return target;
}

function requestHeaders(request: Request) {
  const headers = new Headers();
  for (const name of REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (!headers.has('x-request-id')) {
    headers.set('x-request-id', crypto.randomUUID());
  }
  return headers;
}

function responseHeaders(response: Response, requestId: string) {
  const headers = new Headers({ 'x-request-id': requestId });
  for (const name of RESPONSE_HEADERS) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
}

export async function proxyToBackend(request: Request, path: string[]) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  let base: URL | null;
  try {
    base = backendBaseUrl();
  } catch {
    return apiError(
      500,
      'API_CONFIGURATION_ERROR',
      'The API gateway is not configured correctly.',
      requestId,
    );
  }

  if (!base) {
    return apiError(
      503,
      'API_NOT_CONFIGURED',
      'The backend integration is not configured yet.',
      requestId,
    );
  }

  const headers = requestHeaders(request);
  headers.set('x-request-id', requestId);
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  try {
    const response = await fetch(upstreamUrl(request, path, base), {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders(response, requestId),
    });
  } catch (error) {
    const timedOut =
      error instanceof DOMException && error.name === 'TimeoutError';
    return apiError(
      timedOut ? 504 : 502,
      timedOut ? 'API_TIMEOUT' : 'API_UNAVAILABLE',
      timedOut
        ? 'The backend did not respond in time.'
        : 'The backend is currently unavailable.',
      requestId,
    );
  }
}
