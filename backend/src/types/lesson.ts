import {
  LESSON_DIFFICULTIES,
  LESSON_LIST_QUICK_FILTERS,
  LESSON_LIST_SORT_FIELDS,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/lessons'

export type LessonDifficultyValue = (typeof LESSON_DIFFICULTIES)[number]
export type LessonSortFieldValue = (typeof LESSON_LIST_SORT_FIELDS)[number]
export type LessonQuickFilterValue = (typeof LESSON_LIST_QUICK_FILTERS)[number]
export type PublishStatusValue = (typeof PUBLISH_STATUSES)[number]
export type VisibilityValue = (typeof VISIBILITY_STATUSES)[number]

export type LessonListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: LessonSortFieldValue
  sortOrder: 'asc' | 'desc'
  quickFilter: LessonQuickFilterValue
  difficulty?: LessonDifficultyValue
  instructor?: string
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
}

export type LessonMutationInput = {
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  difficulty: LessonDifficultyValue
  duration?: string
  price?: number
  maxParticipants?: number
  instructor?: string
  publishStatus: PublishStatusValue
  visibility: VisibilityValue
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
}
