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
- `/super-admin/reports` — platform health, subscription, revenue, and usage reports
- `/super-admin/settings` — platform identity, security, notification, and integration settings
- `/school-admin/dashboard` — school administration
- `/school-admin/students` — student directory and profiles
- `/school-admin/teachers` — teacher directory and assignments
- `/school-admin/classes` — class hierarchy and rosters
- `/school-admin/attendance` — attendance entry and reports
- `/school-admin/fees` — fee structures, invoices, payments, and defaulters
- `/school-admin/exams` — exam setup, marks, and results
- `/school-admin/reports` — shared school reporting workflow
- `/school-admin/settings` — school, academic, attendance, fee, and notification settings

## Architecture

- `src/app` contains route entry points.
- `src/app/api` contains same-origin route handlers that proxy backend requests.
- `src/components` contains reusable UI, layout, and shared components.
- `src/features` owns domain models and behavior.
- `src/store` contains Redux Toolkit state, typed hooks, and the shared RTK Query API cache.
- `src/lib/api` contains the browser transport client, which defaults to relative `/api` URLs.
- `src/mocks` provides typed development data behind feature service interfaces.
- `PLAN.md` is the delivery tracker and work log.

Feature services currently use typed mock data. During NestJS integration, browser clients call only relative `/api/...` endpoints. The catch-all Next.js Route Handler reads `EDVANCE_BACKEND_URL` from the server runtime and forwards the request. Never expose that value through a `NEXT_PUBLIC_` variable. NestJS remains responsible for authentication, authorization, validation, and tenant isolation.

Copy `.env.example` to `.env.local` only when a backend is available. Leave the value unset while using mocks; `/api/...` returns a safe `503` instead of exposing configuration details.

See [API contracts](./docs/API_CONTRACTS.md) for the NestJS handoff and [quality audit](./docs/QUALITY_AUDIT.md) for the final route/state/accessibility review.

## Delivery plan

See [PLAN.md](./PLAN.md) for the 15-day roadmap, acceptance criteria, carry-over queue, blockers, and session history.
