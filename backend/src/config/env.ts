import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

function csvToArray(value?: string) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function toOptionalBoolean(value?: string) {
  if (!value) {
    return undefined
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return undefined
}

function isLocalhostUrl(value: string) {
  return /localhost|127\.0\.0\.1/i.test(value)
}

function isLocalhostDatabaseUrl(value: string) {
  return /(?:@|\/\/)(localhost|127\.0\.0\.1)(?::|\/)/i.test(value)
}

function normalizeOrigin(value?: string) {
  if (!value) {
    return undefined
  }

  return value.trim().replace(/\/+$/, '')
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default('/api'),
  API_VERSION: z.string().default('v1'),
  DATABASE_URL: z.string().url(),
  FRONTEND_ORIGIN: z.string().optional(),
  ADMIN_ORIGIN: z.string().optional(),
  PUBLIC_SITE_URL: z.string().optional(),
  CORS_EXTRA_ORIGINS: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_ISSUER: z.string().default('surfmangalore-backend'),
  JWT_AUDIENCE: z.string().default('surfmangalore-admin-cms'),
  AUTH_COOKIE_NAME: z.string().default('sm_refresh_token'),
  AUTH_COOKIE_DOMAIN: z.string().optional(),
  AUTH_COOKIE_SECURE: z.string().optional(),
  AUTH_COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(7 * 24 * 60 * 60 * 1000),
  AUTH_LOGIN_WINDOW_MS: z.coerce.number().int().positive().default(10 * 60 * 1000),
  AUTH_LOGIN_MAX_ATTEMPTS: z.coerce.number().int().positive().default(8),
  AUTH_REFRESH_WINDOW_MS: z.coerce.number().int().positive().default(10 * 60 * 1000),
  AUTH_REFRESH_MAX_ATTEMPTS: z.coerce.number().int().positive().default(25),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER_PREFIX: z.string().default('surfmangalore/cms'),
  SEED_ADMIN_PASSWORD: z.string().min(16).optional(),
  MEDIA_ENABLE_AV_SCANNING: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

const frontendOrigin = normalizeOrigin(parsed.data.FRONTEND_ORIGIN)
const adminOrigin = normalizeOrigin(parsed.data.ADMIN_ORIGIN)
const publicSiteUrl = normalizeOrigin(parsed.data.PUBLIC_SITE_URL)
const authCookieSecure = toOptionalBoolean(parsed.data.AUTH_COOKIE_SECURE)
const cloudinaryValues = [
  parsed.data.CLOUDINARY_CLOUD_NAME,
  parsed.data.CLOUDINARY_API_KEY,
  parsed.data.CLOUDINARY_API_SECRET,
]
const cloudinaryConfiguredCount = cloudinaryValues.filter(Boolean).length

const legacyOrigins = csvToArray(parsed.data.ALLOWED_ORIGINS)
const extraOrigins = csvToArray(parsed.data.CORS_EXTRA_ORIGINS)

const defaultDevelopmentOrigins = ['http://localhost:5173', 'http://localhost:5180', 'http://localhost:4173']
const mergedOrigins = Array.from(new Set([
  ...(frontendOrigin ? [frontendOrigin] : []),
  ...(adminOrigin ? [adminOrigin] : []),
  ...extraOrigins,
  ...legacyOrigins,
]))

const allowedOrigins = mergedOrigins.length
  ? mergedOrigins
  : parsed.data.NODE_ENV === 'production'
    ? []
    : defaultDevelopmentOrigins

if (allowedOrigins.some((origin) => origin === '*')) {
  throw new Error('Invalid environment configuration: wildcard CORS origin is not allowed when credentials are enabled')
}

if (cloudinaryConfiguredCount > 0 && cloudinaryConfiguredCount < cloudinaryValues.length) {
  throw new Error('Invalid environment configuration: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be configured together')
}

if (parsed.data.AUTH_COOKIE_SAME_SITE === 'none' && !authCookieSecure && parsed.data.NODE_ENV !== 'production') {
  throw new Error('Invalid environment configuration: AUTH_COOKIE_SAME_SITE=none requires secure cookies')
}

if (
  parsed.data.NODE_ENV === 'production'
  && (
    parsed.data.JWT_ACCESS_SECRET.toLowerCase().includes('change-me')
    || parsed.data.JWT_REFRESH_SECRET.toLowerCase().includes('change-me')
  )
) {
  throw new Error('Invalid environment configuration: production JWT secrets must not use placeholder values')
}

if (parsed.data.NODE_ENV === 'production') {
  if (!frontendOrigin || !adminOrigin || !publicSiteUrl) {
    throw new Error('Invalid environment configuration: FRONTEND_ORIGIN, ADMIN_ORIGIN and PUBLIC_SITE_URL are required in production')
  }

  if (!allowedOrigins.length) {
    throw new Error('Invalid environment configuration: no allowed CORS origins configured for production')
  }

  if (isLocalhostDatabaseUrl(parsed.data.DATABASE_URL)) {
    throw new Error('Invalid environment configuration: DATABASE_URL must not point to localhost in production')
  }

  if (allowedOrigins.some((origin) => isLocalhostUrl(origin))) {
    throw new Error('Invalid environment configuration: localhost origins are not allowed in production')
  }

  if (isLocalhostUrl(publicSiteUrl)) {
    throw new Error('Invalid environment configuration: PUBLIC_SITE_URL must not point to localhost in production')
  }

  if (!authCookieSecure) {
    throw new Error('Invalid environment configuration: AUTH_COOKIE_SECURE must be true in production')
  }

  if (parsed.data.JWT_ACCESS_SECRET === parsed.data.JWT_REFRESH_SECRET) {
    throw new Error('Invalid environment configuration: JWT access and refresh secrets must be different')
  }
}

if (authCookieSecure === undefined && parsed.data.NODE_ENV !== 'production') {
  // Keep development ergonomics if the explicit flag is not set.
}

export const env = {
  ...parsed.data,
  FRONTEND_ORIGIN: frontendOrigin,
  ADMIN_ORIGIN: adminOrigin,
  PUBLIC_SITE_URL: publicSiteUrl,
  AUTH_COOKIE_SECURE: authCookieSecure ?? false,
  ALLOWED_ORIGINS: allowedOrigins,
}
