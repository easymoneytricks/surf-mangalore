export type FaqEntity = {
  id: number
  uuid: string
  slug: string
  question: string
  answer: string
  status: string
  publishStatus: string
  visibility: string
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  audit: {
    createdAt: string
    updatedAt: string
    createdBy?: { id: number; uuid: string; name: string }
    updatedBy?: { id: number; uuid: string; name: string }
  }
}

export type FaqListFilters = {
  quickFilter: 'all' | 'published' | 'draft' | 'recent'
  status?: string
  publishStatus?: string
  visibility?: string
}

export type FaqListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'question' | 'sortOrder' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  filters: FaqListFilters
}

export type FaqMutationInput = {
  question: string
  answer: string
  slug?: string
  status: string
  publishStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
  sortOrder: number
  isFeatured: boolean
}
