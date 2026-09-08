# Next.js API boundary

Browser features call same-origin `/api/...` endpoints through `src/lib/api/client.ts`.

The catch-all handler in this folder now:

1. Read the backend origin from a server-only environment variable.
2. Forward an explicit allowlist of request headers to NestJS.
3. Preserve method, path, query, and request body.
4. Normalize missing configuration, timeout, and upstream connection failures.

Never expose the backend URL through a `NEXT_PUBLIC_*` variable or import it into client components. Hiding the origin is not an authorization boundary: NestJS must still validate authentication, roles, permissions, and tenant access for every request.

See `docs/API_CONTRACTS.md` for the endpoint inventory, session assumptions, error contract, and RTK Query migration sequence.
