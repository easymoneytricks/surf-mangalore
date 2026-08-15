import { z } from 'zod'

import { PUBLISH_STATUSES, VISIBILITY_STATUSES } from '../constants/events'
import { MEDIA_SORT_FIELDS, MEDIA_STATUSES } from '../constants/media'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

const tagsStringToArray = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}, z.array(z.string().trim().min(1).max(40)).max(30).optional())

export const mediaIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const mediaListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(24),
  search: emptyToUndefined,
  sortBy: z.enum(MEDIA_SORT_FIELDS).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(MEDIA_STATUSES).optional(),
  folder: emptyToUndefined,
  tag: emptyToUndefined,
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
})

export const mediaUploadBodySchema = z.object({
  folder: emptyToUndefined,
  tags: tagsStringToArray,
  altText: emptyToUndefined,
  caption: emptyToUndefined,
  description: emptyToUndefined,
})

const mediaUpdateBodyBase = z.object({
  title: emptyToUndefined,
  folder: emptyToUndefined,
  tags: tagsStringToArray,
  altText: emptyToUndefined,
  caption: emptyToUndefined,
  description: emptyToUndefined,
  status: z.enum(MEDIA_STATUSES).optional(),
  visibility: z.enum(VISIBILITY_STATUSES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
})

export const mediaUpdateBodySchema = mediaUpdateBodyBase
