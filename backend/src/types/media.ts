import {
  MEDIA_SORT_FIELDS,
  MEDIA_SORT_ORDERS,
  MEDIA_STATUSES,
} from '../constants/media'

export type MediaSortField = (typeof MEDIA_SORT_FIELDS)[number]

export type MediaSortOrder = (typeof MEDIA_SORT_ORDERS)[number]

export type MediaStatus = (typeof MEDIA_STATUSES)[number]

export type MediaListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: MediaSortField
  sortOrder: MediaSortOrder
  status?: MediaStatus
  folder?: string
  tag?: string
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
  publishStatus?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
}

export type MediaUploadInput = {
  files: Express.Multer.File[]
  folder?: string
  tags?: string[]
  altText?: string
  caption?: string
  description?: string
}

export type MediaUpdateInput = {
  title?: string
  altText?: string
  caption?: string
  description?: string
  tags?: string[]
  status?: MediaStatus
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
  publishStatus?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
  folder?: string
  replacementFile?: Express.Multer.File
}
