# Architecture Decisions

## 2026-07-13 - Separate Admin App Boundary

- Decision: Build admin in a dedicated admin/ app instead of embedding it into the public site routes.
- Why: Keeps public UX isolated, reduces accidental coupling, and allows independent deployment scaling later.
- Consequence: Shared design language is preserved through existing tokens, while app runtime and module ownership remain cleanly separated.

## 2026-07-13 - Dashboard-First Shell Before Feature Modules

- Decision: Build global admin layout and reusable primitives before any CRUD modules.
- Why: Future module teams can plug into a stable shell without reworking navigation, responsiveness, or accessibility foundations.
- Consequence: Sprint 4 ships placeholders only, but with production-grade component APIs and route architecture.

## 2026-07-13 - Placeholder-Driven Operational UI

- Decision: Use realistic placeholder metrics and activity patterns on dashboard home.
- Why: Validates IA, card density, and daily usability flow for business-owner usage without backend coupling.
- Consequence: Visual/interaction quality is testable now; data contracts can bind in later sprints with minimal layout changes.

## 2026-07-14 - CMS-First Component Architecture

- Decision: Introduce a dedicated admin/src/components/admin framework layer before any module CRUD implementation.
- Why: Prevents duplicated page-specific UI logic and creates a stable composition model for all future admin modules.
- Consequence: New module screens will be assembled from existing primitives, reducing variance and implementation time.

## 2026-07-14 - Global Admin UI State Through Context

- Decision: Add AdminAppContext as the single source of truth for shell-level UI state (sidebar, theme, notifications, loading, and current user stub).
- Why: Central state avoids prop drilling across layout/topbar/sidebar and keeps shell behavior consistent as module complexity grows.
- Consequence: Future feature stores can remain module-scoped while global shell concerns stay centralized.

## 2026-07-14 - Tokenized Visual Governance For Admin

- Decision: Define explicit admin design tokens for spacing, radius, shadows, type scale, and status tones in admin/src/index.css.
- Why: A token layer keeps UI coherent across independently delivered modules and simplifies future theming.
- Consequence: Component authors should consume token-backed utilities rather than introducing ad-hoc visual constants.

## 2026-07-14 - Event Module As CMS Reference Template

- Decision: Implement Events as a full vertical slice (frontend admin module + backend API + database mapping) before other feature modules.
- Why: Establishes a proven reference architecture for future CMS modules and reduces uncertainty in module delivery standards.
- Consequence: Future modules should mirror this route/controller/service/repository + reusable page/form/table composition approach.

## 2026-07-14 - Soft Delete As Default Operational Safety

- Decision: Event deletion is implemented as soft delete only.
- Why: Business owners need reversible operational actions and historical traceability.
- Consequence: Future restore endpoints can be added without data loss and existing list queries must continue filtering deletedAt = null.

## 2026-07-14 - Public-Ready Event Payload Shaping

- Decision: Event API responses include a publicCard projection alongside admin-focused fields.
- Why: Prepares seamless future public events page integration while avoiding a redesign or duplicate transform layer.
- Consequence: Public frontend integration can be accelerated with minimal API contract changes.

## 2026-07-14 - Engine-First CMS Module Strategy

- Decision: Build a generic content engine foundation before adding new CMS modules (Lessons, Experiences, Gallery, FAQs, Testimonials).
- Why: Avoids repeating CRUD, pagination, filtering, sorting, publish workflow, and audit logic in each module.
- Consequence: New modules must plug into shared base layers and helpers, reducing implementation variance and maintenance overhead.

## 2026-07-14 - Standardized API Envelope Across Content Modules

- Decision: Normalize content API responses through common success/paginated/error helpers.
- Why: Consistent contracts simplify frontend integration, global error handling, and operational observability.
- Consequence: Module controllers/services should return through the shared envelope utilities instead of custom ad-hoc response shapes.

## 2026-07-14 - Generic Admin Content Composition Over Page-Specific Scaffolding

- Decision: Introduce reusable list/editor page shells and sidebar panels for admin content modules.
- Why: Preserves UX consistency and eliminates repeated page infrastructure code when onboarding future modules.
- Consequence: Future module screens should compose from generic admin content components and reserve custom UI only for domain-specific fields.

## 2026-08-01 - Centralized Media Library As Mandatory Asset Source

- Decision: All CMS image assets are managed through a single Media Library pipeline rather than module-local uploads.
- Why: Eliminates duplicated upload/security logic and enforces one reusable media governance path for all future modules.
- Consequence: Future modules must integrate Media Picker and store media references, not raw direct-upload URLs.

## 2026-08-01 - Upload Processing Pipeline On Ingress

- Decision: Perform image validation, resizing, compression, and thumbnail generation at upload time.
- Why: Frontloads media normalization so downstream module rendering remains fast and consistent.
- Consequence: Stored assets are already optimized WebP variants and include deterministic metadata for scalable querying.

## 2026-08-01 - Provider Adapter Boundary For Storage Portability

- Decision: Encapsulate Cloudinary operations behind a dedicated library adapter.
- Why: Enables migration to other object storage providers (S3/R2/GCS) without route/service contract rewrites.
- Consequence: Storage migration becomes an infrastructure change rather than an application-wide feature refactor.

## 2026-08-01 - First-Class Folder/Tag Fields For Scalability

- Decision: Keep folder, tags, caption, and usage tracking as first-class Media fields with indexes instead of relying only on JSON metadata.
- Why: Thousands of media records require predictable query performance for filter-heavy admin workflows.
- Consequence: Media listing and filtering remain performant as catalog size grows and avoids JSON-path bottlenecks.
