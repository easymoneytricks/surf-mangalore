export type LessonStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type LessonVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
export type LessonDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'

export type LessonEntity = {
  id: number
  uuid: string
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  difficulty: LessonDifficulty
  duration?: string
  price?: number
  maxParticipants?: number
  instructor?: string
  status: string
  publishStatus: LessonStatus
  visibility: LessonVisibility
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
  audit: {
    createdAt: string
    updatedAt: string
    createdBy?: { id: number; uuid: string; name: string }
    updatedBy?: { id: number; uuid: string; name: string }
  }
}

export type LessonListFilters = {
  quickFilter: 'all' | 'featured' | 'draft' | 'published'
  difficulty?: string
  instructor?: string
}

export type LessonListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'title' | 'displayOrder' | 'createdAt' | 'updatedAt' | 'price'
  sortOrder?: 'asc' | 'desc'
  filters: LessonListFilters
}

export type LessonMutationInput = {
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  difficulty: LessonDifficulty
  duration?: string
  price?: number
  maxParticipants?: number
  instructor?: string
  publishStatus: LessonStatus
  visibility: LessonVisibility
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
}
