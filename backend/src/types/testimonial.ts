export type PublishStatusValue = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type VisibilityValue = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'

export type TestimonialListFilters = {
  quickFilter: 'all' | 'published' | 'draft' | 'recent'
  status?: string
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
  featured?: 'true' | 'false'
}

export type TestimonialListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'authorName' | 'rating' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  quickFilter: 'all' | 'published' | 'draft' | 'recent'
  status?: string
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
  featured?: 'true' | 'false'
}

export type TestimonialMutationInput = {
  authorName: string
  authorLocation?: string
  authorEmail?: string
  quote: string
  slug?: string
  rating?: number
  status: string
  publishStatus: PublishStatusValue
  visibility: VisibilityValue
  isFeatured: boolean
}
