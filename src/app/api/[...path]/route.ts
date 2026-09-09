import { proxyToBackend } from '@/lib/api/backend-proxy';

type ApiRouteContext = {
  params: Promise<{ path: string[] }>;
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function handle(request: Request, context: ApiRouteContext) {
  const { path } = await context.params;
  return proxyToBackend(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
