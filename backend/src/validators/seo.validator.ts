import { z } from 'zod'

import { PUBLISH_STATUSES, VISIBILITY_STATUSES } from '../constants/events'
import { SEO_LIST_QUICK_FILTERS, SEO_LIST_SORT_FIELDS, SEO_ROBOTS_OPTIONS } from '../constants/seo'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

export const seoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const seoListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  search: emptyToUndefined,
  sortBy: z.enum(SEO_LIST_SORT_FIELDS).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(SEO_LIST_QUICK_FILTERS).default('all'),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
  localeCode: emptyToUndefined,
})

export const seoPublicQuerySchema = z.object({
  path: z.string().trim().min(1).default('/'),
  localeCode: emptyToUndefined,
})

const seoMutationBodyObjectSchema = z.object({
  name: z.string().trim().min(2).max(180),
  title: z.string().trim().min(2).max(220),
  slug: emptyToUndefined,
  routePath: z.string().trim().min(1).max(200),
  canonicalUrl: emptyToUndefined,
  metaTitle: z.string().trim().min(2).max(220),
  metaDescription: emptyToUndefined,
  metaKeywords: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  robots: z.enum(SEO_ROBOTS_OPTIONS).optional(),
  openGraphTitle: emptyToUndefined,
  openGraphDescription: emptyToUndefined,
  openGraphImage: emptyToUndefined,
  schemaJson: z.unknown().optional(),
  lessonId: z.coerce.number().int().positive().optional(),
  experienceId: z.coerce.number().int().positive().optional(),
  eventId: z.coerce.number().int().positive().optional(),
  localeCode: emptyToUndefined,
  publishStatus: z.enum(PUBLISH_STATUSES).default('DRAFT'),
  visibility: z.enum(VISIBILITY_STATUSES).default('PUBLIC'),
  status: z.string().trim().min(2).max(40).default('active'),
})

export const seoCreateBodySchema = seoMutationBodyObjectSchema

export const seoUpdateBodySchema = seoMutationBodyObjectSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for update',
})
