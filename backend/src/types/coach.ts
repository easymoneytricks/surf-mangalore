import {
  COACH_LIST_QUICK_FILTERS,
  COACH_LIST_SORT_FIELDS,
  COACH_STATUSES,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/coaches'

export type CoachSortFieldValue = (typeof COACH_LIST_SORT_FIELDS)[number]
export type CoachQuickFilterValue = (typeof COACH_LIST_QUICK_FILTERS)[number]
export type CoachStatusValue = (typeof COACH_STATUSES)[number]
export type PublishStatusValue = (typeof PUBLISH_STATUSES)[number]
export type VisibilityValue = (typeof VISIBILITY_STATUSES)[number]

export type CoachListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: CoachSortFieldValue
  sortOrder: 'asc' | 'desc'
  quickFilter: CoachQuickFilterValue
  status?: CoachStatusValue
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
  featured?: 'true' | 'false'
}

export type CoachMutationInput = {
  fullName: string
  slug: string
  profilePhotoUrl?: string
  coverPhotoUrl?: string
  jobTitle: string
  shortBio?: string
  fullBio?: string
  yearsOfExperience?: number
  specialization: string[]
  languages: string[]
  certifications: string[]
  phone?: string
  email?: string
  instagramUrl?: string
  facebookUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  status: CoachStatusValue
  publishStatus: PublishStatusValue
  visibility: VisibilityValue
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
}
