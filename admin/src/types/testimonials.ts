export type TestimonialEntity = {
  id: number
  uuid: string
  slug: string
  authorName: string
  authorEmail?: string
  authorLocation?: string
  quote: string
  rating?: number
  status: string
  publishStatus: string
  visibility: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  audit: {
    createdAt: string
    updatedAt: string
    createdBy?: { id: number; uuid: string; name: string }
    updatedBy?: { id: number; uuid: string; name: string }
  }
}

export type TestimonialListFilters = {
  quickFilter: 'all' | 'published' | 'draft' | 'recent'
  status?: string
  publishStatus?: string
  visibility?: string
}

export type TestimonialListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'authorName' | 'rating' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  filters: TestimonialListFilters
}

export type TestimonialMutationInput = {
  authorName: string
  authorLocation?: string
  authorEmail?: string
  quote: string
  slug?: string
  rating?: number
  status: string
  publishStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
  isFeatured: boolean
}
