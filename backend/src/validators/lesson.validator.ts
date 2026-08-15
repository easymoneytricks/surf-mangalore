import { z } from 'zod'

import {
  LESSON_DIFFICULTIES,
  LESSON_LIST_QUICK_FILTERS,
  LESSON_LIST_SORT_FIELDS,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/lessons'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

export const lessonIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const lessonListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: emptyToUndefined,
  sortBy: z.enum(LESSON_LIST_SORT_FIELDS).default('displayOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(LESSON_LIST_QUICK_FILTERS).default('all'),
  difficulty: emptyToUndefined,
  instructor: emptyToUndefined,
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
})

const lessonMutationBaseSchema = z.object({
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
  difficulty: z.enum(LESSON_DIFFICULTIES),
  duration: z.string().trim().max(80).optional(),
  price: z.coerce.number().nonnegative().max(10000000).optional(),
  maxParticipants: z.coerce.number().int().positive().max(10000).optional(),
  instructor: z.string().trim().max(120).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).default('DRAFT'),
  visibility: z.enum(VISIBILITY_STATUSES).default('PUBLIC'),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(10000).default(0),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
})

export const lessonMutationSchema = lessonMutationBaseSchema

export const lessonCreateBodySchema = lessonMutationSchema

export const lessonUpdateBodySchema = lessonMutationBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for update',
})

export const lessonStatusPatchSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
}).refine((value) => Boolean(value.publishStatus), {
  message: 'publishStatus must be provided',
})

export const lessonFeaturedPatchSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
  isFeatured: z.boolean(),
})
