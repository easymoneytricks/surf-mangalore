export type SortOrder = 'asc' | 'desc'

export type BaseListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: string
  sortOrder?: SortOrder
}

export type PaginationMeta = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type PaginatedResult<T> = {
  items: T[]
  pagination: PaginationMeta
}

export type SeoInput = {
  seoTitle?: string
  seoDescription?: string
  metaKeywords?: string[]
}

export type PublishWorkflowInput = {
  publishStatus?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
  eventStatus?: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  scheduledPublishAt?: string
  featured?: boolean
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
}

export type SlugAvailabilityChecker = (slug: string) => Promise<boolean>
