import { z } from 'zod'

import {
  GALLERY_ALBUM_SORT_FIELDS,
  GALLERY_LIST_QUICK_FILTERS,
  GALLERY_LIST_SORT_FIELDS,
  GALLERY_STATUSES,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/gallery'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

const optionalUrl = z.union([z.string().url(), z.literal('')]).optional().transform((value) => (value === '' ? undefined : value))

const tagsStringToArray = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}, z.array(z.string().trim().min(1).max(40)).max(40).optional())

export const galleryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const galleryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
  search: emptyToUndefined,
  sortBy: z.enum(GALLERY_LIST_SORT_FIELDS).default('displayOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(GALLERY_LIST_QUICK_FILTERS).default('all'),
  albumId: z.coerce.number().int().positive().optional(),
  status: z.enum(GALLERY_STATUSES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
  featured: z.enum(['true', 'false']).optional(),
})

export const galleryAlbumListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: emptyToUndefined,
  sortBy: z.enum(GALLERY_ALBUM_SORT_FIELDS).default('displayOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  quickFilter: z.enum(GALLERY_LIST_QUICK_FILTERS).default('all'),
  status: z.enum(GALLERY_STATUSES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
  featured: z.enum(['true', 'false']).optional(),
})

const galleryImageMutationBase = z.object({
  title: z.string().trim().min(2).max(140),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase words separated by hyphens'),
  altText: emptyToUndefined,
  caption: emptyToUndefined,
  description: z.string().trim().max(4000).optional(),
  albumId: z.coerce.number().int().positive().optional(),
  mediaId: z.coerce.number().int().positive().optional(),
  mediaIds: z.array(z.coerce.number().int().positive()).max(200).optional(),
  photographer: emptyToUndefined,
  tags: z.union([tagsStringToArray, z.array(z.string().trim().min(1).max(40)).max(40)]).optional().transform((value) => value || []),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(10000).default(0),
  status: z.enum(GALLERY_STATUSES).default('active'),
  publishStatus: z.enum(PUBLISH_STATUSES).default('DRAFT'),
  visibility: z.enum(VISIBILITY_STATUSES).default('PUBLIC'),
})

export const galleryCreateBodySchema = galleryImageMutationBase.superRefine((value, ctx) => {
  if (!value.mediaId && (!value.mediaIds || !value.mediaIds.length)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['mediaId'],
      message: 'Provide mediaId or mediaIds for gallery image creation',
    })
  }
})

export const galleryUpdateBodySchema = galleryImageMutationBase.partial().superRefine((value, ctx) => {
  if (Object.keys(value).length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one field must be provided for update',
    })
  }
})

const galleryAlbumMutationBase = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase words separated by hyphens'),
  shortDescription: z.string().trim().max(280).optional(),
  coverImageUrl: optionalUrl,
  displayOrder: z.coerce.number().int().min(0).max(10000).default(0),
  status: z.enum(GALLERY_STATUSES).default('active'),
  publishStatus: z.enum(PUBLISH_STATUSES).default('DRAFT'),
  visibility: z.enum(VISIBILITY_STATUSES).default('PUBLIC'),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().trim().max(160).optional(),
  seoDescription: z.string().trim().max(320).optional(),
})

export const galleryAlbumCreateBodySchema = galleryAlbumMutationBase

export const galleryAlbumUpdateBodySchema = galleryAlbumMutationBase.partial().superRefine((value, ctx) => {
  if (Object.keys(value).length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one field must be provided for update',
    })
  }
})
