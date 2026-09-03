# Edvance Frontend — 15-Day Execution Plan

This file is the source of truth for the frontend build. Keep it updated while working, not only at the end of a day.

## How to use this plan

The user may give only a short instruction such as `Day 1`, `Day 2`, or `Day 3`.

When a day is requested:

1. Read this entire file and inspect the current repository before changing code.
2. Review every earlier day's checklist and the Carry-over Queue.
3. Verify items marked complete when the repository does not clearly support that status.
4. Continue earlier unfinished, missed, or failed work before starting the requested day's new work.
5. If an earlier item is blocked, record the blocker and continue any independent work that is still possible.
6. Implement and verify the requested day's work.
7. Update this file with statuses, evidence, blockers, decisions, and the next starting point.
8. Never erase useful history. Move resolved items to the Work Log and mark their final status.

Do not silently skip work. Any planned item not completed must be marked `PENDING`, `IN PROGRESS`, `BLOCKED`, `MISSED`, or `DEFERRED`, with a short reason.

## Status legend

- `[ ] PENDING` — Not started.
- `[-] IN PROGRESS` — Started but not complete or not verified.
- `[x] DONE` — Implemented and verified; include evidence in the Work Log.
- `[!] BLOCKED` — Cannot continue because of a concrete dependency or required decision.
- `[?] MISSED` — Was expected earlier but was overlooked; put it in the Carry-over Queue.
- `[>] DEFERRED` — Intentionally moved to a later day; record the reason and target day.
- `[~] NOT APPLICABLE` — No longer required; record why.

Only use `[x] DONE` after verification. Creating a file without validating its behavior is not sufficient.

## Current state

- Current requested day: Day 2
- Last fully completed day: Day 2
- Active task: None
- Overall status: DAY 2 COMPLETE
- Last updated: 2026-09-03
- Next action: Start Day 3 admin shell and layout

## Carry-over Queue

Complete this queue before new work for the requested day, except for blocked items.

| Origin | Item                    | Status | Reason / blocker | Next action |
| ------ | ----------------------- | ------ | ---------------- | ----------- |
| —      | No carry-over items yet | —      | —                | —           |

## Blockers and dependencies

| ID    | Date       | Area         | Blocker / dependency                                                                   | Owner            | Status   | Resolution                                                                                                                                                |
| ----- | ---------- | ------------ | -------------------------------------------------------------------------------------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B-001 | 2026-09-03 | Dependencies | Pinned Sites starter had transitive npm advisories that required core-version changes. | Upstream/runtime | RESOLVED | Removed the Sites/Vinext/Cloudflare runtime, migrated to standard Next.js 16.3.4, applied the compatible lockfile fix, and verified zero vulnerabilities. |

## Decisions and assumptions

| Date       | Decision / assumption                                                                     | Reason                                                                      | Impact                                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 2026-09-03 | Use Next.js, TypeScript, Tailwind CSS, shadcn/ui, Lucide, Redux Toolkit, and Recharts.    | Agreed frontend foundation.                                                 | Applies across all 15 days.                                                                                           |
| 2026-09-03 | Use mock data behind a replaceable API boundary until the NestJS API is available.        | Frontend and backend are owned separately.                                  | Avoid coupling screens to temporary data.                                                                             |
| 2026-09-03 | Add RTK Query when backend integration begins.                                            | Provides caching, request state, refetching, invalidation, and mutations.   | Keep API calls out of components.                                                                                     |
| 2026-09-03 | Redux is for shared application state, not every local form or table value.               | Prevent unnecessary global state.                                           | Prefer local/component state for transient UI data.                                                                   |
| 2026-09-03 | Use the Sites Next-compatible Vinext runtime generated by the pinned project initializer. | It provided the initial App Router scaffold.                                | Superseded on Day 2 at the user's request.                                                                            |
| 2026-09-03 | Use standard Next.js 16.3.4 with no Sites runtime or `.openai` folder.                    | The user explicitly requested that Sites and the OpenAI folder not be used. | Next now owns development and production builds; Sites/Vinext/Cloudflare dependencies and configuration were removed. |

## Definition of done for every task

A task can be marked `DONE` only when all applicable checks pass:

- The implementation satisfies its acceptance criteria.
- Type checking and linting pass for changed code.
- Relevant automated tests pass, or a missing test is recorded.
- The main user flow is manually inspected when visual behavior is involved.
- Loading, empty, error, success, and disabled states are handled where relevant.
- The result works at desktop and mobile sizes where relevant.
- No unrelated user work is removed or overwritten.
- Evidence is added to the Work Log.

## Architecture rules

- Build reusable patterns instead of page-specific duplicates.
- Keep route pages thin; put domain behavior in features and reusable UI in components.
- Keep mock and real API access behind the same feature-level interface.
- Do not hardcode authentication logic into individual pages.
- Do not create charts directly inside route pages; use reusable chart components.
- Reuse configurable primitives such as `DataTable`, `Form`, `Dialog`, `PageHeader`, `StatCard`, `FilterBar`, `StatusBadge`, `ProfileHeader`, and `EmptyState`.
- Preserve accessibility: keyboard access, visible focus, labels, semantic markup, and sufficient contrast.

## Target structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── super-admin/
│   └── school-admin/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── shared/
│   └── charts/
├── features/
│   ├── auth/
│   ├── schools/
│   ├── students/
│   ├── teachers/
│   ├── attendance/
│   ├── fees/
│   └── exams/
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
├── lib/
├── types/
├── constants/
└── mocks/
```

## Day 1 — Project Setup and Architecture

Goal: create a clean, runnable project with a scalable structure and basic routing.

- [x] DONE — Initialize Next.js with TypeScript, Tailwind CSS, App Router, and `src/`.
- [x] DONE — Install and configure shadcn/ui, Lucide, Redux Toolkit, React Redux, and Recharts.
- [x] DONE — Establish the target folder structure without placeholder clutter.
- [x] DONE — Add typed Redux store, provider, and typed hooks.
- [x] DONE — Create initial auth, super-admin, and school-admin route groups/pages.
- [x] DONE — Add a replaceable mock/API service boundary.
- [x] DONE — Add project scripts and basic quality checks.
- [x] DONE — Add a useful README with setup and run instructions.
- [x] DONE — Confirm the Git repository is healthy and ignores generated/secrets files.
- [x] DONE — Run lint, type checking, and a production build.

Acceptance criteria: the app installs, runs, and builds; the three route areas render; shared state is wired; no secrets or generated build output are tracked.

## Day 2 — Design System

Goal: build the reusable UI foundation before dashboards or feature screens.

- [x] DONE — Define color tokens, typography, spacing, radii, shadows, and responsive conventions.
- [x] DONE — Add reusable Button, Input, Select, Checkbox, Radio, Badge, Avatar, and Card components.
- [x] DONE — Add Dialog, Dropdown, Tabs, Tooltip, Toast, and Skeleton components.
- [x] DONE — Cover applicable default, hover, focus, disabled, loading, error, and success states.
- [x] DONE — Add shared form field, validation message, and status presentation patterns.
- [x] DONE — Create an internal component showcase page for visual verification.
- [x] DONE — Check keyboard use, visible focus, labels, and color contrast.
- [x] DONE — Verify the showcase on desktop and mobile sizes.
- [x] DONE — Run lint, type checking, tests, and build.

Acceptance criteria: common UI can be assembled without one-off styling, all required states are demonstrable, and the showcase has no obvious accessibility or responsive defects.

## Day 3 — Admin Shell and Layout

Goal: deliver a reusable admin layout for both admin roles.

- [ ] PENDING — Create reusable `AdminLayout`/shell primitives.
- [ ] PENDING — Build expanded and collapsed desktop sidebar states.
- [ ] PENDING — Build a mobile sidebar drawer.
- [ ] PENDING — Support active routes and nested navigation.
- [ ] PENDING — Build the header with search, notifications, profile menu, and school selector.
- [ ] PENDING — Add breadcrumbs and a consistent page-content container.
- [ ] PENDING — Add theme toggle only if the chosen design system supports both themes cleanly.
- [ ] PENDING — Define navigation configurations for Super Admin and School Admin.
- [ ] PENDING — Verify keyboard navigation, focus management, and drawer dismissal.
- [ ] PENDING — Verify desktop, laptop, tablet, and mobile layouts.
- [ ] PENDING — Run lint, type checking, tests, and build.

Acceptance criteria: both role areas use the same shell primitives, navigation state follows the route, and the layout works without clipping or inaccessible controls across supported sizes.

## Day 4 — Authentication UI

Goal: create backend-ready authentication flows without embedding auth logic in pages.

- [ ] PENDING — Build `/login`, `/forgot-password`, and `/reset-password` screens.
- [ ] PENDING — Add validated email, password, remember-me, and reset forms.
- [ ] PENDING — Handle loading, validation, API error, and success states.
- [ ] PENDING — Create auth slice, selectors, and typed auth models.
- [ ] PENDING — Add mock auth service through the shared API boundary.
- [ ] PENDING — Add protected-route and role-routing structure.
- [ ] PENDING — Verify keyboard, mobile, and failure flows.

Acceptance criteria: mock login flows into the appropriate role area, invalid and failed submissions are clear, and swapping the mock service for the backend will not require rewriting screens.

## Day 5 — Dashboard Foundation

Goal: create reusable dashboard building blocks.

- [ ] PENDING — Build `StatCard`, `ChartCard`, `RecentActivity`, `DataTable`, `QuickActions`, and `ProgressCard`.
- [ ] PENDING — Build reusable `RevenueChart`, `StudentGrowthChart`, and `AttendanceChart` components.
- [ ] PENDING — Add line, bar, and pie/donut chart patterns using Recharts.
- [ ] PENDING — Add responsive, loading, empty, and error states.
- [ ] PENDING — Create realistic typed mock datasets.
- [ ] PENDING — Verify components outside route-page implementations.

Acceptance criteria: dashboard pages can be composed from configurable components without embedding chart setup or generic table behavior in route files.

## Day 6 — Super Admin Dashboard

Goal: deliver a polished overview of the SaaS platform.

- [ ] PENDING — Show Total Schools, Active Schools, Total Students, Total Teachers, Monthly Revenue, and SMS Usage.
- [ ] PENDING — Add Schools Growth, Student Growth, Revenue, and Subscription Distribution charts.
- [ ] PENDING — Add Recent Schools, Recent Payments, and Recent Activity sections.
- [ ] PENDING — Add loading, empty, error, and responsive states.
- [ ] PENDING — Verify data components use feature services/mocks rather than inline page data.

Acceptance criteria: the page clearly communicates platform health, is responsive, and all data areas are ready for API replacement.

## Day 7 — Super Admin School Management

Goal: deliver the first complete CRUD user interface.

- [ ] PENDING — Build `/super-admin/schools`, `/new`, `/[id]`, and edit experience.
- [ ] PENDING — Build a school table with School, Code, Campus, Students, Plan, Status, Created, and Actions.
- [ ] PENDING — Add search, filters, sorting, pagination, and status filtering.
- [ ] PENDING — Add view, create, edit, and delete/confirmation flows.
- [ ] PENDING — Build fields for name, code, email, phone, address, logo, status, and plan.
- [ ] PENDING — Add validation and all async presentation states.
- [ ] PENDING — Verify table and form accessibility and mobile behavior.

Acceptance criteria: every CRUD path works against the mock boundary, destructive actions require confirmation, and table state remains predictable.

## Day 8 — Super Admin Subscriptions and Users

Goal: provide the core SaaS management UI.

- [ ] PENDING — Build plan cards for Starter, Professional, and Enterprise tiers.
- [ ] PENDING — Build subscription, billing, and usage views.
- [ ] PENDING — Build `/super-admin/users`.
- [ ] PENDING — Add user search plus role, school, and status filtering.
- [ ] PENDING — Show last login and contextual actions.
- [ ] PENDING — Add loading, empty, error, and responsive states.

Acceptance criteria: admins can understand plans and usage and can find/manage users through backend-ready UI flows.

## Day 9 — School Admin Dashboard

Goal: create a school-focused dashboard distinct from the Super Admin experience.

- [ ] PENDING — Show Students, Teachers, Attendance, and Fees Collected metrics.
- [ ] PENDING — Add Today's Attendance, Fee Collection, Student Growth, Upcoming Events, and Recent Activity.
- [ ] PENDING — Build reusable school/campus selector supporting multiple campuses.
- [ ] PENDING — Ensure selected school/campus uses appropriate shared state.
- [ ] PENDING — Add loading, empty, error, and responsive states.

Acceptance criteria: the dashboard reflects the selected school/campus and shares primitives without looking like a copy of the Super Admin dashboard.

## Day 10 — Students Module

Goal: deliver scalable student search, creation, editing, and profile UX.

- [ ] PENDING — Build student list, new, detail, and edit routes.
- [ ] PENDING — Build table columns for photo, ID, name, class, section, parent, phone, status, and actions.
- [ ] PENDING — Add search, filters, sorting, pagination, and relevant states.
- [ ] PENDING — Build profile tabs: Overview, Parents, Academic, Attendance, Fees, Exams, and Documents.
- [ ] PENDING — Build reusable profile, basic info, parent info, and academic info components.
- [ ] PENDING — Add validated create/edit flows and unsaved-change protection where appropriate.

Acceptance criteria: common student journeys work against mocks, profile sections are navigable and reusable, and dense information remains usable on mobile.

## Day 11 — Teachers and Classes

Goal: provide staff management and the basic academic hierarchy.

- [ ] PENDING — Build teacher list, new, detail, and edit experiences.
- [ ] PENDING — Add teacher table and profile patterns.
- [ ] PENDING — Add subject and class assignment UI.
- [ ] PENDING — Build class list and detail routes.
- [ ] PENDING — Represent grades and their sections clearly.
- [ ] PENDING — Add validation, loading, empty, error, and responsive states.

Acceptance criteria: teachers can be managed and assigned, and users can browse from a class/grade to its sections without ambiguous hierarchy.

## Day 12 — Attendance

Goal: make daily attendance entry fast and dependable.

- [ ] PENDING — Build class and date selection.
- [ ] PENDING — Build per-student Present, Absent, Late, and Leave controls.
- [ ] PENDING — Add Mark All Present, Mark All Absent, and Save Attendance actions.
- [ ] PENDING — Prevent accidental loss of unsaved attendance.
- [ ] PENDING — Build Daily, Weekly, Monthly, Student, and Class report views.
- [ ] PENDING — Add clear visual indicators that do not rely on color alone.
- [ ] PENDING — Verify speed and usability with a realistically large class list.

Acceptance criteria: an operator can mark and correct a whole class efficiently, save state is unmistakable, and reports use a reusable filter-to-summary pattern.

## Day 13 — Fees

Goal: deliver the finance module's frontend workflows.

- [ ] PENDING — Build fees overview, structures, invoices, payments, and defaulters routes.
- [ ] PENDING — Show Total Fees, Collected, Pending, and Overdue metrics.
- [ ] PENDING — Build invoice columns for number, student, class, amount, due date, status, and actions.
- [ ] PENDING — Support Paid, Pending, Partial, Overdue, and Cancelled statuses.
- [ ] PENDING — Build invoice/payment drawer with line items, total, amount, method, date, and reference.
- [ ] PENDING — Add validation, confirmation, loading, empty, error, and responsive states.

Acceptance criteria: invoices and payments can be reviewed and entered through mock-backed flows with clear financial status and safe confirmations.

## Day 14 — Exams and Reports

Goal: deliver exam management, results, and a reusable reporting structure.

- [ ] PENDING — Build exam list, new, and detail routes.
- [ ] PENDING — Build subject setup, marks entry, grades, and result status UI.
- [ ] PENDING — Build student result view with totals, percentage, and grade.
- [ ] PENDING — Build reusable `Filters → Data → Summary → Table → Export` report structure.
- [ ] PENDING — Make export explicitly UI-only if backend/export behavior is unavailable.
- [ ] PENDING — Add validation, loading, empty, error, and responsive states.

Acceptance criteria: marks and results are understandable, invalid marks are prevented, and reports share a consistent backend-ready structure.

## Day 15 — Polish and Integration Readiness

Goal: make the application feel like one coherent, production-quality product.

- [ ] PENDING — Audit every page for loading, skeleton, disabled, empty, error, retry, and success states.
- [ ] PENDING — Audit desktop, laptop, tablet, and mobile layouts.
- [ ] PENDING — Audit keyboard use, focus, labels, semantics, and contrast.
- [ ] PENDING — Remove accidental duplication and consolidate reusable patterns.
- [ ] PENDING — Review Redux usage and move local/transient state out of global slices.
- [ ] PENDING — Confirm auth, current user, school/campus, global UI, and notifications have clean shared-state ownership.
- [ ] PENDING — Document the API contract assumptions needed from the NestJS backend.
- [ ] PENDING — Prepare RTK Query base structure or a documented migration path.
- [ ] PENDING — Run the full lint, type-check, test, and production-build suite.
- [ ] PENDING — Resolve all unblocked Carry-over Queue items and explicitly defer any remaining scope.

Acceptance criteria: the product is visually and behaviorally consistent, quality checks pass, unfinished work is explicitly recorded, and APIs can be integrated module-by-module without redesigning screens.

## Final route target

```text
app/
├── (auth)/
│   ├── login/
│   ├── forgot-password/
│   └── reset-password/
├── super-admin/
│   ├── dashboard/
│   ├── schools/
│   ├── users/
│   ├── subscriptions/
│   ├── billing/
│   └── settings/
└── school-admin/
    ├── dashboard/
    ├── students/
    ├── teachers/
    ├── classes/
    ├── attendance/
    ├── fees/
    ├── exams/
    ├── reports/
    └── settings/
```

## Work Log

Add one entry for every work session. Keep entries brief but specific.

### Session template

```markdown
### YYYY-MM-DD — Day N

- Requested: What the user asked to start.
- Continued first: Earlier pending/missed items completed before new work.
- Completed: Concrete work finished in this session.
- Files changed: Important files or areas.
- Verification: Commands and manual checks, with results.
- Pending: Work started or expected but not complete.
- Blocked: Concrete blocker, owner, and what unlocks it.
- Decisions: New technical/product decisions and reasons.
- Next starting point: The exact first action for the next session.
```

### 2026-09-03 — Planning

- Requested: Create a persistent plan that can be driven by short requests such as `Day 1`, `Day 2`, or `Day 3`.
- Continued first: Nothing; the repository has no earlier implementation work.
- Completed: Added the 15-day execution plan, tracking rules, acceptance criteria, carry-over queue, blocker table, decision log, and session template.
- Files changed: `PLAN.md`.
- Verification: Compared the plan against the supplied 15-day frontend outline.
- Pending: All implementation work.
- Blocked: None.
- Decisions: Earlier unfinished work must be reconciled before starting a newly requested day.
- Next starting point: Start Day 1 setup and update this file throughout the session.

### 2026-09-03 — Day 1

- Requested: Complete Day 1 project setup and architecture.
- Continued first: Reviewed the plan and confirmed there was no earlier implementation or carry-over work.
- Completed: Initialized the Next-compatible TypeScript/App Router project; configured Tailwind, shadcn/ui, Lucide, Redux Toolkit, React Redux, and Recharts; added an intentional Edvance theme; created typed Redux store/provider/hooks; added authentication, Super Admin, and School Admin route areas; added a typed mock service and replaceable HTTP client boundary; added quality scripts and repository documentation.
- Files changed: Project configuration, `src/app`, `src/components`, `src/constants`, `src/features`, `src/lib`, `src/mocks`, `src/store`, `README.md`, and `PLAN.md`.
- Verification: `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm run build` passed. Local HTTP checks returned 200 for `/`, `/login`, `/super-admin/dashboard`, and `/school-admin/dashboard`. `git diff --check` passed, and generated/secrets paths are ignored.
- Pending: No unblocked Day 1 implementation work. Automated behavioral tests were not added because Day 1 contains foundation and route placeholders; route compilation and HTTP smoke checks were used instead.
- Blocked: B-001 tracks transitive dependency advisories in the pinned starter. The non-breaking npm fix cannot resolve them, and forced core runtime upgrades were intentionally not applied without a compatible upstream set.
- Decisions: Preserve the generated Vinext/Sites runtime and keep route/application code compatible with Next.js conventions. Use feature service interfaces so the NestJS backend can replace mocks without page rewrites.
- Next starting point: Re-check B-001 for a safe upstream fix, then begin Day 2 by formalizing tokens and reviewing the installed shadcn component APIs.

### 2026-09-03 — Day 2

- Requested: Complete Day 2 and do not use Sites or an `.openai` folder.
- Continued first: Removed the Sites/Vinext/Cloudflare runtime and configuration, migrated scripts and dependencies to standard Next.js 16.3.4, applied the compatible dependency fix, and closed B-001 with a zero-vulnerability audit.
- Completed: Formalized Edvance color/status/type/spacing/radius tokens; refined Button, Input, and Select sizing and focus states; added reusable `StatusBadge` and accessible `TextField` patterns; wired global toast feedback; built `/design-system` with buttons, inputs, selection controls, badges, avatars, cards, dialogs, dropdowns, tabs, tooltips, toasts, skeletons, and default/loading/error/success/disabled examples; added component tests.
- Files changed: Standard Next.js/package configuration, global theme, shared and UI components, design-system feature and route, tests, `README.md`, and `PLAN.md`. The `.openai` folder and Sites configuration are absent.
- Verification: Four component tests passed. Type checking, linting, formatting, and the standard Next.js production build passed. `/`, `/design-system`, `/login`, and both admin dashboards returned 200. Browser checks covered 1440×900 and 390×844 with no horizontal overflow; dialog, toast, focusable controls, and responsive layouts were inspected with no browser console errors. `npm audit --omit=dev` reports zero vulnerabilities.
- Pending: None for Day 2.
- Blocked: None.
- Decisions: Keep standard Next.js. Use Webpack for production builds in this restricted environment because Turbopack's CSS worker attempts to bind an internal port; development remains `next dev`.
- Next starting point: Begin Day 3 with shared admin-shell primitives and role-specific navigation configuration.
