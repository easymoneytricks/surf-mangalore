# Admin Design System

## Purpose

This document defines how to build future admin modules using the reusable CMS framework established in Sprint 5. The goal is consistent UX, faster implementation, and minimal visual drift.

## Core Principles

- Compose screens from shared primitives in admin/src/components/admin.
- Keep module logic separate from shell-level UI concerns.
- Reuse common form/table/modal/state patterns before introducing custom components.
- Prefer token-backed styling over arbitrary values.
- Maintain accessibility defaults (labels, focus states, keyboard-safe controls).

## Component Architecture

### Primary Namespace

All CMS primitives live in:

- admin/src/components/admin

Use the barrel export for most imports:

- admin/src/components/admin/index.ts

### Groups

- Layout and page composition:
  - PageContainer, PageHeader, SectionHeader, Breadcrumbs, ActionToolbar, FilterBar, SearchBar
- Buttons and controls:
  - PrimaryButton, SecondaryButton, DangerButton, IconButton
- Data presentation:
  - GenericDataTable, TableToolbar, Pagination, StatusBadge
- Form framework:
  - FieldBase, TextInput, TextareaInput, NumberInput, SelectInput, MultiSelectInput, SwitchInput, CheckboxInput, RadioGroupInput
- Modal framework:
  - modal/Modal, DeleteConfirmationDialog
- Cards and content blocks:
  - FormCard, SectionCard, InfoCard, DetailCard, FormSection, FormActions
- State and placeholders:
  - EmptyState, LoadingState, SkeletonTable, NoDataIllustration, RichTextPlaceholder, ImageUploaderPlaceholder, DatePickerPlaceholder, TimePickerPlaceholder, ImageUploadPlaceholder

## Naming Conventions

- Components:
  - Use PascalCase and suffix by role when useful (for example: SelectInput, DeleteConfirmationDialog).
- Props:
  - Prefer descriptive names: title, description, actions, validationMessage, helpText.
- Generic utilities:
  - Keep generic primitives neutral and module-agnostic.
- Styling:
  - Prefer token-linked classes and existing utility patterns used by admin-card and admin-surface.

## Design Rules

### Token Usage

Admin token definitions are in admin/src/index.css under :root.

Use these tokens for consistency:

- Spacing: --admin-space-* 
- Radius: --admin-radius-* 
- Elevation: --admin-shadow-* 
- Type scale: --admin-font-size-* 
- Semantic status colors: --admin-status-success/warning/danger/info

### Surface Patterns

- Use admin-surface for shell containers (sidebar/topbar overlays).
- Use admin-card for module content panels and block-level groupings.
- Keep cards visually breathable with consistent internal spacing.

### Interaction Patterns

- Buttons:
  - PrimaryButton for main actions, SecondaryButton for neutral actions, DangerButton for destructive workflows.
- Modal flows:
  - Use Modal as the base and specialized wrappers for confirmations.
- Table flows:
  - Prefer GenericDataTable for list pages and use rowActions and selectable when needed.
- Form flows:
  - Wrap controls with FieldBase or existing input components to preserve labels/help/error behavior.

## Global State Architecture

Shell-level state is managed by:

- admin/src/contexts/AdminAppContext.tsx

Current responsibilities:

- Current admin user placeholder
- Sidebar collapse and mobile visibility
- Theme mode state
- Notification list placeholders
- Global loading toggle

Rules:

- Keep shell state in AdminAppContext.
- Keep module/domain state local to pages/hooks until backend integration sprints.
- Avoid introducing competing global stores unless required by cross-module behavior.

## Module Implementation Checklist

When creating a new admin module page:

1. Start with PageHeader and SectionCard blocks.
2. Use ActionToolbar for top-level filters/actions.
3. Use GenericDataTable for list views.
4. Use FormCard + FormSection + form inputs for create/edit scaffolds.
5. Use EmptyState and LoadingState for non-happy paths.
6. Use Modal/DeleteConfirmationDialog for destructive interaction patterns.
7. Keep visual values token-based via admin/src/index.css.

## What Not To Do

- Do not create module-specific button styles when Primary/Secondary/Danger variants are sufficient.
- Do not bypass shared form/table primitives for standard CRUD-like screens.
- Do not embed backend-specific API assumptions in reusable components.
- Do not duplicate shell controls that already exist in layout/top navigation.

## Future Extensions

Planned enhancements for later sprints:

- Integrate real API data bindings into table/form workflows.
- Add richer field adapters (date picker, media picker, rich text editor implementation).
- Add module-level permission-aware UI wrappers.
- Add accessibility audit checklist automation for admin modules.
