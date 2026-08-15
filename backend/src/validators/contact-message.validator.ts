import { z } from 'zod'

export const contactMessageIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const contactMessageListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  sortBy: z.enum(['createdAt', 'updatedAt', 'fullName']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(['all', 'new', 'read', 'replied', 'archived']).default('all'),
  status: z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED', 'IN_REVIEW', 'RESOLVED', 'SPAM']).optional(),
})

const contactMessageCreateBodySchema = z.object({
  name: z.string().trim().min(2).max(140),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(220).optional(),
  message: z.string().trim().min(10).max(5000),
  source: z.string().trim().max(120).optional(),
})

const contactMessageUpdateBodySchema = z.object({
  status: z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED', 'IN_REVIEW', 'RESOLVED', 'SPAM']).optional(),
  subject: z.string().trim().max(220).optional(),
  message: z.string().trim().min(1).max(5000).optional(),
  fullName: z.string().trim().min(2).max(140).optional(),
  email: z.string().trim().email().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
})

export const contactMessageCreateBody = contactMessageCreateBodySchema
export const contactMessageUpdateBody = contactMessageUpdateBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for update',
})
