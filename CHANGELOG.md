# Changelog

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
