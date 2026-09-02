# Surf Mangalore — Final Production Deployment Guide

This guide describes deployment of the existing Surf Mangalore applications. It does not create new Vercel projects or replace the approved application architecture.

## 1. Architecture

```text
Browser ──> Public Vercel (Vite) ──┐
                                   ├──> Backend Vercel (Express /api/v1) ──> Supabase PostgreSQL
Browser ──> Admin Vercel (Vite) ───┘                         ├──> Cloudinary (media)
                                                             └──> SMTP (email)
```

- Public: https://surf-mangalore.vercel.app/
- Admin: https://surfmangalore-admin.vercel.app/
- Backend: https://surfmangalore-backend.vercel.app/
- Local PostgreSQL data in `.local-db/` is development-only and is never required in production.
- GitHub pushes trigger the existing Vercel projects.

## 2. Repository and local development

`frontend` is the repository root, `admin/` is the admin Vite app, and `backend/` is the Express/Prisma API. Important files are each app's `package.json`, `vercel.json`, `backend/prisma/schema.prisma`, and `backend/prisma/migrations/`.

```powershell
npm install
Set-Location backend; npm install; npm run prisma:generate; npm run dev
# in separate terminals
npm run dev
Set-Location admin; npm install; npm run dev
```

Local frontend/admin variables belong in ignored `.env.local` files. Local backend variables belong in ignored `backend/.env`; use `backend/.env.example` as the template and point `DATABASE_URL` at local PostgreSQL.

## 3. Database and migrations

Prisma uses PostgreSQL. Runtime uses `DATABASE_URL`; migrations use `DIRECT_URL` through the datasource's `directUrl` setting. For Supabase, use the transaction pooler URL (usually port 6543 with `pgbouncer=true&connection_limit=1`) for runtime and the Supabase direct/session connection (usually port 5432) for migration administration.

Fresh database sequence:

```powershell
Set-Location backend
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
# Only for a non-production development database:
$env:NODE_ENV = 'development'; $env:SEED_ADMIN_PASSWORD = '<strong-development-password>'; npm run prisma:seed
```

Never run `prisma migrate reset`, `db push`, `DROP DATABASE`, `DROP SCHEMA`, or `pg_restore --clean` against production. The development seed is not a production data import.

Before production migration, take a backup and run `npm run prisma:migrate:status` with the production `DIRECT_URL`. Apply only committed migrations with `npm run prisma:migrate:deploy`.

## 4. Supabase migration and data safety

Inspect the existing Supabase schema and application records before importing anything. Migrations change schema; seeds bootstrap idempotent system records. Do not overwrite newer production users, bookings, contact messages, or audit logs with the local database. If application content must be transferred, export only the approved content tables using a controlled, reviewed import. Do not touch Supabase `auth` or `storage` schemas.

### Current local verification (2026-09-02)

The local database is reachable at `localhost:5433`; Prisma reports all 5 committed migrations applied and the schema up to date. Non-secret application counts are: AdminUser 3, Role 9, Permission 76, RolePermission 286, Booking 10, ContactMessage 8, AuditLog 131, Lesson 11, Experience 15, Event 13, Coach 11, GalleryImage 25, Media 25, Testimonial 10, FAQ 16, SEOPage 4, and SiteSetting 1. Join tables and remaining CMS tables were also inspected. This is an inventory only; no production transfer has been performed.

The ignored `backend/.env` is currently configured with local runtime and Supabase migration endpoints. No production migration or synchronization was executed; production records must be preserved and any transfer performed only after backup and reviewed merge planning.

### Supabase verification (2026-09-02 retry)

The configured Supabase direct connection was reachable over SSL. Prisma reported all 5 migrations applied and the schema up to date. Supabase currently contains 8 bookings, 6 contact messages, 101 audit logs, 287 role-permission rows, and 58 sessions; the local authoritative database contains 10, 8, 131, 286, and 68 respectively. Content counts match for the inspected CMS tables, but the transactional differences mean production cannot be replaced by the local database without a reviewed merge. A `pg_dump` attempt timed out from this workstation, so no automatic Supabase backup was created.

Backup example (run with `pg_dump` installed and a password supplied interactively or through a secure session):

```powershell
$backup = Join-Path $env:USERPROFILE ('SurfMangalore-backups\surfmangalore-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.dump')
pg_dump --format=custom --no-owner --file $backup $env:DIRECT_URL
```

Restore only after confirming the target and backup, with an explicit table/schema plan. Keep backups outside this repository; `.dump`, `.backup`, `.sql`, and `backups/` are ignored.

## 5. Environment variables

### Backend Vercel project

| Variable | Required | Secret | Purpose |
|---|---:|---:|---|
| NODE_ENV | Yes | No | `production` |
| PORT, API_PREFIX, API_VERSION | Yes | No | Server/listener and API path |
| DATABASE_URL | Yes | Yes | Supabase runtime pooler URL |
| DIRECT_URL | Yes for Prisma operations | Yes | Supabase direct/session URL |
| ALLOWED_ORIGINS, FRONTEND_ORIGIN, ADMIN_ORIGIN, PUBLIC_SITE_URL | Yes | No | HTTPS CORS and links |
| JWT_ACCESS_SECRET, JWT_REFRESH_SECRET | Yes | Yes | Separate signing secrets |
| JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_ISSUER, JWT_AUDIENCE | Yes | No | Token policy |
| AUTH_COOKIE_NAME, AUTH_COOKIE_SECURE, AUTH_COOKIE_SAME_SITE, REFRESH_TOKEN_COOKIE_MAX_AGE_MS | Yes | No | Secure refresh cookie |
| AUTH_LOGIN_WINDOW_MS, AUTH_LOGIN_MAX_ATTEMPTS, AUTH_REFRESH_WINDOW_MS, AUTH_REFRESH_MAX_ATTEMPTS | Yes | No | Auth throttling |
| RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX, LOG_LEVEL | Yes | No | API protection/logging |
| CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER_PREFIX | If media uploads enabled | API secret is | Media storage |
| SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_NAME, SMTP_FROM_EMAIL, SMTP_ADMIN_EMAIL, SMTP_REPLY_TO | Optional if DB settings are used | Password is | Environment fallback email config |
| RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY | Optional if DB settings are used | Secret key is | CAPTCHA fallback config |
| MEDIA_ENABLE_AV_SCANNING | No | No | Upload scanning toggle |

Set SMTP and reCAPTCHA primarily in Admin → Settings; secrets are stored server-side and never returned to browsers.

### Public Vercel project (repository root)

| Variable | Required | Example |
|---|---:|---|
| VITE_API_BASE_URL | Yes | `https://surfmangalore-backend.vercel.app/api/v1` |
| VITE_SITE_URL | Yes | `https://surf-mangalore.vercel.app` |
| VITE_SUPPORT_WHATSAPP, VITE_PUBLIC_PHONE | Optional | Business contact values |

### Admin Vercel project (`admin/`)

| Variable | Required | Example |
|---|---:|---|
| VITE_API_BASE_URL | Yes | `https://surfmangalore-backend.vercel.app/api/v1` |
| VITE_PUBLIC_SITE_BASE_URL | Yes | `https://surf-mangalore.vercel.app` |

Do not put backend secrets, database URLs, SMTP passwords, Cloudinary secrets, or reCAPTCHA secret keys in either frontend project.

## 6. Vercel configuration and deployment

Use the existing projects with root directories `.`, `admin`, and `backend`. The backend uses `backend/vercel.json` and `api/index.ts`; its build runs Prisma generate and TypeScript compilation. Configure the variables above in each project's Production environment, then deploy through GitHub:

```powershell
git status
git add <reviewed-files>
git commit -m "Prepare Surf Mangalore for production deployment"
git push
```

After deployment, run Prisma migration administration from a secure shell using `DIRECT_URL`; Vercel does not run migrations automatically.

## 7. CORS and authentication

Production allowed origins are exactly `https://surf-mangalore.vercel.app` and `https://surfmangalore-admin.vercel.app` (plus an explicitly approved custom domain). Browser requests use credentials. Refresh tokens are HttpOnly cookies; production requires `AUTH_COOKIE_SECURE=true` and HTTPS. Do not weaken CORS or cookie settings to solve a deployment issue.

## 8. SMTP, reCAPTCHA, and Cloudinary

After deployment:

1. Admin → Settings → Email: enter SMTP host, port/security, username/password, sender name/address, reply-to, and admin notification address. Use **Send Test Email** and confirm delivery.
2. Admin → Settings → Security: enter the reCAPTCHA site key and secret key, enable it, and register `surf-mangalore.vercel.app` (and any configured custom domain) in the provider console.
3. Configure the three Cloudinary values only in the backend Vercel project. Verify a small Media Library upload and retrieval.

Booking-status, contact-reply, and admin notification emails include HTML and plain-text fallbacks. SMTP failure must not falsely mark a contact reply as sent.

## 9. Verification checklist

- Backend health: `/api/v1/health` returns 200 and `prismaClientReady: true`.
- Public: homepage, lessons, experiences, events, gallery, contact/reCAPTCHA, booking, PDF confirmation, sitemap and robots.
- Admin: login/refresh, dashboard, users, roles, permissions, bookings, all content modules, settings, SMTP test, reCAPTCHA, contact messages/reply/archive/read, media, profile/password, audit logs and pagination.
- Database: migration status, required roles/permissions/settings, and no unintended data replacement.
- Email: SMTP test, contact notification, customer reply, and booking confirmed/completed/cancelled templates.
- Security: no secrets/local DB/dumps in Git, HTTPS cookies, strict CORS, rotated credentials, backups, least-privilege roles.

## 10. Rollback and future workflow

Rollback application code through the existing Vercel deployment history or Git revert. Restore database data only from a verified backup with a reviewed, table-scoped procedure; never reset production. Normal updates are: develop locally → test all three builds → create/verify Prisma migration when needed → commit/push → deploy → run `prisma migrate deploy` → smoke test.

## 11. Current repository safety notes

`.env`, `.env.*` (except `.env.example`), `.local-db/`, build output, logs, Vercel metadata, uploads, temporary files, and database dumps are ignored. Prisma migration SQL remains explicitly tracked. No production Supabase import was performed by this preparation pass; inspect and approve the target database before transferring content.
