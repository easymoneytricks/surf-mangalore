# Media Library

## Sprint 8 Objective

Sprint 8 delivers a standalone, enterprise-grade Media Library as reusable CMS infrastructure.

This sprint intentionally does not implement Lessons, Experiences, or Gallery module features.

## Core Architecture

### Backend Layer

- Route: `GET /media`, `POST /media/upload`, `GET /media/:id`, `PATCH /media/:id`, `DELETE /media/:id`
- Controller: `backend/src/controllers/media.controller.ts`
- Service: `backend/src/services/media.service.ts`
- Repository: `backend/src/repositories/media.repository.ts`
- Validators: `backend/src/validators/media.validator.ts`
- Upload middleware: `backend/src/middlewares/media-upload.middleware.ts`

### Storage Layer

- Cloud provider: Cloudinary
- Runtime integration file: `backend/src/lib/cloudinary.ts`
- Logical folder architecture: `CLOUDINARY_FOLDER_PREFIX/{folderPath}/{year}/{month}`
- Stored media format: optimized WebP (plus generated WebP thumbnail)

### Processing Layer

- Processor file: `backend/src/services/media-processing.service.ts`
- Pipeline:
  1. decode + inspect image metadata
  2. validate dimensions
  3. resize to max bounds
  4. compress to WebP
  5. generate thumbnail WebP
- Future-ready flag for AVIF is stored in metadata (`supportsFutureAvif: true`) to support a non-breaking extension path.

### Security Layer

- Security service file: `backend/src/services/media-security.service.ts`
- Enforced controls:
  - mime whitelist
  - extension whitelist
  - executable signature rejection (`MZ`, `ELF`, Mach-O checks)
  - optional antivirus hook (`MEDIA_ENABLE_AV_SCANNING=true`)
- AV hook is currently a safe no-op extension point and can be connected to ClamAV or SaaS scanning without route contract changes.

## Database Flow

Media uses the Sprint 2 `Media` model and extends it with scalable querying fields:

- `folderPath` for indexed folder filtering
- `tags` for indexed logical categorization support
- `caption` for editorial metadata
- `usageCount` for reusable consumption tracking
- `thumbnailPath`, `cloudinaryPublicId`, `cloudinaryThumbId` for lifecycle operations

Upload flow:

1. client sends multipart files to `POST /media/upload`
2. multer stores files in memory buffers
3. security service validates signature + file type
4. sharp produces optimized image + thumbnail
5. cloudinary uploads both variants
6. prisma persists media record with searchable metadata and audit fields
7. standardized API response returns reusable media entity

Replace flow (`PATCH /media/:id` with `file`):

1. same validation + processing pipeline
2. new assets uploaded
3. old Cloudinary assets are cleaned up by public ID (best effort)
4. same media ID is retained so existing references can keep pointing to one stable media entity

## Admin Media Library UI

Entry route: `/media-library`

Implemented features:

- multi-image upload
- grid/list view switch
- detail side panel with preview and metadata
- search
- sort
- filter by folder/tag
- bulk select + bulk delete
- single delete
- replace image
- copy public URL
- copy image ID
- infinite-scroll architecture via `IntersectionObserver`

Reusable media picker:

- component: `admin/src/components/admin/MediaPickerModal.tsx`
- wrapper trigger: `admin/src/components/admin/MediaSelectorPlaceholder.tsx`
- designed for future module adoption (lesson cover, coach photo, hero image, event banner, gallery references)

## Performance Strategy For Thousands Of Images

- server pagination (`page`, `pageSize`) with infinite-scroll fetching in admin
- indexed fields in Media model for common list filters and ordering
- transformed delivery assets (WebP + thumbnail) to reduce payload size
- metadata computed at upload time to avoid expensive runtime operations
- stable ID strategy during replacement to avoid cross-module reference churn

## Future Storage Migration Strategy

Current architecture isolates provider logic in `backend/src/lib/cloudinary.ts` and service-level upload orchestration.

To migrate from Cloudinary to S3/R2/GCS:

1. preserve API contracts and media entity response shape
2. replace provider adapter implementation behind upload/delete functions
3. keep `Media` record fields (`filePath`, `thumbnailPath`, provider IDs) as provider-agnostic URLs/keys
4. optionally run backfill script to rewrite legacy provider IDs

This keeps module consumers unchanged while storage infrastructure evolves.

## Verification Notes

Validated in Sprint 8:

- `npm run prisma:validate`
- `npm run prisma:generate`
- backend `npm run build`
- backend `npm run lint`
- admin `npm run build`
- backend dev server startup
- admin dev server startup

Cloudinary integration status is wired and runtime-checked through `isCloudinaryConfigured()`.
Current local environment reports `cloudinaryConfigured=false`, so upload endpoints are ready but require Cloudinary credentials to perform real uploads.
