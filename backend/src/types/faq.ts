export type PublishStatusValue = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type VisibilityValue = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'

export type FaqListFilters = {
  quickFilter: 'all' | 'published' | 'draft' | 'recent'
  status?: string
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
  featured?: 'true' | 'false'
}

export type FaqListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'question' | 'sortOrder' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  quickFilter: 'all' | 'published' | 'draft' | 'recent'
  status?: string
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
  featured?: 'true' | 'false'
}

export type FaqMutationInput = {
  question: string
  answer: string
  slug?: string
  status: string
  publishStatus: PublishStatusValue
  visibility: VisibilityValue
  sortOrder: number
  isFeatured: boolean
}
