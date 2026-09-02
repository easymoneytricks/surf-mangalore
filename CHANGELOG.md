# Changelog

## 2026-09-01 - Demo Dataset Expansion

- Expanded the existing Prisma seed to 10 lessons, 10 experiences with future availability slots, 10 fixed-schedule events, and 10 fictional coaches.
- Added deterministic coach relationships without changing the database schema or removing existing records.
- Fixed Event seed payload compatibility by removing the unsupported `displayOrder` field and audited all seeded fields against the Prisma schema.
- Added 15 stable remote Unsplash gallery images using the existing Media/GalleryImage upsert mechanism.

## 2026-09-01 - API Reliability Hardening

- Prevented normal read-only CMS traffic and health checks from exhausting the general API limiter while retaining mutation and authentication protection.
- Standardized limiter responses as JSON and hardened public/admin clients against non-JSON, 429, and temporary server failures without clearing valid admin sessions.

## 2026-09-01 - Homepage Content Limits

- Homepage Lessons and Testimonials now show up to six ordered records on larger screens and three on mobile.
- Homepage gallery now requests only three published, active, featured images in display order.
- Full Lessons and Gallery page consumers retain their existing service query sizes and ordering.

## 2026-09-01 - About and Experience Page Settings

- Added Admin Settings tabs for About and Experience Page content using the existing settings architecture.
- Replaced hard-coded public page copy/collections/images with settings-backed values and safe defaults without changing visual structure.
- Replaced raw JSON editing in Admin Settings with structured section forms, repeatable content controls, visibility/order inputs, and image previews while preserving the existing storage contract.
- Added structured Lesson Page and Event Page settings, including Event hero cards and Past Event Memories, without duplicating lesson/event product data or changing public layouts.
- Fixed settings save-state mismatch that dropped the new page groups from the backend response and crashed the active admin tab after saving.
- Added settings-driven Gallery Page hero content and image fallback without changing gallery item/media behavior or public layout.
- Added public `/privacy` and `/terms` legal pages with booking-specific wording, SEO metadata, and footer navigation while preserving the existing visual system.
- Fixed homepage Upcoming Experiences data source and imagery, and normalized About Community and Featured Event image rendering with safe fallbacks.
- Completed Contact Page settings integration, including configurable hero content/image, location details, and safe Google Maps embed rendering.
- Redesigned the Admin `/login` presentation with SurfMangalore branding, accessible password visibility control, and a focused sign-in form; authentication behavior is unchanged.

## 2026-09-01 - Booking Availability Shape Fix

- Normalized booking availability defensively at the public booking API adapter so legacy/non-array Lesson/Event values cannot trigger runtime errors.
- Kept availability semantics type-aware and added seeded published Lesson, Experience availability slots, and future Event demo records for QA.

## 2026-09-01 - Booking Semantics Correction

- Adapted booking steps and server validation for lesson reservations, configured experience slots, and fixed-schedule event tickets.
- Added Experience availability controls backed by existing metadata, server-side schedule and price authority, and type-prefixed references for new bookings.

## 2026-08-31 - Homepage Hero CMS and Admin Copy Follow-up

- Added the `homepage.heroDroneShotImageUrl` CMS setting with the existing Drone Shot asset retained as the default/fallback.
- Added the Hero Drone Shot Image URL control to Admin Settings > Homepage and validation to the existing settings API contract.
- Made the hero visual headline readable within the existing overlapping-card composition.
- Added the slug-based `View lesson` CTA to homepage lesson cards and updated the requested admin wording.

## 2026-08-01 - Phase 3 Sprint 8 Media Library Reusable Asset Infrastructure

- Added Media Management backend module with APIs for list, upload, detail, update/replace, and soft delete.
- Added Cloudinary integration adapter and provider abstraction points for future storage migration.
- Added Multer upload middleware and Sharp processing pipeline with compression, resize, thumbnail generation, and WebP conversion.
- Added upload security controls: mime/extension whitelist, executable signature rejection, and antivirus scanning hook architecture.
- Extended Media model for scalable operations with indexed folder/tags/usage and provider-reference fields.
- Added reusable admin Media Library page with:
	- multi-image upload
	- grid/list views
	- preview/details panel
	- search, sort, folder/tag filters
	- bulk select/delete
	- replace image
	- copy public URL and image ID
	- infinite scrolling architecture
- Added reusable Media Picker modal component for future module integrations.
- Added docs/media-library.md with upload flow, cloudinary/database architecture, and storage migration strategy.
- Verified Prisma validate/generate, backend build/lint, admin build, and runtime startup for backend/admin servers.

## 2026-07-14 - Phase 3 Sprint 7 Generic Content Engine Foundation

- Added a reusable backend content-engine layer under backend/src/content-engine with base repository/service/controller abstractions.
- Added shared helper modules for pagination, filtering, sorting, search, slug generation, SEO normalization, publish workflow resolution, soft delete updates, and audit metadata injection.
- Standardized API response envelopes through sendSuccess, sendPaginated, and sendError helpers, and aligned global error middleware to emit consistent error codes and payloads.
- Added reusable content permission middleware composition to centralize auth + permission wiring on module routes.
- Refactored Event backend repository/service/controller/routes to consume content-engine abstractions while preserving Event-specific operations.
- Added reusable admin generic content components and page shells (GenericListPage, GenericEditorPage, and content sidebar panels).
- Refactored Event admin list and editor pages to use the reusable generic content-engine UI composition.
- Added docs/content-engine.md with architecture overview, data flow, module plug-in guide, and verification checklist.
- Verified integration with backend Prisma validate/generate, backend build/lint, and admin production build.

## 2026-07-14 - Phase 3 Sprint 6 Event Management Module

- Added complete Event Management CMS module as the first full reference implementation for future modules.
- Added backend Event API architecture with routes, controllers, services, repositories, and Zod validators.
- Added Event endpoints: list, detail, create, update, delete (soft), duplicate, bulk status patch, and bulk featured patch.
- Expanded Prisma Event schema with production-ready CMS fields for media, categorization, scheduling, pricing, publishing, and SEO.
- Implemented soft delete strategy and audit continuity through createdBy/updatedBy ownership fields.
- Added admin Event module routes and pages for list, create, edit, and view workflows.
- Added table capabilities for search, sort, filters, pagination, bulk selection, and bulk actions.
- Added form capabilities for auto-slug generation, image preview, counters, autosave architecture, and unsaved-changes warning.
- Added API client and Event service layer in admin for backend integration.
- Added event module documentation in docs/event-module.md.

## 2026-07-14 - Phase 3 Sprint 5 Reusable CMS Framework

- Added a reusable CMS component framework under admin/src/components/admin for layout blocks, actions, forms, tables, modal/dialog flows, and state surfaces.
- Added AdminAppContext architecture in admin/src/contexts/AdminAppContext.tsx to standardize global admin UI state (user, sidebar, theme, notifications, loading).
- Refactored dashboard and module placeholder pages to consume shared framework primitives instead of page-specific component implementations.
- Added GenericDataTable foundation with sorting, search filtering, row selection, pagination, and row-level action composition for future module screens.
- Added form framework controls and placeholders to establish module-authoring standards before any CRUD implementation.
- Introduced admin design tokens in admin/src/index.css for spacing, radii, elevation, typography scale, and semantic status colors.
- Verified admin TypeScript build and diagnostics after integration.

## 2026-07-13 - Phase 3 Sprint 4 Admin Dashboard Foundation

- Added a separate admin React + TypeScript + Vite application under admin/.
- Implemented modular admin layout with sidebar, top navigation, breadcrumbs, user menu placeholder, search placeholder, notifications placeholder, and theme toggle architecture.
- Added responsive sidebar behavior with mobile overlay and desktop collapse support.
- Built reusable dashboard components: StatCard, SectionCard, generic DataTable, EmptyState, PageHeader, ActionBar, StatusBadge, ConfirmDialog architecture, and SkeletonLoader.
- Created dashboard homepage with placeholder KPI cards and recent activity table for daily operational context.
- Added route placeholders for all planned admin modules (Bookings, Lessons, Experiences, Events, Gallery, Coaches, Testimonials, FAQs, Media Library, Contact Messages, SEO, Settings, Users, Roles, Audit Logs).
- Preserved no-feature policy for this sprint: no CRUD, no backend integration, no booking/event management logic.
- 2026-09-01: Linked homepage experience previews to live detail routes, made booking support contact settings-driven, improved confirmation PDF presentation, protected SUPER_ADMIN accounts/role, and strengthened shared modal readability.
- 2026-09-02: Corrected audit-log date filter contract and safe validation messaging; clarified actor input and permissions empty-state wording.
- 2026-09-02: Standardized admin filter labels, updated Pages/dashboard/users/permissions wording, and added profile and provisioning-notes modal UX.
- 2026-09-02: Added development-only safe Admin API diagnostics and removed duplicate Audit Logs pagination rendering.
