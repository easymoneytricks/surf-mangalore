# Deployment Guide

## Target Architecture

One GitHub repository: `SurfMangalore`.

Create three Vercel projects from that repository:

| Project | Vercel Root Directory | Framework | Build Command | Output |
| --- | --- | --- | --- | --- |
| Public website | `.` | Vite | `npm run build` | `dist` |
| Admin CMS | `admin` | Vite | `npm run build` | `dist` |
| Backend API | `backend` | Other / Node.js | `npm run build` | Vercel serverless function in `api/index.ts` |

The backend Vercel project uses `backend/vercel.json` to route requests, including `/api/v1/*`, to the existing Express application. Do not deploy `src/server.ts` as the Vercel entrypoint; it is for long-running local or container processes and calls `app.listen`.

- Database: Supabase PostgreSQL
- Media: Cloudinary

## Environment Separation

Use separate environment values for each stage:

- development
- staging
- production

Never reuse production secrets in development.

## Required Environment Variables

### Backend Vercel Project (`backend`)

Required:

- `NODE_ENV` (`development` | `test` | `production`)
- `PORT`
- `API_PREFIX`
- `API_VERSION`
- `DATABASE_URL`
- `FRONTEND_ORIGIN`
- `ADMIN_ORIGIN`
- `PUBLIC_SITE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `AUTH_COOKIE_NAME`
- `AUTH_COOKIE_SECURE`
- `AUTH_COOKIE_SAME_SITE`
- `REFRESH_TOKEN_COOKIE_MAX_AGE_MS`
- `AUTH_LOGIN_WINDOW_MS`
- `AUTH_LOGIN_MAX_ATTEMPTS`
- `AUTH_REFRESH_WINDOW_MS`
- `AUTH_REFRESH_MAX_ATTEMPTS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `LOG_LEVEL`

Optional:

- `AUTH_COOKIE_DOMAIN`
- `CORS_EXTRA_ORIGINS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER_PREFIX`
- `MEDIA_ENABLE_AV_SCANNING`

Development-only:

- `SEED_ADMIN_PASSWORD` (required only when running the development seed; never configure or run the seed against production)

Database pooler guidance:

- `DATABASE_URL`: use the Supabase Transaction Pooler URL on port `6543` for the Vercel serverless runtime, with the provider-recommended `pgbouncer=true` and `connection_limit=1` parameters.
- `DIRECT_URL`: not used by the current Prisma schema. Use the Supabase Session Pooler URL on port `5432` only as a temporary `DATABASE_URL` in a controlled migration shell; do not add `directUrl` or `DIRECT_URL` unless Prisma configuration is deliberately changed and tested.

When media upload is enabled, all three Cloudinary variables are required. The Cloudinary API secret is backend-only and must never be added to frontend `VITE_*` variables, browser configuration, logs, or API responses.

Never run `npm run prisma:seed` or equivalent commands against production. The seed script is development-only, requires an explicit `SEED_ADMIN_PASSWORD`, and refuses to run when `NODE_ENV=production`.

Production safeguards:

- `AUTH_COOKIE_SECURE` must be `true`
- localhost origins are rejected
- placeholder JWT values are rejected
- wildcard CORS origin is rejected

### Public Vercel Project (`.`)

Required:

- `VITE_API_BASE_URL` (backend API base, for example `https://api.example.com/api/v1`)
- `VITE_SITE_URL` (public website origin)

Optional:

- `VITE_SUPPORT_WHATSAPP`
- `VITE_PUBLIC_PHONE`

Current temporary deployment values:

- `VITE_API_BASE_URL=https://surfmangalore-backend.vercel.app/api/v1`
- `VITE_SITE_URL=https://surf-mangalore.vercel.app`

### Admin Vercel Project (`admin`)

Required:

- `VITE_API_BASE_URL` (backend API base)
- `VITE_PUBLIC_SITE_BASE_URL` (public website origin for preview links)

Current temporary deployment values:

- `VITE_API_BASE_URL=https://surfmangalore-backend.vercel.app/api/v1`
- `VITE_PUBLIC_SITE_BASE_URL=https://surf-mangalore.vercel.app`

## Database Deployment Process

Do not run `prisma migrate dev` in production.

Use this sequence in backend runtime environment:

1. `npm run prisma:generate`
2. `npm run prisma:migrate:deploy`
3. `npm run start`

Useful checks:

- `npm run prisma:migrate:status`
- `npm run prisma:validate`

## DATABASE_URL Format

Use the Supabase PostgreSQL connection string, for example:

`postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>?schema=public`

Do not commit real credentials.

The current Prisma 6 schema uses `DATABASE_URL` only. It does not declare `directUrl`, and this repository has no `prisma.config.*` or `DIRECT_URL` usage. Do not add a second Prisma URL solely for this configuration pass.

For the Vercel backend runtime, set `DATABASE_URL` to the Supabase Transaction Pooler URL on port `6543`, using the provider-recommended `pgbouncer=true` and `connection_limit=1` parameters. For Prisma migration administration, use the Supabase Session Pooler URL on port `5432` by temporarily supplying it as `DATABASE_URL` in a controlled migration shell, then restore the runtime value. Never put the pooler password in Git or frontend variables.

For local development, keep the existing ignored `backend/.env` Supabase configuration working. To switch local runtime from the current direct URL to the Transaction Pooler, manually replace only its `DATABASE_URL` value with the operator-supplied Transaction Pooler URL. Do not change `schema.prisma` or migrations.

Current temporary backend origins:

- `FRONTEND_ORIGIN=https://surf-mangalore.vercel.app`
- `ADMIN_ORIGIN=https://surfmangalore-admin.vercel.app`
- `PUBLIC_SITE_URL=https://surf-mangalore.vercel.app`
- `ALLOWED_ORIGINS=https://surf-mangalore.vercel.app,https://surfmangalore-admin.vercel.app`

Keep `http://localhost:5173` and `http://localhost:5180` only in local development configuration. Do not add `http://172.25.144.18:5180` to production origins.

## Existing Local Database Migration to Supabase

The local `surfmangalore` PostgreSQL database is the source of truth for the initial production data transfer. Prisma migrations alone do not transfer records, sequences, or current relationships. Use a PostgreSQL custom-format dump and restore instead.

Connection recommendations:

- Dump/import/migration administration: Supabase direct database connection from the Supabase dashboard, normally the `db.*.supabase.co` host on port `5432`.
- Vercel backend runtime: Supabase session pooler connection from the Supabase dashboard when available. Do not invent a pooler hostname or port; copy the project-provided value.
- Avoid the transaction pooler for Prisma migrations and long-lived administrative dump/restore operations.

Do not run `prisma migrate dev`, `prisma migrate reset`, `DROP DATABASE`, `DROP SCHEMA`, or `pg_restore --clean` against Supabase.

### A. Create the Local Backup

Run from PowerShell. The PostgreSQL client prompts for the local password if it is not available through the normal local authentication configuration.

```powershell
Set-Location backend
$backupRoot = Join-Path $env:USERPROFILE 'SurfMangalore-backups'
New-Item -ItemType Directory -Force $backupRoot | Out-Null
$dump = Join-Path $backupRoot 'surfmangalore-local-initial.dump'

pg_dump `
  --host localhost `
  --port 5432 `
  --username postgres `
  --dbname surfmangalore `
  --format custom `
  --schema public `
  --no-owner `
  --no-acl `
  --verbose `
  --file $dump
```

Keep the dump outside the repository and never commit database dumps.

### B. Verify the Dump Without Connecting to Supabase

```powershell
pg_restore --list $dump | Select-String 'TABLE|SEQUENCE|CONSTRAINT|_prisma_migrations'
Get-Item $dump | Select-Object FullName,Length,LastWriteTime
```

The listing must include the application tables, sequences, constraints, and `_prisma_migrations` data before proceeding.

### C. Confirm Supabase Is Still Empty

Set the direct Supabase URI from the Supabase dashboard interactively. Do not save it in a tracked file or echo it.

```powershell
$supabaseDirectUrl = Read-Host 'Paste the Supabase direct PostgreSQL URI'
$env:PGSSLMODE = 'require'
psql --dbname $supabaseDirectUrl --command "SELECT current_database(); SELECT count(*) AS public_tables FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
```

Expected before import: `public_tables = 0`. Stop if any application table already exists.

### D. Apply Prisma Schema, Then Import Data

First apply the existing repository migrations to the confirmed-empty Supabase database:

```powershell
$env:DATABASE_URL = $supabaseDirectUrl
$env:PGSSLMODE = 'require'
Set-Location backend
npm run prisma:generate
npm run prisma:migrate:deploy
```

Then restore only local application data and sequence state. Do not restore local `_prisma_migrations` rows because `migrate deploy` has already recorded the migration history on Supabase.

Create a restore catalog outside the repository:

```powershell
$restoreList = Join-Path $backupRoot 'surfmangalore-data.list'
pg_restore --list $dump |
  Where-Object { $_ -notmatch 'TABLE DATA public _prisma_migrations ' } |
  Set-Content -Encoding ascii $restoreList
```

Use the catalog for the data-only restore. It intentionally does not use destructive cleanup flags.

```powershell
pg_restore `
  --dbname $supabaseDirectUrl `
  --data-only `
  --use-list $restoreList `
  --no-owner `
  --no-acl `
  --exit-on-error `
  --verbose `
  $dump
```

Stop immediately on any restore error. Do not retry with `--clean` or manually drop objects without reviewing the exact error and target state.

### E. Verify Imported Tables and Important Row Counts

```powershell
psql --dbname $supabaseDirectUrl --command "\dt public.*"
psql --dbname $supabaseDirectUrl --command "
SELECT 'AdminUser' AS table_name, count(*) FROM public.\"AdminUser\"
UNION ALL SELECT 'Role', count(*) FROM public.\"Role\"
UNION ALL SELECT 'Permission', count(*) FROM public.\"Permission\"
UNION ALL SELECT 'Coach', count(*) FROM public.\"Coach\"
UNION ALL SELECT 'Event', count(*) FROM public.\"Event\"
UNION ALL SELECT 'Lesson', count(*) FROM public.\"Lesson\"
UNION ALL SELECT 'Experience', count(*) FROM public.\"Experience\"
UNION ALL SELECT 'Media', count(*) FROM public.\"Media\"
UNION ALL SELECT 'GalleryImage', count(*) FROM public.\"GalleryImage\"
UNION ALL SELECT 'FAQ', count(*) FROM public.\"FAQ\"
UNION ALL SELECT 'Testimonial', count(*) FROM public.\"Testimonial\"
UNION ALL SELECT 'SiteSetting', count(*) FROM public.\"SiteSetting\"
UNION ALL SELECT 'SEOPage', count(*) FROM public.\"SEOPage\"
UNION ALL SELECT 'Booking', count(*) FROM public.\"Booking\";
"
```

Compare these counts with the local audit before declaring the import complete.

### F. Verify Foreign Keys and Sequences

```powershell
psql --dbname $supabaseDirectUrl --command "
SELECT count(*) AS foreign_key_count FROM pg_constraint WHERE contype='f';
SELECT count(*) AS invalid_constraint_count FROM pg_constraint WHERE NOT convalidated;
SELECT sequence_name, last_value FROM pg_sequences WHERE schemaname='public' ORDER BY sequence_name;
"
```

Expected: the foreign-key count matches local, invalid constraints are zero, and each populated table sequence is at least its table's maximum primary-key value.

### G. Verify Prisma Migration State Without Applying Development Migrations

```powershell
$env:DATABASE_URL = $supabaseDirectUrl
$env:PGSSLMODE = 'require'
Set-Location backend
npm run prisma:validate
npm run prisma:migrate:status
```

Expected: Prisma reports all repository migrations as applied and the database as up to date. Do not run `prisma migrate dev` against this database.

After this verification, configure the Vercel backend runtime with the provider-approved Supabase runtime connection string. Do not run the development seed again; the migrated database is the production source of truth.

## Cloudinary Media Requirements

For Cloudinary-backed production media, provide all of:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER_PREFIX`

`CLOUDINARY_API_SECRET` belongs only in the backend Vercel project. Never add it, `DATABASE_URL`, JWT secrets, or passwords to either frontend Vercel project or to a `VITE_*` variable.

Do not rely on local filesystem paths for production media delivery. Referenced media remains protected from deletion by the existing media usage checks.

## Backup and Restore Strategy

Minimum production strategy:

- Automated daily PostgreSQL backups (snapshot or logical)
- Point-in-time recovery enabled where provider supports it
- Retention policy of at least 7-30 days based on business needs
- Restore drill in staging at regular intervals

Migration safety:

- Run schema migrations in staging before production
- Take a fresh backup before production migration deploy
- Use `prisma migrate deploy` only
- Never run destructive reset commands against production

## CORS and Cookie Notes

- Backend CORS is environment-driven and credentialed
- Allowed origins must include only trusted frontend/admin domains
- Refresh token cookie is HttpOnly and should be Secure in production
- SameSite should be chosen based on deployment topology:
  - same-site domains: `lax` can work
  - cross-site frontend/backend: `none` + Secure required

## Deployment Checklist

1. Create the Supabase production project and backups.
2. Configure the backend Vercel environment variables.
3. Run `npm run prisma:generate` and `npm run prisma:migrate:deploy` from `backend` with the direct production `DATABASE_URL`.
4. Deploy the backend Vercel project and verify `https://<backend-domain>/api/v1/health`.
5. Configure the public Vercel project with `VITE_API_BASE_URL` and `VITE_SITE_URL`.
6. Configure the admin Vercel project with `VITE_API_BASE_URL` and `VITE_PUBLIC_SITE_BASE_URL`.
7. Deploy public and admin projects.
8. Verify login, refresh/logout, booking, CMS publishing, Cloudinary upload, and public Gallery rendering.
9. Verify generated `robots.txt` and `sitemap.xml` use the real public site URL.

## Rollback Basics

- Redeploy the prior Vercel deployment for the affected project.
- Restore database data only from verified Supabase backups; do not use Prisma reset in production.
- Apply forward-only corrective migrations unless a migration rollback has been tested in staging.
- Keep Cloudinary assets referenced by retained database records.

## Post-Deployment Verification

Public:

- Home/About/Experiences/Lessons/Events/Gallery/Booking/FAQ/Contact load
- Booking submission succeeds
- No localhost URLs in metadata/canonical links

Admin:

- Login/refresh/logout works
- Permissions enforced server-side
- CMS CRUD actions reflect on public site
- Audit logs record admin mutations

API/Security:

- `/api/v1/health` returns success without secrets
- No wildcard CORS with credentials
- No secrets exposed in frontend bundles
- Refresh token never appears in JavaScript storage
