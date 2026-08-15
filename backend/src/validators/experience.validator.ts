import { z } from 'zod'

import {
  EXPERIENCE_DIFFICULTIES,
  EXPERIENCE_LIST_QUICK_FILTERS,
  EXPERIENCE_LIST_SORT_FIELDS,
  EXPERIENCE_STATUSES,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/experiences'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

export const experienceIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const experienceListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: emptyToUndefined,
  sortBy: z.enum(EXPERIENCE_LIST_SORT_FIELDS).default('displayOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(EXPERIENCE_LIST_QUICK_FILTERS).default('all'),
  category: emptyToUndefined,
  difficulty: z.enum(EXPERIENCE_DIFFICULTIES).optional(),
  instructor: emptyToUndefined,
  status: z.enum(EXPERIENCE_STATUSES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
})

const experienceMutationBaseSchema = z.object({
  title: z.string().trim().min(3).max(140),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase words separated by hyphens'),
  shortDescription: z.string().trim().max(240).optional(),
  fullDescription: z.string().trim().max(20000).optional(),
  coverImageUrl: z.string().url().optional(),
  galleryImageUrls: z.array(z.string().url()).max(25).default([]),
  category: z.string().trim().max(80).optional(),
  difficulty: z.enum(EXPERIENCE_DIFFICULTIES),
  recommendedAge: z.string().trim().max(60).optional(),
  duration: z.string().trim().max(80).optional(),
  maxParticipants: z.coerce.number().int().positive().max(10000).optional(),
  basePrice: z.coerce.number().nonnegative().max(10000000).optional(),
  discountPrice: z.coerce.number().nonnegative().max(10000000).optional(),
  instructor: z.string().trim().max(120).optional(),
  linkedLessonIds: z.array(z.coerce.number().int().positive()).max(200).default([]),
  status: z.enum(EXPERIENCE_STATUSES).default('active'),
  publishStatus: z.enum(PUBLISH_STATUSES).default('DRAFT'),
  visibility: z.enum(VISIBILITY_STATUSES).default('PUBLIC'),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(10000).default(0),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
})

function validateExperienceBusinessRules(value: Partial<z.infer<typeof experienceMutationBaseSchema>>, ctx: z.RefinementCtx) {
  if (value.discountPrice !== undefined && value.basePrice !== undefined && value.discountPrice > value.basePrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discountPrice'],
      message: 'Discount price cannot be greater than base price',
    })
  }
}

export const experienceMutationSchema = experienceMutationBaseSchema.superRefine((value, ctx) => {
  validateExperienceBusinessRules(value, ctx)
})

export const experienceCreateBodySchema = experienceMutationSchema

export const experienceUpdateBodySchema = experienceMutationBaseSchema.partial().superRefine((value, ctx) => {
  validateExperienceBusinessRules(value, ctx)

  if (Object.keys(value).length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one field must be provided for update',
    })
  }
})

export const experienceStatusPatchSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
  publishStatus: z.enum(PUBLISH_STATUSES),
})

export const experienceFeaturedPatchSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
  isFeatured: z.boolean(),
})
