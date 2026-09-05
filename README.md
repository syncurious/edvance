# Edvance Frontend

Edvance is a multi-role school administration frontend built with standard Next.js. The foundation includes three route areas, shared Redux state, a mock-first service boundary, and an intentional design baseline.

## Requirements

- Node.js 22.13 or newer
- npm

## Start locally

```bash
npm install
npm run dev
```

Open the local URL printed by the development server.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
npm run build
```

## Route areas

- `/login` — authentication entry
- `/super-admin/dashboard` — platform administration
- `/super-admin/schools` — school management
- `/super-admin/subscriptions` — plans and subscriptions
- `/super-admin/billing` — billing overview
- `/super-admin/subscriptions/usage` — platform usage
- `/super-admin/users` — platform user management
- `/school-admin/dashboard` — school administration

## Architecture

- `src/app` contains route entry points.
- `src/app/api` contains same-origin route handlers that proxy backend requests.
- `src/components` contains reusable UI, layout, and shared components.
- `src/features` owns domain models and behavior.
- `src/store` contains Redux Toolkit setup and typed hooks.
- `src/lib/api` contains the browser transport client, which defaults to relative `/api` URLs.
- `src/mocks` provides typed development data behind feature service interfaces.
- `PLAN.md` is the delivery tracker and work log.

Feature services currently use typed mock data. During NestJS integration, browser clients must call only relative `/api/...` endpoints. Next.js route handlers read the NestJS base URL from a server-only environment variable such as `BACKEND_API_URL` and forward the request. Never expose that URL through a `NEXT_PUBLIC_` variable. NestJS remains responsible for authentication, authorization, validation, and tenant isolation.

## Delivery plan

See [PLAN.md](./PLAN.md) for the 15-day roadmap, acceptance criteria, carry-over queue, blockers, and session history.
