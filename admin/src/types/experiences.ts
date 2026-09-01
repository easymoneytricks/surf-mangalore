export type PublishStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
export type ExperienceDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'
export type ExperienceStatus = 'active' | 'inactive'
export type ExperienceAvailability = { date: string; isActive?: boolean; slots: Array<{ startTime: string; endTime?: string; capacity?: number; isActive?: boolean }> }

export type LinkedLessonSummary = {
  id: number
  uuid: string
  title: string
  slug: string
  difficulty: ExperienceDifficulty
  publishStatus: PublishStatus
}

export type ExperienceEntity = {
  id: number
  uuid: string
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  galleryImageUrls: string[]
  category?: string
  difficulty: ExperienceDifficulty
  recommendedAge?: string
  duration?: string
  maxParticipants?: number
  basePrice?: number
  discountPrice?: number
  instructor?: string
  linkedLessonsCount: number
  linkedLessonIds: number[]
  linkedLessons: LinkedLessonSummary[]
  status: ExperienceStatus
  publishStatus: PublishStatus
  visibility: Visibility
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
  availability?: ExperienceAvailability[]
  audit: {
    createdAt: string
    updatedAt: string
    createdBy?: { id: number; uuid: string; name: string }
    updatedBy?: { id: number; uuid: string; name: string }
  }
}

export type ExperienceListFilters = {
  quickFilter: 'all' | 'featured' | 'draft' | 'published'
  category?: string
  difficulty?: ExperienceDifficulty
  instructor?: string
}

export type ExperienceListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'title' | 'displayOrder' | 'createdAt' | 'updatedAt' | 'basePrice'
  sortOrder?: 'asc' | 'desc'
  filters: ExperienceListFilters
}

export type ExperienceMutationInput = {
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  galleryImageUrls: string[]
  category?: string
  difficulty: ExperienceDifficulty
  recommendedAge?: string
  duration?: string
  maxParticipants?: number
  basePrice?: number
  discountPrice?: number
  instructor?: string
  linkedLessonIds: number[]
  status: ExperienceStatus
  publishStatus: PublishStatus
  visibility: Visibility
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
  availability?: ExperienceAvailability[]
}
