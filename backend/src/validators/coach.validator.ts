import { z } from 'zod'

import {
  COACH_LIST_QUICK_FILTERS,
  COACH_LIST_SORT_FIELDS,
  COACH_STATUSES,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/coaches'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

const optionalUrl = z.union([z.string().url(), z.literal('')]).optional().transform((value) => (value === '' ? undefined : value))

export const coachIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const coachListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: emptyToUndefined,
  sortBy: z.enum(COACH_LIST_SORT_FIELDS).default('displayOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(COACH_LIST_QUICK_FILTERS).default('all'),
  status: z.enum(COACH_STATUSES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
  featured: z.enum(['true', 'false']).optional(),
})

const coachMutationBaseSchema = z.object({
  fullName: z.string().trim().min(2).max(140),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase words separated by hyphens'),
  profilePhotoUrl: optionalUrl,
  coverPhotoUrl: optionalUrl,
  jobTitle: z.string().trim().min(2).max(120),
  shortBio: z.string().trim().max(280).optional(),
  fullBio: z.string().trim().max(20000).optional(),
  yearsOfExperience: z.coerce.number().int().min(0).max(80).optional(),
  specialization: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  languages: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
  certifications: z.array(z.string().trim().min(1).max(120)).max(40).default([]),
  phone: z.string().trim().max(24).optional(),
  email: z.string().trim().email().max(160).optional(),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  websiteUrl: optionalUrl,
  status: z.enum(COACH_STATUSES).default('active'),
  publishStatus: z.enum(PUBLISH_STATUSES).default('DRAFT'),
  visibility: z.enum(VISIBILITY_STATUSES).default('PUBLIC'),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(10000).default(0),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
})

export const coachCreateBodySchema = coachMutationBaseSchema

export const coachUpdateBodySchema = coachMutationBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for update',
})

export const coachStatusPatchSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
  publishStatus: z.enum(PUBLISH_STATUSES),
})

export const coachFeaturedPatchSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
  isFeatured: z.boolean(),
})
