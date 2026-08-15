import { z } from 'zod'

export const baseSlugSchema = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase words separated by hyphens')

export const baseSeoSchema = z.object({
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
  metaKeywords: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
})

export const basePublishWorkflowSchema = z.object({
  publishStatus: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED']).default('DRAFT'),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).default('PUBLIC'),
  featured: z.boolean().default(false),
  scheduledPublishAt: z.string().datetime({ offset: true }).optional(),
})

export const baseMediaSchema = z.object({
  coverImageUrl: z.string().url().optional(),
  galleryImageUrls: z.array(z.string().url()).max(30).default([]),
})

export const baseTaxonomySchema = z.object({
  tags: z.array(z.string().trim().min(1).max(50)).max(50).default([]),
  categories: z.array(z.string().trim().min(1).max(80)).max(25).default([]),
})

export const baseListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
