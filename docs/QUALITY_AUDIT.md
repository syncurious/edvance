# Day 15 product quality audit

This is the final cross-product audit record for the 15-day frontend build. Earlier day-specific evidence remains in `PLAN.md`; this file records the shared conclusions and ownership decisions.

## Route and state coverage

| Route family                  | Loading                         | Empty                          | Error/retry                           | Disabled/saving                  | Success                   | Responsive containment |
| ----------------------------- | ------------------------------- | ------------------------------ | ------------------------------------- | -------------------------------- | ------------------------- | ---------------------- |
| Authentication                | Guard/form progress             | N/A                            | Field and service errors              | Submit protection                | Login/reset outcomes      | Verified               |
| Super Admin dashboards        | Skeletons                       | Dashboard empty state          | Shared retry state                    | Action loading where applicable  | Ready state               | Verified               |
| Schools                       | Table/form/detail loading       | Directory empty state          | Retry and not-found/conflict handling | Submit/delete protection         | CRUD feedback             | Verified               |
| Subscriptions, billing, usage | Skeletons                       | Shared empty state             | Shared retry state                    | Contextual actions               | Ready state               | Verified               |
| Platform users                | Table loading                   | Filtered empty state           | Retry/mutation errors                 | Mutation protection              | Status/reset feedback     | Verified               |
| School dashboard              | Skeletons                       | Dashboard empty state          | Shared retry state                    | N/A                              | Campus-scoped ready state | Verified               |
| Students                      | Table/form/profile loading      | Filtered empty state           | Retry/not-found/conflict handling     | Submit protection                | Create/update feedback    | Verified               |
| Teachers and classes          | List/form/profile loading       | Filtered/roster empty states   | Retry/not-found/conflict handling     | Submit protection                | Create/update feedback    | Verified               |
| Attendance                    | Sheet/report loading            | Filter/report empty states     | Retry/save errors                     | Dirty/saving/saved states        | Save feedback             | Verified               |
| Fees                          | Page/table/drawer loading       | Dataset empty states           | Retry/payment errors                  | Payment confirmation/protection  | Receipt and totals update | Verified               |
| Exams                         | List/form/detail/result loading | Filtered list state            | Retry/not-found/save errors           | Invalid-mark and save protection | Recalculated results      | Verified               |
| Shared reports                | Dataset loading                 | Table empty state              | Retry state                           | Export unavailable/ready state   | Export-preview feedback   | Verified               |
| Placeholder/settings routes   | N/A                             | Intentional module placeholder | N/A                                   | Disabled unavailable actions     | N/A                       | Verified               |

Data-driven routes expose an appropriate state model. A static page is not required to manufacture loading or retry UI when it performs no asynchronous work.

## Accessibility audit

- A skip link targets the main landmark in the shared admin shell.
- Desktop and mobile navigation have accessible names, current-route treatment, visible focus, and dismissible overlays.
- Forms use programmatic labels, `aria-invalid`, associated error descriptions, alert semantics, and submission protection.
- Statuses combine text and icons; no required meaning depends on color alone.
- Dense tables remain semantic and use internal horizontal scrolling rather than widening the page.
- Tabs, dialogs, dropdowns, tooltips, toasts, pagination, radio-style controls, and confirmation flows use the shared accessible primitives.
- Charts provide accessible labels/figures and nearby textual values.
- Loading and mutation feedback use `aria-busy`, live regions, alerts, or dialogs where the update needs announcement.

## Responsive audit

- Shared page containers use `min-width: 0` and constrain route content inside the admin shell.
- Navigation tabs, filter rows, and tables scroll internally where their minimum useful width exceeds the viewport.
- Forms collapse to one column; actions wrap or expand to full width where appropriate.
- Drawers use the available mobile width and keep primary actions reachable.
- Previous day walkthroughs covered desktop/tablet/mobile breakpoints. The final Day 15 sweep repeats representative auth, Super Admin, School Admin, dense table, marks-entry, and report routes at desktop, laptop, tablet, and mobile sizes.

## Shared-state ownership

| State                                     | Owner                     | Reason                                                                  |
| ----------------------------------------- | ------------------------- | ----------------------------------------------------------------------- |
| Authenticated user/session hydration      | Redux `auth` slice        | Consumed by guards, header, and sign-out across route areas             |
| Active school and campus                  | Redux `workspace` slice   | Shared by the shell and multiple School Admin modules                   |
| Environment/platform identity             | Redux `app` slice         | Global application metadata                                             |
| Remote API cache                          | RTK Query `baseApi`       | Shared request caching, deduplication, invalidation, and mutation state |
| Forms, filters, tabs, pagination, dialogs | Component/form state      | Transient view state with no cross-route ownership need                 |
| Current mock datasets                     | Feature service singleton | Temporary replaceable boundary until each feature migrates to RTK Query |

No transient form or table state was moved into Redux. This keeps global ownership narrow while making the real API migration explicit.

## Consolidation decisions

- Route pages remain thin and delegate domain behavior to feature components.
- Repeated dashboard, table, state, status, page-header, profile, and form patterns use shared primitives or thin domain mappings.
- Currency formatting is centralized in `src/lib/format.ts` and reused by fee and reporting features.
- One `baseApi` owns RTK Query middleware/cache; feature APIs will use endpoint injection rather than creating independent stores.
- One server-only proxy helper owns upstream URL construction, the header allowlist, timeout behavior, and safe gateway errors.

## Integration readiness

- Browser HTTP utilities reject absolute origins and default to `/api`.
- The catch-all Next.js Route Handler reads only `EDVANCE_BACKEND_URL` on the server.
- The proxy returns a safe `503` until configured, applies a timeout, prevents automatic upstream redirects, and normalizes connection failures.
- `docs/API_CONTRACTS.md` defines endpoint, tenancy, validation, error, money/date, transaction, and migration assumptions for the NestJS owner.
- Authentication storage remains mock-only. Production integration must replace it with the agreed secure session flow before release.

## Open external dependency

The real NestJS service and its finalized OpenAPI/session contract are not present in this repository. This does not block frontend readiness; it does block live backend integration and end-to-end production authentication. The frontend remains on typed mocks until that external contract is available.
