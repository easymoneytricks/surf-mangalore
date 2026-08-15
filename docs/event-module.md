# Event Module

## Overview

Sprint 6 introduces the first fully integrated CMS module for Surf Mangalore.

This module provides:

- Admin UI for listing, creating, editing, viewing, deleting, and duplicating events.
- Backend REST APIs with strict Zod validation.
- Prisma-powered persistence with soft delete and audit metadata.
- Reusable table and form architecture aligned with Sprint 5 CMS framework.

## Architecture

### Backend Layers

- Route layer:
  - backend/src/routes/v1/events.routes.ts
  - Handles endpoint registration, auth permission guards, and request validation.
- Controller layer:
  - backend/src/controllers/event.controller.ts
  - Receives validated input and maps service output to standard API responses.
- Service layer:
  - backend/src/services/event.service.ts
  - Business logic: filtering, sorting, pagination, slug conflict checks, duplication behavior, and response shaping.
- Repository layer:
  - backend/src/repositories/event.repository.ts
  - Prisma query abstraction for list/find/create/update/soft-delete/bulk updates.
- Validation layer:
  - backend/src/validators/event.validator.ts
  - Zod schemas for params, query, create/update payloads, and bulk patch payloads.

### Frontend Layers

- Route integration:
  - admin/src/App.tsx
  - Adds events list/create/edit/view routes.
- Page layer:
  - admin/src/pages/events/EventsListPage.tsx
  - admin/src/pages/events/EventFormPage.tsx
  - admin/src/pages/events/EventViewPage.tsx
- Service layer:
  - admin/src/services/events.service.ts
  - admin/src/services/http.ts
  - Encapsulates API calls and auth-header handling.
- Types and utility:
  - admin/src/types/events.ts
  - admin/src/utils/slug.ts

## API Endpoints

Base path: /api/v1/events

- GET /
  - List events with search, filter, sort, and pagination.
- GET /:id
  - Fetch one event by id.
- POST /
  - Create a new event.
- PUT /:id
  - Update an existing event.
- DELETE /:id
  - Soft delete event (deletedAt + status update).
- POST /:id/duplicate
  - Duplicate event into draft copy with unique slug.
- PATCH /status
  - Bulk status updates (publishStatus and or eventStatus).
- PATCH /featured
  - Bulk featured toggle.

## Validation Rules

- Slug must be lowercase words separated by hyphens.
- End date must be greater than or equal to start date.
- Registration deadline must be less than or equal to start date.
- Discount price must not exceed price.
- Gallery images must be valid URLs.
- Bulk patch ids must be a non-empty array.

All validation executes on backend to ensure frontend input is never trusted.

## Database Flow

- Event schema expanded in backend/prisma/schema.prisma with:
  - Core event fields
  - Media fields (cover + gallery URL array)
  - Classification fields (category, difficulty, event type)
  - Scheduling fields (start, end, deadline, time labels)
  - Capacity and pricing fields
  - Publishing and visibility fields
  - SEO fields
  - Feature flag
  - Audit metadata (createdById, updatedById, createdAt, updatedAt)
- Soft delete strategy:
  - DELETE endpoint sets deletedAt and status = deleted.
  - Queries always scope to deletedAt = null.

## UX Features Implemented

- List page with:
  - Search
  - Quick filters (upcoming, past, featured, draft, published, cancelled)
  - Category and instructor filters
  - Bulk select
  - Bulk publish, unpublish, delete
  - Row actions (view, edit, duplicate, delete)
- Form page with:
  - Auto slug generation
  - Validation-friendly field layout
  - Image preview
  - Character counters
  - Autosave architecture (localStorage draft)
  - Unsaved changes browser warning
- View page with read-focused details and audit-oriented context.

## Public Website Readiness

The service response includes a publicCard block to ease future wiring with existing public events page without forcing a redesign.

## Future Improvements

- Add media library attachment flow replacing manual image URLs.
- Add explicit restore endpoint for soft-deleted events.
- Add server-side bulk delete endpoint to avoid client loop deletes.
- Add richer RBAC granularity for view, publish, and archive actions.
- Add integration tests for validation and repository behavior.
- Add event participant synchronization from future booking module.