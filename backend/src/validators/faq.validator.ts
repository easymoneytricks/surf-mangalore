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

export const faqIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const faqListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: emptyToUndefined,
  sortBy: z.enum(['question', 'sortOrder', 'createdAt', 'updatedAt']).default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(['all', 'published', 'draft', 'recent']).default('published'),
  status: z.string().optional(),
  publishStatus: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED']).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).optional(),
  featured: z.enum(['true', 'false']).optional(),
})

const faqBaseSchema = z.object({
  question: z.string().trim().min(3).max(220),
  answer: z.string().trim().min(6).max(5000),
  slug: slugSchema,
  status: z.string().trim().default('active'),
  publishStatus: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED']).default('DRAFT'),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).default('PUBLIC'),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
})

export const faqCreateBodySchema = faqBaseSchema
const faqUpdateBodyObjectSchema = faqBaseSchema.partial()

export const faqUpdateBodySchema = faqUpdateBodyObjectSchema.refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for update',
})

export const faqStatusUpdateBodySchema = faqUpdateBodyObjectSchema.pick({
  status: true,
}).refine((value) => typeof value.status === 'string' && value.status.trim().length > 0, {
  message: 'Status is required',
})
