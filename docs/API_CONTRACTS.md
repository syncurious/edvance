# Edvance frontend ↔ NestJS API contract

This document is the integration handoff for the current frontend. The TypeScript models and feature service interfaces under `src/features` remain the source of truth for payload shapes until a versioned OpenAPI contract replaces them.

For the normalized PostgreSQL schema, Karachi/Sindh identity and document fields, tenant-isolation pattern, and recommended backend implementation order, see [`BACKEND_BLUEPRINT.md`](./BACKEND_BLUEPRINT.md).

## Request path and trust boundary

```text
Browser feature → relative /api/... → Next.js Route Handler → NestJS
```

- Browser code calls only same-origin, relative `/api/...` paths.
- `EDVANCE_BACKEND_URL` is read only by server-side Next.js code. It must never use a `NEXT_PUBLIC_` prefix.
- `src/app/api/[...path]/route.ts` forwards supported JSON requests to the configured NestJS origin and normalizes gateway failures.
- The proxy deliberately forwards a small header allowlist and never forwards the browser `Host` header.
- NestJS remains responsible for authentication, role checks, permissions, tenant isolation, validation, rate limiting, audit logging, and transaction integrity. Hiding its origin is not an authorization control.
- Dedicated authentication handlers may replace the generic proxy when secure session-cookie creation and refresh behavior are connected.

## Environment

Set this only in the server runtime:

```dotenv
EDVANCE_BACKEND_URL=
```

The value may include a base path such as the backend API version. The frontend does not need or expose the resulting origin.

## Global conventions

### Authentication and tenancy

- Prefer an opaque, `HttpOnly`, `Secure`, `SameSite=Lax` session cookie owned by the same-origin Next.js boundary.
- If NestJS owns the cookie, agree on its domain/path attributes before enabling login through the generic proxy.
- Every protected endpoint validates the authenticated role and derives the allowed school scope from the authenticated principal.
- `schoolId` and `campusId` are selectors, never authorization evidence. NestJS must reject a valid user requesting an unauthorized tenant.
- Mutations using cookie authentication require an agreed CSRF control. The proxy can forward `x-csrf-token`.

### Requests

- JSON uses `Content-Type: application/json` and UTF-8.
- Dates are ISO `YYYY-MM-DD`; timestamps are ISO 8601 UTC.
- Monetary values are integer PKR amounts in whole rupees for the current UI contract.
- IDs are stable opaque strings. The frontend must not infer permissions or entity type from an ID.
- Search is trimmed and case-insensitive. Unknown query parameters should be rejected or ignored consistently.
- List endpoints accept `page` and `pageSize` where the UI paginates. Current defaults are feature-specific and should be returned in the response.

### Responses

Paginated collections use the feature's current result key and include:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 0
}
```

During integration, adapters may rename `items` to the existing feature key such as `schools`, `students`, `teachers`, or `users`. Pick one convention in OpenAPI before removing those adapters.

Successful deletes return `204 No Content`. Successful creates return `201 Created`. Other reads and mutations return JSON with the appropriate `2xx` status.

Errors use one safe shape and never expose stack traces, database messages, secrets, or the backend origin:

```json
{
  "code": "STUDENT_CONFLICT",
  "message": "A student with this admission ID already exists.",
  "fieldErrors": {
    "admissionId": "Already in use"
  },
  "requestId": "opaque-correlation-id"
}
```

Expected status mapping:

| Status        | Meaning                                        |
| ------------- | ---------------------------------------------- |
| `400`         | Malformed request or invalid query             |
| `401`         | No valid session                               |
| `403`         | Authenticated but not allowed                  |
| `404`         | Entity not found in the allowed tenant         |
| `409`         | Unique-field or state conflict                 |
| `422`         | Valid JSON with field validation errors        |
| `429`         | Rate limited; include `Retry-After`            |
| `500`         | Safe unexpected backend failure                |
| `502` / `504` | Next.js could not reach NestJS or it timed out |

Every service should return or forward an `x-request-id` so a user-visible failure can be traced across both servers.

## Endpoint inventory

Payloads named below correspond to interfaces in `src/features/<feature>/types.ts`.

### Authentication

| Method   | Browser path                | Request                   | Response                               |
| -------- | --------------------------- | ------------------------- | -------------------------------------- |
| `POST`   | `/api/auth/login`           | `LoginCredentials`        | `AuthSession` or secure session result |
| `GET`    | `/api/auth/session`         | —                         | Current `AuthSession`                  |
| `DELETE` | `/api/auth/session`         | —                         | `204`                                  |
| `POST`   | `/api/auth/forgot-password` | `PasswordResetRequest`    | `AuthResultMessage`                    |
| `POST`   | `/api/auth/reset-password`  | `PasswordResetSubmission` | `AuthResultMessage`                    |

Production integration should remove the current browser-stored mock access token and hydrate the user from `/api/auth/session`.

### Dashboards

| Method | Browser path                  | Query                  | Response                   |
| ------ | ----------------------------- | ---------------------- | -------------------------- |
| `GET`  | `/api/super-admin/dashboard`  | —                      | `SuperAdminDashboardData`  |
| `GET`  | `/api/school-admin/dashboard` | `schoolId`, `campusId` | `SchoolAdminDashboardData` |

### Schools and platform users

| Method   | Browser path                    | Request/query                    | Response           |
| -------- | ------------------------------- | -------------------------------- | ------------------ |
| `GET`    | `/api/schools`                  | `SchoolListQuery`                | `SchoolListResult` |
| `POST`   | `/api/schools`                  | `SchoolFormValues`               | `School`           |
| `GET`    | `/api/schools/:id`              | —                                | `School`           |
| `PUT`    | `/api/schools/:id`              | `SchoolFormValues`               | `School`           |
| `DELETE` | `/api/schools/:id`              | —                                | `204`              |
| `GET`    | `/api/users`                    | `UserListQuery`                  | `UserListResult`   |
| `PATCH`  | `/api/users/:id/status`         | `{ status: PlatformUserStatus }` | `PlatformUser`     |
| `POST`   | `/api/users/:id/password-reset` | —                                | `204`              |

### Subscriptions and billing

| Method | Browser path               | Query | Response               |
| ------ | -------------------------- | ----- | ---------------------- |
| `GET`  | `/api/subscriptions`       | —     | `SubscriptionOverview` |
| `GET`  | `/api/billing`             | —     | `BillingOverview`      |
| `GET`  | `/api/subscriptions/usage` | —     | `UsageOverview`        |

### Students, teachers, and classes

| Method | Browser path        | Request/query        | Response            |
| ------ | ------------------- | -------------------- | ------------------- |
| `GET`  | `/api/students`     | `StudentListQuery`   | `StudentListResult` |
| `POST` | `/api/students`     | `StudentFormValues`  | `Student`           |
| `GET`  | `/api/students/:id` | —                    | `Student`           |
| `PUT`  | `/api/students/:id` | `StudentFormValues`  | `Student`           |
| `GET`  | `/api/teachers`     | `TeacherListQuery`   | `TeacherListResult` |
| `POST` | `/api/teachers`     | `TeacherFormValues`  | `Teacher`           |
| `GET`  | `/api/teachers/:id` | —                    | `Teacher`           |
| `PUT`  | `/api/teachers/:id` | `TeacherFormValues`  | `Teacher`           |
| `GET`  | `/api/classes`      | `campusId`, `search` | `ClassSection[]`    |
| `GET`  | `/api/classes/:id`  | —                    | `ClassSection`      |

### Attendance

| Method | Browser path              | Request/query            | Response           |
| ------ | ------------------------- | ------------------------ | ------------------ |
| `GET`  | `/api/attendance/sheets`  | `classSectionId`, `date` | `AttendanceSheet`  |
| `PUT`  | `/api/attendance/sheets`  | `SaveAttendanceInput`    | `AttendanceSheet`  |
| `GET`  | `/api/attendance/reports` | `AttendanceReportQuery`  | `AttendanceReport` |

Saving a sheet is atomic for its class/date key. NestJS must reject student IDs outside the selected class and preserve one record per student.

### Fees

| Method | Browser path           | Request/query        | Response              |
| ------ | ---------------------- | -------------------- | --------------------- |
| `GET`  | `/api/fees/overview`   | `campusId`           | `FeeOverview`         |
| `GET`  | `/api/fees/structures` | `campusId`           | `FeeStructure[]`      |
| `GET`  | `/api/fees/invoices`   | `InvoiceQuery`       | `Invoice[]`           |
| `GET`  | `/api/fees/payments`   | `campusId`           | `Payment[]`           |
| `GET`  | `/api/fees/defaulters` | `campusId`           | `Invoice[]`           |
| `POST` | `/api/fees/payments`   | `RecordPaymentInput` | `RecordPaymentResult` |

Payment recording is transactional and idempotent. The final backend request must include an idempotency key so retries cannot produce duplicate receipts.

### Exams and results

| Method | Browser path                        | Request/query             | Response          |
| ------ | ----------------------------------- | ------------------------- | ----------------- |
| `GET`  | `/api/exams`                        | `ExamListQuery`           | `Exam[]`          |
| `POST` | `/api/exams`                        | `ExamFormValues`          | `Exam`            |
| `GET`  | `/api/exams/:id`                    | —                         | `Exam`            |
| `GET`  | `/api/exams/:id/summary`            | —                         | `ExamSummary`     |
| `GET`  | `/api/exams/:id/results`            | —                         | `StudentResult[]` |
| `PUT`  | `/api/exams/:id/results`            | `SaveStudentMarksInput[]` | `StudentResult[]` |
| `GET`  | `/api/exams/:id/results/:studentId` | —                         | `StudentResult`   |

NestJS validates `0 ≤ marks ≤ subject.maxMarks`, treats `null` as absent, recalculates totals and grades server-side, and never trusts totals submitted by the browser.

### Reports

| Method | Browser path                   | Request/query                     | Response                        |
| ------ | ------------------------------ | --------------------------------- | ------------------------------- |
| `GET`  | `/api/reports`                 | `SchoolReportQuery`               | `SchoolReport`                  |
| `POST` | `/api/reports/export`          | `SchoolReportQuery` plus format   | File or asynchronous export job |
| `GET`  | `/api/reports/platform`        | `PlatformReportQuery`             | `PlatformReport`                |
| `POST` | `/api/reports/platform/export` | `PlatformReportQuery` plus format | File or asynchronous export job |

The export endpoint is intentionally not connected in the current UI. Before enabling it, agree on supported formats, maximum range, synchronous versus queued generation, filename/content-disposition behavior, authorization, and audit logging.

### Settings

| Method | Browser path             | Request            | Response           |
| ------ | ------------------------ | ------------------ | ------------------ |
| `GET`  | `/api/settings/platform` | —                  | `PlatformSettings` |
| `PUT`  | `/api/settings/platform` | `PlatformSettings` | `PlatformSettings` |
| `GET`  | `/api/settings/school`   | `schoolId`         | `SchoolSettings`   |
| `PUT`  | `/api/settings/school`   | `SchoolSettings`   | `SchoolSettings`   |

School settings must be scoped from the authenticated principal; a submitted `schoolId` is only a selector. Platform settings require Super Admin authorization. Both update endpoints should validate the full settings document and record an audit event.

## RTK Query migration

`src/store/api/base-api.ts` owns the single shared cache and same-origin base query. Each feature should inject endpoints next to its service contract:

```ts
export const studentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStudents: build.query<StudentListResult, StudentListQuery>({
      query: (params) => ({ url: 'students', params }),
      providesTags: ['Student'],
    }),
  }),
});
```

Migration order:

1. Finalize OpenAPI and authentication/session behavior.
2. Implement and integration-test the Next.js route-handler boundary.
3. Inject one feature's endpoints into `baseApi`.
4. Keep the existing service interface as an adapter during migration or replace its consumers feature-by-feature.
5. Add tag invalidation for mutations and map the standard error shape into form/global feedback.
6. Remove a mock singleton only after its complete feature test suite passes against the HTTP adapter.

Do not move transient filters or forms into Redux during this migration. RTK Query owns server cache state; component state continues to own view state.
