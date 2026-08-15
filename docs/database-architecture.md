# Surf Mangalore Database Architecture (Sprint 2)

## Scope

This document defines the production-grade relational database architecture for the Surf Mangalore backend using Prisma ORM on PostgreSQL.

This sprint intentionally covers schema design only:

- No API implementation
- No CRUD handlers
- No authentication flows
- No admin UI
- No seed data
- No migrations applied yet

## ERD Overview

The schema is organized into six bounded sections:

1. Shared scalability entities (`Locale`, `Beach`, `Location`)
2. Access control (`AdminUser`, `Role`, `Permission`, join tables)
3. Experience domain (`Experience`, `Lesson`, `Event`, `Coach`, `Booking`)
4. Media and gallery (`Media`, `GalleryCategory`, `GalleryImage`)
5. Website content blocks (`ContactMessage`, `FAQ`, `Testimonial`)
6. Configuration and SEO (`SEOPage`, `SiteSetting`, `Navigation`, `FooterLink`)

## Why Each Model Exists

### Shared scalability entities

- `Locale`: Future multilingual readiness across SEO, navigation, gallery, FAQ, and testimonials.
- `Beach`: Supports multi-beach expansion for lessons, experiences, events, bookings, and media.
- `Location`: Supports non-beach event venues and future multi-location operations.

### Access control

- `AdminUser`: Staff identities with lifecycle and soft-delete support.
- `Role`: Grouped privilege bundles for future admin dashboard control.
- `Permission`: Fine-grained action-resource permissions.
- `AdminUserRole`: Many-to-many user-role assignment.
- `RolePermission`: Many-to-many role-permission mapping.

### Experience domain

- `ExperienceCategory`: Categorizes experience offerings.
- `Experience`: Parent container for productized surf experiences.
- `Lesson`: Concrete lesson offerings linked to experiences.
- `Coach`: Instructor profiles and credentials.
- `LessonCoach`: Many-to-many mapping for multiple instructors per lesson.
- `ExperienceBeach`: Many-to-many mapping for experiences available across beaches.
- `CoachBeach`: Many-to-many mapping for coaches active across beaches.
- `Event`: Time-bound sessions and public events.
- `Booking`: Unified booking record supporting lessons, experiences, and events.

### Media and gallery

- `Media`: Central asset library for files and metadata.
- `GalleryCategory`: Groups gallery visuals by storytelling theme.
- `GalleryImage`: Presentation-layer records referencing canonical media assets.

### Website content blocks

- `ContactMessage`: Inbound lead and contact communication history.
- `FAQ`: Structured Q/A content block with publication controls.
- `Testimonial`: Social proof entries with optional coach and booking linkage.

### SEO and site configuration

- `SEOPage`: Route-level SEO and structured data payloads.
- `SiteSetting`: Typed key-value settings for operational configurability.
- `Navigation`: Recursive menu tree for header/sidebar structures.
- `FooterLink`: Footer information architecture and grouped links.

## Core Relationships

- `ExperienceCategory 1 -> N Experience`
- `Experience 1 -> N Lesson`
- `Lesson N <-> N Coach` via `LessonCoach`
- `Experience N <-> N Beach` via `ExperienceBeach`
- `Coach N <-> N Beach` via `CoachBeach`
- `Event 1 -> N Booking`
- `Lesson 1 -> N Booking`
- `Experience 1 -> N Booking`
- `GalleryCategory 1 -> N GalleryImage`
- `Media 1 -> N GalleryImage`
- `AdminUser 1 -> N createdBy / updatedBy` across content models
- `Role N <-> N Permission` via `RolePermission`
- `AdminUser N <-> N Role` via `AdminUserRole`

## Normalization Decisions

1. Access control is fully normalized through join tables rather than embedded permission arrays.
2. Cross-cutting location dimensions are separated into `Beach` and `Location` to avoid duplicated address data.
3. Coaches and lessons use a normalized many-to-many relation for multi-instructor scheduling.
4. Media is centralized, while gallery presentation is separated for flexible curation.
5. SEO is detached from page content to support independent optimization workflows.
6. Site settings use typed columns plus JSON for flexibility while retaining queryability.

## Status, Lifecycle, and Soft Delete Strategy

- Content entities include publication and visibility controls where relevant.
- Operational entities include status fields and timestamps.
- Soft delete is implemented with `deletedAt` for auditability and recoverability.
- Indexes are added on lifecycle fields (`status`, `deletedAt`, `publishStatus`, date fields).

## Scalability Readiness

### Multiple beaches

- Supported through `Beach` and bridge tables (`ExperienceBeach`, `CoachBeach`) plus direct links for lessons/events/bookings.

### Multiple instructors

- Supported through `LessonCoach` many-to-many.

### Multiple lesson packages

- Supported by separating `Experience` (package-level) from `Lesson` (delivery-level).

### Multiple event locations

- Supported through nullable `locationId` and reusable `Location` records.

### Multiple languages (future-ready)

- Supported through `Locale` and locale-linked models for SEO/navigation/content surfaces.

### Future payments and coupons

- `Booking` includes payment status and payment reference snapshot fields to introduce payment entities later without breaking booking history.

### Future multiple admins

- Fully supported with RBAC model (`AdminUser`, `Role`, `Permission` and join tables).

## Indexing and Constraints Strategy

- Unique constraints on identity and lookup fields: `uuid`, `slug`, `email`, `settingKey`, and route-locale SEO uniqueness.
- Composite uniqueness for ACL definitions: `Permission(resource, action)`.
- Date indexes for operational queries: bookings and event timelines.
- Soft-delete-aware query performance through `deletedAt` indexing.
- Controlled referential actions:
  - `Cascade` on pure join tables
  - `SetNull` for creator/updater references and historical links
  - `Restrict` for parent records that should not be dropped while active children exist

## Future Migration Strategy

1. Freeze this baseline schema and run the first migration once reviewed.
2. Add migration groups per domain (`auth`, `content`, `commerce`, `analytics`) to keep history understandable.
3. Introduce payment and coupon entities in additive migrations linked by `Booking.id` and immutable snapshots.
4. Add translation tables selectively where field-level localization is required beyond locale-scoped records.
5. Add partitioning/archive strategy for high-volume `Booking` and `ContactMessage` tables once growth demands it.

## Operational Notes

- Use Prisma migrations only after production review and signoff.
- Add seed scripts in a separate sprint.
- Keep schema changes additive and backward compatible for API stability.