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
- `/school-admin/dashboard` — school administration

## Architecture

- `src/app` contains route entry points.
- `src/components` contains reusable UI, layout, and shared components.
- `src/features` owns domain models and behavior.
- `src/store` contains Redux Toolkit setup and typed hooks.
- `src/lib/api` contains the transport-level API client.
- `src/mocks` provides typed development data behind feature service interfaces.
- `PLAN.md` is the delivery tracker and work log.

The current `systemService` uses mock data. When the NestJS backend is ready, replace the service export with an HTTP implementation; route components should not need to change.

## Delivery plan

See [PLAN.md](./PLAN.md) for the 15-day roadmap, acceptance criteria, carry-over queue, blockers, and session history.
