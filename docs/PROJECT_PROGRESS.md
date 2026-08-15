# Project Progress

## Current Sprint

- Business Core Production Hardening completed across Booking Management, Dashboard Analytics, and SEO Management modules.
- CMS Content/Media hardening pass completed for media permissions, deletion safety, settings source-of-truth behavior, and public social-link safety.
- Media API security: list/detail endpoints now enforce `media.view` permissions in addition to existing mutating permission checks.
- Media lifecycle safety: backend now blocks deletion of media assets that are still referenced (`usageCount`/gallery links), returning conflict instead of allowing unsafe content breakage.
- Admin Media Library UX upgrades: drag-and-drop upload zone, file type + size + max-count pre-validation, upload progress bar, status/visibility/publish filters, and usage-based filtering.
- Admin Settings persistence is now API-first: server is canonical source; local storage is only fallback cache for read failures.
- Settings safety: backend and admin now enforce `http/https` URL schemes for external URL fields (social/contact/branding) to prevent unsafe protocol injection.
- Public website social/footer/contact rendering now only shows valid safe social links from CMS settings; hardcoded fake fallback outbound links were removed.
- Default social URLs in backend/admin/public settings constants were reset to empty values to preserve CMS-driven correctness.
- Booking backend now enforces event-capacity-aware creation/status transitions, stable booking references, richer response payloads, and booking status audit trails.
- Admin Booking UI now supports event/lesson/experience-specific filters, sort direction controls, guarded status actions, and richer booking detail cards.
- Public booking success now renders operational confirmation details (reference, activity, schedule, participants, location, payment notice, support contact).
- Added real backend dashboard analytics endpoint (`GET /api/v1/dashboard`) with date ranges (`today`, `7d`, `30d`, `90d`) for KPIs, daily booking series, recent bookings, upcoming event capacity, and recent audit activity.
- Replaced admin dashboard mock arrays with live API-backed analytics rendering.
- Introduced production SEO module backend under `/api/v1/seo`:
- Admin CRUD endpoints for SEO pages with validation, permission checks, pagination/filtering, route-path uniqueness checks, and soft-delete.
- Public SEO resolution endpoint (`GET /api/v1/seo/public?path=...`) for route-level metadata delivery.
- Replaced admin SEO localStorage page with real API-backed list/edit/create/delete workflow.
- Public SEO component now hydrates metadata from backend per route while preserving static fallback behavior.
- Production Readiness hardening completed for environment architecture, API origin safety, cookie/CORS security, frontend/admin runtime resilience, and deployment documentation.
- Backend environment validation now enforces explicit production origins (`FRONTEND_ORIGIN`, `ADMIN_ORIGIN`, `PUBLIC_SITE_URL`), rejects wildcard CORS, rejects localhost origins in production, and requires secure auth cookies in production.
- Backend cookie config now supports explicit `AUTH_COOKIE_DOMAIN` while retaining HttpOnly + path scoping.
- Backend logging now redacts sensitive fields (authorization headers, cookies, password/token fields).
- API responses now include `X-Robots-Tag: noindex, nofollow` to discourage indexing of private/admin API surfaces.
- OpenAPI server URL was changed from localhost to relative root (`/`) to avoid deployment-host assumptions.
- Public and admin frontend runtime configuration now relies on environment-driven API base URLs with development-only localhost fallback behavior.
- Public frontend API services now use a shared runtime URL helper and network-failure-safe fetch handling with friendly user messages.
- Admin HTTP service now returns user-friendly auth/permission/server/network messages and uses strict runtime env resolution.
- Admin login no longer ships with default demo credentials prefilled.
- Added React error boundaries for both public and admin apps for graceful runtime recovery UX.
- Admin shell is now explicitly non-indexable via robots meta tag.
- Added `.env.example` templates for root frontend and admin frontend, and hardened backend `.env.example` with placeholders only.
- Added backend production migration scripts (`prisma:migrate:deploy`, `prisma:migrate:status`) and frontend/admin `start` scripts for deployment consistency.
- Added SEO artifact generation script (`scripts/generate-seo-files.mjs`) and build hook to generate production-safe `public/robots.txt` and `public/sitemap.xml` from configured site URL.

- Access Control: implemented real database-backed users, roles, and permissions management across backend APIs and admin UI.
- Authorization: route-level permission checks now use `resource.action` slugs with compatibility for legacy `manage_*` naming and super-admin wildcard behavior.
- Audit Logging: added persistent audit log records for auth events (login/logout), access-control operations, and shared content CRUD operations.
- Admin UI: completed migration from placeholders/local storage to live API-backed screens for Users, Roles, Permissions, and Audit Logs.

## Seed Data

- Added idempotent access-control seed data for permissions, roles, admin users, and sample audit logs.
- Existing content seed data and admin bootstrap remain intact.

## API Surface

- Users: full admin list/detail/create/update/delete plus password reset/change endpoints.
- Roles: list/detail/create/update/delete plus dedicated permission assignment endpoint.
- Permissions: list and grouped views for matrix assignment workflows.
- Audit Logs: list/detail with filters for actor, action, resource type, search, and date range.
- Existing content routes now enforce action-specific permission checks for mutating endpoints.

## Database Changes

- Added `AuditLog` model and relation to `AdminUser` in Prisma schema.
- Added migration SQL at `backend/prisma/migrations/20260814100000_access_control_audit/migration.sql`.
- Migration file is present; applying it in the target database environment remains an operational step.

## Validation Status

- Backend: Prisma schema validation, Prisma client generation, and TypeScript build are passing.
- Admin: TypeScript and Vite production build are passing after access-control page rewrites.
- Public app: root TypeScript and Vite production build are passing.
- Business-core pass verification:
- Backend `npm run build` passes after dashboard/SEO module integration.
- Admin `npm run build` passes after dashboard + SEO API integration.
- Public `npm run build` passes after SEO runtime metadata fetch integration.
- Production-readiness pass verification:
- Backend TypeScript build passes after env/cors/cookie/logger hardening.
- Admin TypeScript + Vite build passes after runtime config/auth error improvements.
- Public TypeScript + Vite build passes after runtime API helper + safe fetch + error boundary integration.
- CMS media/content hardening verification:
- Backend `npm run build` passes after media permission/delete safety and settings URL validator updates.
- Admin `npm run build` passes after media upload UX + settings persistence changes.
- Public `npm run build` passes after social/footer/contact URL safety changes.

## Stability Repair (2026-08-14)

- Resolved backend startup crash caused by calling `.pick()` on a refined Zod schema in FAQ routing.
- Root cause: `faqUpdateBodySchema` (a refined/effect schema) was used with `.pick({ status: true })` in FAQ route initialization, which is not allowed in Zod v4.
- Fixed by separating FAQ schemas into a plain partial object schema plus post-transform refinements, and adding a dedicated `faqStatusUpdateBodySchema`.
- Updated files: `backend/src/validators/faq.validator.ts` and `backend/src/routes/v1/faqs.routes.ts`.
- Additional runtime hardening: query validation now mutates parsed query data safely instead of assigning directly to getter-only `req.query` in `backend/src/middlewares/validate.middleware.ts`.
- Database drift repair: added missing `FAQ.isFeatured` column/index in local PostgreSQL so FAQ reads match Prisma model expectations.
- Verification performed:
- `npm run dev` starts and remains running on port `4000`.
- `GET /api/v1/health` returns success with `prismaClientReady: true`.
- `GET /api/v1/faqs` returns `200` without server crash.
- `POST /api/v1/auth/login` is reachable (validation response expected for empty payload).
- `POST /api/v1/auth/refresh` returns expected `401 Missing refresh token` without server crash.
- Backend checks pass: Prisma validate, Prisma generate, and TypeScript build.

## Next Recommended Step

- Apply the access-control/audit migration on the target PostgreSQL environment and run the seed flow.
- Execute end-to-end QA for permission gating (UI and direct API calls) with multiple role profiles.
- Add focused integration tests for role-permission assignment and audit log generation on critical admin actions.

## Known Limitations / Remaining Tasks

- Frontend and admin have runtime and build verification completed, but full manual regression across every module/page flow remains an operational QA task.
- SEO sitemap generation is currently route-list based and deployment-safe; dynamic content sitemap expansion (published entity slugs) can be added in a future sprint if required.
- Media AV scanning remains feature-flagged hook architecture (`MEDIA_ENABLE_AV_SCANNING`) and requires external scanner integration for active malware scanning in production.
