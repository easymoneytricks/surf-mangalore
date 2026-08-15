import {
  EXPERIENCE_DIFFICULTIES,
  EXPERIENCE_LIST_QUICK_FILTERS,
  EXPERIENCE_LIST_SORT_FIELDS,
  EXPERIENCE_STATUSES,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/experiences'

export type ExperienceDifficultyValue = (typeof EXPERIENCE_DIFFICULTIES)[number]
export type ExperienceSortFieldValue = (typeof EXPERIENCE_LIST_SORT_FIELDS)[number]
export type ExperienceQuickFilterValue = (typeof EXPERIENCE_LIST_QUICK_FILTERS)[number]
export type ExperienceStatusValue = (typeof EXPERIENCE_STATUSES)[number]
export type PublishStatusValue = (typeof PUBLISH_STATUSES)[number]
export type VisibilityValue = (typeof VISIBILITY_STATUSES)[number]

export type ExperienceListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: ExperienceSortFieldValue
  sortOrder: 'asc' | 'desc'
  quickFilter: ExperienceQuickFilterValue
  category?: string
  difficulty?: ExperienceDifficultyValue
  instructor?: string
  status?: ExperienceStatusValue
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
}

export type ExperienceMutationInput = {
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  galleryImageUrls: string[]
  category?: string
  difficulty: ExperienceDifficultyValue
  recommendedAge?: string
  duration?: string
  maxParticipants?: number
  basePrice?: number
  discountPrice?: number
  instructor?: string
  linkedLessonIds: number[]
  status: ExperienceStatusValue
  publishStatus: PublishStatusValue
  visibility: VisibilityValue
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
}
