# Next.js API boundary

Browser features call same-origin `/api/...` endpoints through `src/lib/api/client.ts`.

When the NestJS integration begins, route handlers in this folder will:

1. Read the backend origin from a server-only environment variable.
2. Forward validated requests to NestJS.
3. Forward the authenticated user context using secure cookies or server-managed tokens.
4. Normalize upstream errors before returning them to browser features.

Never expose the backend URL through a `NEXT_PUBLIC_*` variable or import it into client components. Hiding the origin is not an authorization boundary: NestJS must still validate authentication, roles, permissions, and tenant access for every request.
