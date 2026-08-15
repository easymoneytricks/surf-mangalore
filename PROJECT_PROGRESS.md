# Project Progress

## Completed Public Pages

- Home page implemented with premium storytelling sections and polished conversion flow.
- Experiences page implemented with data-driven discovery, comparison, FAQ, and CTA structure.
- Events page implemented with featured event, upcoming grid, highlights, and social proof sections.
- Gallery page implemented with category filtering, immersive grid rhythm, and accessible lightbox preview.
- About page implemented as a full brand-story narrative with mission, values, location context, coach trust, timeline, statistics, community culture, and CTA.

## Completed Frontend Booking Architecture

- Booking flow implemented as a dedicated route and page with progressive steps.
- Booking state isolated with local draft persistence and inline validation.
- Booking components modularized for future API integration and reuse.

## Current Architecture Status

- Frontend only architecture in place for content pages and booking workflow.
- No authentication, payments, backend integration, or admin tools implemented yet.
- Data modules structured for future CMS and API replacement.

## Next Recommended Phase

- Introduce API integration layer for booking submission and content source hydration.
- Add backend persistence and operational tooling in a separate secured phase.

## Latest Quality Audit Pass

- Independent creative and UX engineering audit completed across navigation, layout rhythm, shared components, and accessibility behavior.
- Global design system upgraded with stronger typography pairing, reduced-motion support, focus visibility improvements, and touch target consistency.
- Navbar mobile experience improved with focus restoration, keyboard-friendly state handling, and pointer-event fixes for off-canvas behavior.
- Shared Button and Card primitives refined for premium interaction polish and stronger visual hierarchy across all pages.
- Footer improved with clearer conversion path (direct booking link), safer external link attributes, and active-state metadata.
- Route shell corrected to properly surface unknown routes through the existing NotFound fallback.

## Client Review Polish Pass

- Added a full local placeholder image library in public/images/placeholders for premium client-replaceable visuals.
- Replaced remote placeholder imagery across the site with local branded placeholder assets.
- Redesigned footer into four balanced columns with a proper bottom utility bar and icon-based social links.
- Rebuilt the Experiences comparison section with a sticky intro panel and more balanced scroll behavior.
- Upgraded gallery to a responsive masonry layout for stronger visual rhythm and better image storytelling.
- Increased CTA impact across key pages with stronger depth, decorative lighting, and more consistent conversion direction.
- Upgraded the Contact route from a placeholder into a polished premium contact page so it no longer weakens the site during review.

## SEO And Discoverability Pass

- Added reusable route-driven SEO metadata architecture in src/lib/seo.ts and src/components/seo/SEO.tsx.
- Implemented unique titles, descriptions, canonicals, keywords, robots directives, Open Graph tags, and Twitter cards for all public routes.
- Added reusable JSON-LD schema generation for Organization, Website, LocalBusiness, SportsActivityLocation, FAQPage, and BreadcrumbList.
- Integrated SEO updates centrally through the shared layout so route changes keep metadata synchronized.
- Added production-facing robots.txt, sitemap.xml, site.webmanifest, and multi-size favicon structure in public/.

## Contact Experience Upgrade

- Rebuilt Contact into a dedicated hospitality-style page with reusable components rather than a simple hero-and-cards surface.
- Added premium contact options, validated frontend enquiry form, location/map placeholder section, business hours, FAQ preview, social connect area, and stronger closing CTA.
- Kept the route frontend-only and prepared for future Google Maps and backend form integration.

## Production Readiness Review

- Collapsed the legacy page-facade routing layer so App imports the actual page modules directly.
- Removed orphaned template leftovers and dead code paths, including the unused design-system demo stub and template stylesheet.
- Tightened navbar cleanup behavior to avoid stale ref access during mobile menu teardown.
- Added a project architecture document in docs/architecture.md and refreshed the README for the current product state.

## Phase 3 Backend Foundation

- Created a dedicated backend workspace under backend/ using Node.js, Express, TypeScript, Prisma, PostgreSQL configuration, and Zod.
- Implemented production-grade backend architecture folders for config, controllers, routes, services, middlewares, repositories, validators, schemas, models, utils, types, constants, lib, database, prisma, docs, and tests.
- Added security and operations baseline: Helmet, CORS, compression, cookie parser, pino + pino-http logging, global rate limiter architecture, central error handling, and not-found middleware.
- Prepared auth/security primitives without implementing flows: JWT utility, password hashing utility, and strict environment validation via Zod.
- Added versioned API routing scaffold at /api/v1 with a health endpoint and centralized API response/error helpers.
- Initialized Prisma with PostgreSQL datasource wiring and validated/generate scripts, without adding domain models.
- Added Swagger/OpenAPI structure and docs/openapi.yaml bootstrap with /api-docs serving.
- Added backend linting, formatting, strict TypeScript configuration, and architecture documentation in backend/README.md.
- Completed verification pass: backend build succeeds, lint passes, Prisma validate/generate succeed, server starts, and GET /api/v1/health returns healthy response.

## Phase 3 Sprint 2 Database Architecture

- Designed a production-grade normalized PostgreSQL schema in backend/prisma/schema.prisma for admin access control, content, lessons, experiences, events, gallery, bookings, SEO, navigation, settings, and media.
- Implemented required core models: AdminUser, Role, Permission, Lesson, Experience, ExperienceCategory, Event, Booking, Coach, GalleryImage, GalleryCategory, ContactMessage, FAQ, Testimonial, Media, SiteSetting, SEOPage, Navigation, FooterLink.
- Added scalability entities and bridge tables for future growth: Locale, Beach, Location, AdminUserRole, RolePermission, LessonCoach, ExperienceBeach, and CoachBeach.
- Added lifecycle and publishing controls with consistent timestamps, soft deletes, status fields, visibility, and publish enums.
- Added indexing and constraints for performance and integrity (slug/email/status/date indexes, uniqueness rules, composite keys, and relation delete behaviors).
- Added architecture documentation in docs/database-architecture.md covering ERD overview, normalization strategy, relationship rationale, and migration strategy.

## Phase 3 Sprint 3 Authentication and Authorization Foundation

- Implemented admin authentication architecture with login, logout, refresh, and current-user routes under `/api/v1/auth`.
- Added secure JWT lifecycle with short-lived access tokens and rotating refresh tokens.
- Added server-side refresh session persistence (`AdminSession`) with revocation and expiry checks.
- Added RBAC foundations with role hierarchy middleware and permission middleware compatible with custom roles and permissions.
- Added auth-specific request validation with Zod and login/refresh throttling middleware architecture.
- Added standardized authentication error helpers for invalid credentials, unauthorized, forbidden, expired token, and inactive account.
- Added security-focused documentation in docs/authentication.md and authentication test folder structure in backend/tests/auth.

## Phase 3 Sprint 4 Admin Dashboard Foundation

- Created a dedicated admin application under admin/ with its own Vite + React + TypeScript + Tailwind setup.
- Implemented modular dashboard shell architecture with AdminLayout, Sidebar, Top Navigation, Breadcrumbs, User Menu placeholder, Search placeholder, Notifications placeholder, and Theme toggle architecture.
- Added responsive navigation behavior with mobile overlay and desktop collapse support for the sidebar.
- Built reusable admin UI primitives: StatCard, SectionCard, generic DataTable, EmptyState, PageHeader, ActionBar, StatusBadge, ConfirmDialog architecture, and SkeletonLoader.
- Built a premium Dashboard homepage with placeholder operational KPIs and recent activity for realistic day-to-day admin usage.
- Added route placeholders for all planned modules: Bookings, Lessons, Experiences, Events, Gallery, Coaches, Testimonials, FAQs, Media Library, Contact Messages, SEO, Settings, Users, Roles, and Audit Logs.
- Preserved sprint constraints: no CRUD modules, no backend integration, no lesson/event management features, and no authentication UI.

## Phase 3 Sprint 5 Reusable CMS Framework

- Established a dedicated reusable admin component system in admin/src/components/admin with shared primitives for layout, actions, forms, tables, states, and modal workflows.
- Added a global admin app state provider in admin/src/contexts/AdminAppContext.tsx to centralize user context, sidebar state, theme mode, notifications, and global loading behavior.
- Refactored active admin shell pages to consume reusable primitives, including dashboard, module placeholder pages, top navigation, and layout container composition.
- Added a configurable GenericDataTable abstraction with sorting, searching, selection, row actions, pagination, and server-pagination handoff messaging.
- Added form framework primitives (FieldBase, TextInput, TextareaInput, NumberInput, SelectInput, MultiSelectInput, SwitchInput, CheckboxInput, RadioGroupInput) with validation/help placeholders.
- Added reusable empty/loading/skeleton states and content placeholders for rich text, media upload, and advanced date/time controls.
- Introduced explicit admin design tokens for spacing, radius, shadows, type scale, and status colors to keep future modules visually consistent.
- Preserved sprint constraints: no business CRUD, no backend API integration, and no booking module implementation.

## Phase 3 Sprint 6 Event Management Module (Reference CMS Module)

- Delivered the first full CMS module across admin frontend and backend APIs for complete Event management lifecycle.
- Implemented Event admin pages for list, create, edit, view, delete, and duplicate flows under admin routes.
- Implemented reusable list workflow with search, sorting, filter controls, status slices, pagination model, bulk select, bulk publish, bulk unpublish, and bulk delete actions.
- Implemented reusable form workflow using Sprint 5 primitives with auto slug generation, image preview, character counters, autosave architecture, and unsaved-changes browser warning.
- Implemented backend Event REST APIs under `/api/v1/events` with strict request validation via Zod on params/query/body.
- Added Event service and repository layers with filtering, pagination, slug conflict protection, duplication logic, and response shaping.
- Implemented soft delete behavior for events and retained audit metadata through createdBy/updatedBy and timestamps.
- Extended Prisma Event model to include all production-ready event fields: media, category/difficulty/type, schedule, location/maps, pricing/currency, instructor, status/visibility, featured flag, and SEO metadata.
- Added public-site-ready response shaping (`publicCard`) for future consumption by the existing public Events page without redesign.
- Added module documentation in docs/event-module.md.

## Phase 3 Sprint 7 Generic Content Engine Foundation

- Introduced a reusable backend content engine under backend/src/content-engine with base repository, service, and controller abstractions.
- Added shared helper architecture for pagination, filtering, sorting, search clauses, slug generation, SEO normalization, publish workflow, soft delete, and audit metadata stamping.
- Standardized API envelopes by expanding backend/src/utils/api-response.ts with success, paginated, and error helpers, then aligned global error middleware to emit unified error shapes.
- Added reusable permission middleware composition through content-engine middleware helpers to keep route authorization patterns consistent across modules.
- Refactored the Event backend module to consume the content engine abstractions (repository/service/controller/route integration) while retaining Event-specific business operations.
- Added reusable admin content-engine composition components and page shells for generic list/editor workflows and shared sidebar panels.
- Refactored Event admin list and form pages to consume new generic list/editor building blocks as the reference integration.
- Added foundational architecture documentation in docs/content-engine.md with onboarding steps for future modules.
- Completed verification pass after integration:
	- Backend Prisma schema validation and client generation succeeded.
	- Backend TypeScript build and lint succeeded.
	- Admin TypeScript + Vite production build succeeded.

## Phase 3 Sprint 8 Media Library (Reusable Asset Infrastructure)

- Implemented a dedicated Media Management backend module with REST APIs:
	- `GET /media`
	- `POST /media/upload`
	- `GET /media/:id`
	- `PATCH /media/:id`
	- `DELETE /media/:id`
- Added upload pipeline using Multer memory storage, Sharp image processing, and Cloudinary provider integration architecture.
- Implemented image processing support for compression, auto-resize, thumbnail generation, WebP transformation, metadata extraction, and future AVIF extension readiness.
- Implemented security controls for uploads: mime whitelist, extension whitelist, executable signature rejection, and antivirus hook architecture.
- Extended Media data architecture with scalable first-class fields and indexes for large library operations (folderPath, tags, caption, usageCount, thumbnail/provider IDs).
- Added reusable admin Media Library page with multi-upload, grid/list view, preview/details panel, search/sort/filter, bulk select/delete, replace image, and copy URL/ID actions.
- Implemented infinite-scroll architecture in admin using paginated API fetching and `IntersectionObserver`.
- Created reusable Media Picker modal for future module reuse through centralized media selection workflows.
- Added Sprint 8 architecture and flow documentation in docs/media-library.md.
- Preserved sprint constraints:
	- No Lessons module implementation.
	- No Experiences module implementation.
	- No Gallery module implementation.
- Verification completed:
	- Backend Prisma validate/generate passed.
	- Backend TypeScript build and lint passed.
	- Admin TypeScript/Vite build passed.
	- Backend and admin dev servers booted successfully.
	- Cloudinary runtime hook verified (`isCloudinaryConfigured`) and currently reports local env credentials are not configured.

## Phase 3 Sprint 9 Lessons Management Module

- Delivered a complete lessons management module across backend APIs, admin CMS workflows, and public-site data hydration.
- Added backend lesson routes and controller/service/repository layers for list, view, create, update, delete, bulk publish, and bulk featured actions under `/api/v1/lessons`.
- Extended the Prisma lesson model with lesson management fields for short/long descriptions, cover image, difficulty, duration, price, max participants, instructor, featured flag, display order, and SEO metadata.
- Added lesson validation schemas for query params, create/update payloads, and bulk patch requests.
- Implemented admin lesson management screens for list, create, edit, and view flows with search/filter/sort/pagination and bulk actions.
- Switched the public lessons sections to load lesson data from the API instead of static fixtures.
- Verification completed:
	- Backend Prisma client generation succeeded.
	- Backend TypeScript build succeeded via `npm run build`.
	- Admin TypeScript/Vite production build succeeded via `npm run build`.
	- Public site TypeScript/Vite production build succeeded via `npm run build`.

## Phase 3 Sprint 10 Experience Management Module

- Delivered a complete experience management module across backend APIs, admin CMS workflows, and public-site experience data hydration.
- Added backend experience routes and controller/service/repository layers for list, view, create, update, delete, duplicate, bulk publish status, and bulk featured actions under `/api/v1/experiences`.
- Extended the Prisma Experience model with production-ready fields for short/full descriptions, cover image, gallery image URLs, category label, difficulty, recommended age, duration, max participants, pricing, instructor, featured flag, display order, linked lesson count, and SEO metadata.
- Added experience validation schemas for query params, create/update payloads, and bulk patch actions.
- Implemented one-to-many Experience-to-Lessons management through linked lesson selection in admin forms, with backend synchronization logic for assigning/unassigning lesson links.
- Implemented admin experience management screens for list, create, edit, and view flows with search/filter/sort/pagination, bulk actions, duplicate, autosave drafts, unsaved-changes warning, and preview placeholder readiness.
- Switched public experience listing/comparison sections to load experience content from the live backend API while preserving existing page design and layout.
- Verification completed:
	- Backend Prisma schema validation succeeded via `npm run prisma:validate`.
	- Backend Prisma client generation succeeded.
	- Backend TypeScript build succeeded via `npm run build`.
	- Admin TypeScript/Vite production build succeeded via `npm run build`.
	- Public site TypeScript/Vite production build succeeded via `npm run build`.

## Phase 3 Sprint 11 Booking Management System

- Delivered a complete booking workflow connecting public booking submission with backend APIs and admin booking operations.
- Implemented booking backend APIs under `/api/v1/bookings`:
	- `GET /bookings`
	- `GET /bookings/:id`
	- `POST /bookings`
	- `PATCH /bookings/:id/status`
	- `PATCH /bookings/:id`
- Added a public booking options endpoint (`GET /bookings/options`) to hydrate lesson/experience/event choices for the booking page without UI redesign.
- Added strict booking request validation using Zod for list/create/status/update payloads, including date and participant safeguards.
- Extended Prisma booking architecture with booking type, preferred time, emergency contact, assigned instructor, internal notes, and activity history records.
- Implemented booking activity history tracking for created, updated, status-changed, and cancelled transitions with timestamp and admin attribution.
- Added notification-preparation architecture placeholders for Email, WhatsApp, and SMS without implementing sending.
- Replaced static public booking submission logic with real backend integration:
	- Live option loading
	- Request-level validation handling
	- Success/failure states
	- Duplicate submission prevention
- Implemented admin booking module pages for list and detail management with search, filter, sort, pagination, status updates, instructor assignment, internal notes, and export placeholder action.
- Verification completed:
	- Backend Prisma client generation succeeded.
	- Backend Prisma schema validation succeeded.
	- Backend TypeScript build succeeded via `npm run build`.
	- Admin TypeScript/Vite production build succeeded via `npm run build`.
	- Public site TypeScript/Vite production build succeeded via `npm run build`.

## Phase 3 Sprint 12 Coaches Management Module

- Delivered a complete coaches management module across backend APIs, admin CMS workflows, and public-site coach data hydration.
- Expanded Prisma Coach architecture with profile/media, bio variants, specialization/languages/certifications arrays, social links, featured/display ordering, and SEO fields.
- Added future-ready coach relationship scaffolding with bridge models for Coach-to-Experience and Coach-to-Event assignments.
- Implemented coaches backend APIs under `/api/v1/coaches`:
	- `GET /coaches`
	- `GET /coaches/:id`
	- `POST /coaches`
	- `PUT /coaches/:id`
	- `DELETE /coaches/:id`
	- `POST /coaches/:id/duplicate`
	- `PATCH /coaches/status`
	- `PATCH /coaches/featured`
- Added strict coach request validation with Zod for list/create/update/id params and bulk patch workflows.
- Added RBAC permission `MANAGE_COACHES` and wired role defaults for admin/content/editor operations.
- Implemented admin coaches module pages for list, create, edit, and view flows with search/filter/sort/pagination, bulk actions, duplicate, autosave drafts, and unsaved-changes warning.
- Replaced static public coaches rendering with live backend coach data in home, about, experiences, and lessons coach sections while preserving existing UI composition and fallback behavior.
- Verification completed:
	- Backend Prisma schema validation succeeded via `npx prisma validate`.
	- Backend Prisma client generation succeeded via `npx prisma generate`.
	- Backend TypeScript build succeeded via `npm run build`.
	- Admin TypeScript/Vite production build succeeded via `npm run build`.
	- Public site TypeScript/Vite production build succeeded via `npm run build`.

## Phase 3 Sprint 13 Gallery Management Module

- Delivered complete gallery management across backend APIs, admin CMS workflows, and public Gallery page data hydration.
- Extended Prisma Gallery models for required operational fields:

## Phase 3 Sprint 14 Real Authentication and User Management

- Replaced admin mock authentication with real backend-driven authentication wiring using live `/api/v1/auth/login`, `/api/v1/auth/logout`, `/api/v1/auth/refresh`, and `/api/v1/auth/me` integration points.
- Switched the admin frontend auth context from localStorage mock state to access-token-in-memory plus HTTP-only refresh-cookie session restoration.
- Added backend user management APIs under `/api/v1/users` for list, view, and patch workflows with authentication and role protection.
- Extended backend auth schema for this sprint with `VIEWER` role support plus `avatar` and `mustChangePassword` fields on `AdminUser`.
- Added Prisma seed support for a default Super Admin account:
	- Email: `admin@surfmangalore.com`
	- Password: development seed password configured through `SEED_ADMIN_PASSWORD`
	- `mustChangePassword` initialized for future forced-password-change flow.
- Reworked the admin Users module to load database users from the backend and support view, edit, activate, deactivate, search, filter, and pagination against live APIs.
- Preserved sprint constraints by not modifying unrelated business modules or redesigning the admin UI shell.

## Sprint 14 Verification Status

- Backend TypeScript build succeeds via `backend/npm run build`.
- Admin TypeScript/Vite production build succeeds via `admin/npm run build`.
- Backend dev server boots successfully and `/api/v1/health` returns a healthy response.
- Admin dev server boots successfully with the new auth wiring.
- Prisma client generation succeeds after schema updates.
- Prisma migration and database seed are currently blocked because no PostgreSQL server is reachable at `localhost:5432` from this environment.
- Live login verification currently fails with a Prisma initialization error for the same reason; once PostgreSQL is available, rerun migration, seed, and auth verification.
	- `GalleryCategory`: short description, cover image, featured flag, SEO title/description.
	- `GalleryImage`: alt text, caption, photographer, tags, featured flag.
- Implemented gallery backend APIs under `/api/v1/gallery` with RBAC (`MANAGE_GALLERY`) and Zod validation:
	- `GET /gallery`
	- `GET /gallery/albums`
	- `GET /gallery/:id`
	- `POST /gallery`
	- `PUT /gallery/:id`
	- `DELETE /gallery/:id`
	- `POST /gallery/albums`
	- `PUT /gallery/albums/:id`
	- `DELETE /gallery/albums/:id`
- Added gallery module backend architecture with constants, types, validators, repository, service, controller, and route registration.
- Added admin Gallery module:
	- Image list management with search/sort/filter/pagination, bulk delete, bulk move between albums, set featured, and bulk upload.
	- Album management with create/edit/delete and publish/featured controls.
	- Image create/edit/view workflows with metadata editing and Media Library picker integration.
- Replaced static data on the public Gallery page with live backend-driven albums and images while preserving existing design language and lightbox behavior.
- Added lazy-loaded image rendering for gallery cards and lightbox display surfaces.
- Verification completed:
	- Backend Prisma schema validation succeeded via `npx prisma validate`.
	- Backend Prisma client generation succeeded via `npx prisma generate`.
	- Backend TypeScript build succeeded via `npm run build`.
	- Admin TypeScript/Vite production build succeeded via `npm run build`.
	- Public site TypeScript/Vite production build succeeded via `npm run build`.

## Phase 3 Sprint 14 Website Settings CMS

- Delivered a complete Website Settings CMS across backend API, admin UI, and public-site global content hydration without redesigning existing public layouts.
- Implemented settings backend module under `/api/v1/settings` with architecture-aligned files for constants, types, validator, repository, service, controller, and route wiring.
- Added required settings endpoints:
	- `GET /settings` for public/global settings retrieval.
	- `PUT /settings` for settings updates with request validation.
- Enforced edit permissions so only `SUPER_ADMIN` and `ADMIN` can update settings using existing auth middleware + role guard chain.
- Implemented a full admin Website Settings page at `/settings` (replacing placeholder) with tabbed CMS sections:
	- General
	- Homepage
	- Contact
	- Social Media
	- Navigation
	- Footer
	- SEO
	- Business Information
- Added settings API integration in admin via dedicated settings service and typed payload contracts.
- Added public global settings integration with fallback-safe defaults using a shared WebsiteSettings provider/context and public settings service.
- Replaced hardcoded global values in core public surfaces with CMS-driven values while preserving existing UI design:
	- Logo text/logo image fallback
	- Navbar menu items
	- Footer copy/contact/social/legal labels
	- Homepage hero banner/title/subtitle/CTAs/background image
	- Contact options and business-hours blocks
	- SEO runtime metadata author/site-name/default OG image fallback behavior
- Verification completed:
	- Backend TypeScript build succeeded via `npm run build`.
	- Admin TypeScript/Vite production build succeeded via `npm run build`.
	- Public site TypeScript/Vite production build succeeded via `npm run build`.

## Phase 3 Sprint 15 Admin Module Completion + Mock Authentication

- Replaced all remaining admin placeholder module routes with complete working UI pages, keeping the existing dashboard design system intact.
- Implemented full admin pages for:
	- Testimonials
	- FAQs
	- Contact Messages
	- SEO Manager
	- Users
	- Roles
	- Permissions
	- Audit Logs
	- Settings (runtime-stable, tabbed settings editor)
- Added production-quality module surfaces for each page including:
	- Page headers
	- Search
	- Filters
	- Toolbar actions
	- Data table/inbox layout
	- Empty states
	- Loading states
	- Responsive layout behavior
	- Pagination placeholders
	- Confirmation dialog placeholders
- Added a dedicated Permissions route and sidebar navigation entry so all management links are first-class and directly navigable.
- Implemented Contact Messages as inbox-style split layout with unread emphasis, message preview, reply placeholder, archive placeholder, and status filtering.
- Implemented SEO Manager controls for meta title/description, slug, canonical URL, Open Graph image, Twitter card mode, robots directives, and a live preview card.
- Implemented mock authentication architecture for admin flow:
	- New Login page with polished UI
	- Public-only `/login` route
	- Protected route wrapper for all CMS routes
	- Unauthenticated users redirected to Login
	- Authenticated users routed to Dashboard
	- Mock auth context persisted in local storage and structured for future JWT integration.
- Updated top navigation user control to support logout via the auth context.
- Route/status verification summary:
	- Sidebar links map to concrete route components (no placeholder pages used for requested modules).
	- Settings page loads through the real page component and retains full tab navigation.
	- Build passes with all new routes and imports resolved.
- Verification completed:
	- Admin `npm run dev` started successfully (Vite served on `http://localhost:5181/` in this session).
	- Admin `npm run build` succeeded via `tsc -b && vite build`.

## Phase 3 Sprint 16 Coaches Contract Alignment and Public Profile Completion

- Completed a focused Coaches-only sprint without touching Lessons, Experiences, Events, Gallery, Testimonials, or FAQ modules.
- Updated backend Coaches API contract and routing:
	- `GET /coaches`
	- `GET /coaches/:slug` (public)
	- `POST /coaches`
	- `PATCH /coaches/:id`
	- `DELETE /coaches/:id`
	- retained operational endpoints `POST /coaches/:id/duplicate`, `PATCH /coaches/status`, and `PATCH /coaches/featured`.
- Added Coaches schema coverage for requested fields with migration support:
	- `coverPhotoUrl`
	- `websiteUrl`
	- response shaping now includes active semantics (`active` derived from status), flattened social aliases, and public card cover image output.
- Added public slug-based Coach profile route and page rendering from live API data at `/coaches/:slug`.
- Added admin Coaches preview actions that open the public coach page, and aligned admin update calls to backend `PATCH` semantics.
- Added admin Coaches create/edit/view support for website URL and cover image URL, including media picker selection flow for profile and cover images.
- Added admin Coaches active/inactive controls for both single-row and bulk operations while keeping existing bulk publish/feature/delete workflows.
- Hardened public coach lists used by Home/About/Experiences sections to fetch published + active coaches from API, with featured-first ordering and display-order fallback.
- Added deterministic seed upserts for five sample coaches to support QA of create/edit/delete/preview/search/pagination/public rendering.
- Verification completed:
	- Prisma schema validation succeeded via `npm run prisma:validate`.
	- Prisma client generation succeeded via `npm run prisma:generate`.
	- Prisma migration `20260802141541_coaches_contract_alignment` created and applied successfully.
	- Seed execution succeeded via `npm run prisma:seed`.
	- Backend TypeScript build succeeded via `npm run build`.
	- Admin TypeScript/Vite build succeeded via `npm run build`.
	- Public TypeScript/Vite build succeeded via `npm run build`.

## Phase 3 Sprint 17 Content Ops Completion Pass

- Completed the shared content-ops pass for Testimonials, FAQs, Contact Messages, and media/gallery polish using the existing backend, admin, and public architecture.
- Added backend duplicate endpoints for Testimonials and FAQs so admin duplication now goes through live API routes instead of local state.
- Aligned contact-message handling with the requested admin vocabulary (`NEW`, `READ`, `REPLIED`, `ARCHIVED`) through service-layer translation while keeping the existing Prisma enum intact.
- Added duplicate-submission protection for public contact messages using a recent-submission conflict check.
- Replaced public FAQ/testimonial fetches so they request active, published content from the API and hide empty sections instead of falling back to mock data.
- Expanded the deterministic seed file with realistic Surf Mangalore data for coaches, testimonials, FAQs, contact messages, media, and gallery records.
- Preserved the existing content-engine, admin layout, tables, forms, modal/dialogs, toast system, loading states, and public component structure.
- Verification completed in this pass:
	- Targeted TypeScript/error checks passed for all edited backend, admin, and public files.
	- Prisma seed file typechecked after the new idempotent data upserts were added.
	- No unrelated module rewrites were introduced.

## Sprint 17 Known Limitations

- The contact-message status translation maps `READ` to the existing database value `IN_REVIEW` and `REPLIED` to `RESOLVED` to avoid a schema migration in this pass.
- The gallery/media area was polished through the existing media and gallery stack; no storage-provider migration was introduced.
- A full project-wide build/migration run still needs live PostgreSQL access in the target environment before final production verification.
