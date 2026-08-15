import { z } from 'zod'

import {
  CURRENCY_CODES,
  EVENT_DIFFICULTIES,
  EVENT_LIST_QUICK_FILTERS,
  EVENT_LIST_SORT_FIELDS,
  EVENT_STATUSES,
  EVENT_TYPES,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/events'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

const dateString = z.string().datetime({ offset: true })

export const eventIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const eventSlugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase words separated by hyphens'),
})

export const eventListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: emptyToUndefined,
  sortBy: z.enum(EVENT_LIST_SORT_FIELDS).default('eventStartsAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(EVENT_LIST_QUICK_FILTERS).default('all'),
  category: emptyToUndefined,
  instructor: emptyToUndefined,
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  eventStatus: z.enum(EVENT_STATUSES).optional(),
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
})

const eventMutationBaseSchema = z.object({
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
    difficulty: z.enum(EVENT_DIFFICULTIES),
    eventType: z.enum(EVENT_TYPES),
    locationName: z.string().trim().max(120).optional(),
    googleMapsUrl: z.string().url().optional(),
    startDate: dateString,
    endDate: dateString.optional(),
    registrationDeadline: dateString.optional(),
    startTimeLabel: z.string().trim().max(20).optional(),
    endTimeLabel: z.string().trim().max(20).optional(),
    maxParticipants: z.coerce.number().int().positive().max(10000).optional(),
    price: z.coerce.number().nonnegative().max(10000000).optional(),
    discountPrice: z.coerce.number().nonnegative().max(10000000).optional(),
    currencyCode: z.enum(CURRENCY_CODES).default('INR'),
    instructorName: z.string().trim().max(120).optional(),
    eventStatus: z.enum(EVENT_STATUSES).default('DRAFT'),
    publishStatus: z.enum(PUBLISH_STATUSES).default('DRAFT'),
    visibility: z.enum(VISIBILITY_STATUSES).default('PUBLIC'),
    isFeatured: z.boolean().default(false),
    seoTitle: z.string().trim().max(160).optional(),
    seoDescription: z.string().trim().max(320).optional(),
    metaKeywords: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  })

function validateEventBusinessRules(value: Partial<z.infer<typeof eventMutationBaseSchema>>, ctx: z.RefinementCtx) {
  if (value.endDate && value.startDate && new Date(value.endDate) < new Date(value.startDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDate'],
      message: 'End date must be on or after start date',
    })
  }

  if (value.registrationDeadline && value.startDate && new Date(value.registrationDeadline) > new Date(value.startDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['registrationDeadline'],
      message: 'Registration deadline must be before or equal to start date',
    })
  }

  if (value.discountPrice !== undefined && value.price !== undefined && value.discountPrice > value.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['discountPrice'],
      message: 'Discount price cannot be greater than price',
    })
  }
}

export const eventMutationSchema = eventMutationBaseSchema.superRefine((value, ctx) => {
  validateEventBusinessRules(value, ctx)
})

export const eventCreateBodySchema = eventMutationSchema

export const eventUpdateBodySchema = eventMutationBaseSchema.partial().superRefine((value, ctx) => {
  validateEventBusinessRules(value, ctx)

  if (Object.keys(value).length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one field must be provided for update',
    })
  }
})

export const eventStatusPatchSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  eventStatus: z.enum(EVENT_STATUSES).optional(),
}).refine((value) => value.publishStatus || value.eventStatus, {
  message: 'At least one of publishStatus or eventStatus must be provided',
})

export const eventFeaturedPatchSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
  isFeatured: z.boolean(),
})
