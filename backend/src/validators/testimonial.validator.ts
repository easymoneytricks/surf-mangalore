import { z } from 'zod'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase words separated by hyphens')
  .optional()

export const testimonialIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const testimonialListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: emptyToUndefined,
  sortBy: z.enum(['authorName', 'rating', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(['all', 'published', 'draft', 'recent']).default('published'),
  status: z.string().optional(),
  publishStatus: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED']).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).optional(),
  featured: z.enum(['true', 'false']).optional(),
})

const testimonialBaseSchema = z.object({
  authorName: z.string().trim().min(2).max(140),
  authorLocation: z.string().trim().max(120).optional(),
  authorEmail: z.string().trim().email().max(160).optional(),
  quote: z.string().trim().min(10).max(5000),
  slug: slugSchema,
  rating: z.coerce.number().int().min(1).max(5).optional(),
  status: z.string().trim().default('active'),
  publishStatus: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED']).default('DRAFT'),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).default('PUBLIC'),
  isFeatured: z.boolean().default(false),
})

export const testimonialCreateBodySchema = testimonialBaseSchema
export const testimonialUpdateBodySchema = testimonialBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for update',
})
