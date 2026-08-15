# Content Engine

## Purpose

Sprint 7 introduces a reusable content management engine that removes duplicated CRUD, filtering, pagination, sorting, publishing, and response-shaping logic from module-specific implementations.

The engine is intentionally module-agnostic and can be reused for Lessons, Experiences, Events, Gallery, FAQs, Testimonials, and future content modules.

## Scope Delivered In Sprint 7

- Reusable backend base layers:
  - `backend/src/content-engine/base/base-content.repository.ts`
  - `backend/src/content-engine/base/base-content.service.ts`
  - `backend/src/content-engine/base/base-content.controller.ts`
- Reusable backend helper architecture:
  - pagination/filter/sort/search helpers
  - slug generation helper
  - SEO normalization helper
  - publish workflow helper
  - soft delete helper
  - audit helpers
- Reusable permission integration helper:
  - `backend/src/content-engine/middlewares/content-permission.middleware.ts`
- Standard API envelope support:
  - `backend/src/utils/api-response.ts`
  - `backend/src/middlewares/error.middleware.ts`
- Reusable admin composition components:
  - `admin/src/components/admin/GenericListPage.tsx`
  - `admin/src/components/admin/GenericEditorPage.tsx`
  - `admin/src/components/admin/ContentHeader.tsx`
  - `admin/src/components/admin/ContentSidebar.tsx`
  - `admin/src/components/admin/PublishPanel.tsx`
  - `admin/src/components/admin/SEOSettingsPanel.tsx`
  - `admin/src/components/admin/MediaSelectorPlaceholder.tsx`
  - `admin/src/components/admin/RevisionInfoCard.tsx`
  - `admin/src/components/admin/ActivityTimelinePlaceholder.tsx`

## Backend Architecture

### 1) Base Repository Contract

`BaseContentRepository` defines the reusable persistence contract for module repositories:

- `findById`
- `listRaw`
- `create`
- `update`
- `softDelete`
- optional module-specific extensions (`findBySlug`, bulk operations, etc.)

Each module repository maps this contract to its Prisma model and include/select shape.

### 2) Base Service Layer

`BaseContentService` centralizes default content operations:

- list with pagination
- read by id
- remove (soft delete)

Module services plug in query composition through `buildListQuery` and keep only module-specific business rules (for example, event duplication and status patching).

### 3) Base Controller Factory

`createBaseContentController` generates standard handlers:

- list
- get by id
- create
- update
- remove

It accepts parser functions for query/body so each module can keep type-safe request mapping while sharing response + error behavior.

## Shared Helper Architecture

Shared helpers under `backend/src/content-engine/helpers` provide reusable domain behavior:

- `buildPagination` / `buildPaginationMeta`
- `buildSearchOrClause`
- `buildSorting`
- `buildQuickFilterWhere`
- `mergeWhereClauses`
- `generateUniqueSlug`
- `normalizeSeoInput`
- `resolvePublishWorkflow`
- `buildSoftDeleteUpdate`
- `withCreateAudit`, `withUpdateAudit`, `withBulkUpdateAudit`

This keeps feature modules focused on business vocabulary instead of infrastructure repetition.

## API Response Standard

All content routes should use standardized envelope helpers:

- `sendSuccess`
- `sendPaginated`
- `sendError`

Global error middleware now maps errors to stable error codes and routes all failures through the same response structure.

## Admin Generic Page Architecture

Sprint 7 adds reusable admin composition for content modules:

- `GenericListPage` for list screens with filters/actions/bulk actions
- `GenericEditorPage` for editor shell (main form + sidebar panels)
- sidebar panel primitives for publish settings, SEO, media, revisions, and activity timeline placeholders

This allows future modules to compose a complete CMS UI from shared building blocks instead of per-module page scaffolding.

## Data Flow

1. Request enters route with auth + permission middleware.
2. Controller (base-generated or module custom) parses request into typed query/body input.
3. Service composes list/query/publish/audit behavior using content-engine helpers.
4. Repository executes Prisma operations through base repository contract.
5. Response is returned through standardized success/paginated envelope.
6. Errors are normalized in global middleware through standardized error envelope.

## Module Plug-In Guide

To onboard a new module (for example Lessons):

1. Create module repository extending `BaseContentRepository`.
2. Create module service using `BaseContentService` for list/get/remove and add module-specific operations only when needed.
3. Build request validators and query types for the module.
4. Generate CRUD controllers using `createBaseContentController`.
5. Wire routes with `buildContentPermissionMiddlewares`.
6. Add admin list page using `GenericListPage` + `GenericDataTable`.
7. Add admin editor page using `GenericEditorPage` + sidebar panels.
8. Ensure all responses use `sendSuccess`/`sendPaginated` and error handling remains global.
9. Run verification gates.

## Verification Checklist

Run after integrating any module with the engine:

- Backend:
  - `npm run prisma:validate`
  - `npm run prisma:generate`
  - `npm run build`
  - `npm run lint`
- Admin:
  - `npm run build`

## Benefits Over Duplicated CRUD

- Lower maintenance cost: shared fixes apply to all modules.
- Consistent behavior: pagination/search/filter/sort semantics remain uniform.
- Faster module delivery: new modules focus on domain fields and policy, not infrastructure boilerplate.
- Stronger governance: standardized API envelopes and permission wiring reduce drift.
- Safer evolution: shared publish/audit/soft-delete semantics reduce regression risk across content domains.
