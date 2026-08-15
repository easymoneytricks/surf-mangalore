import { PUBLISH_STATUSES, VISIBILITY_STATUSES } from '../constants/events'
import { SEO_LIST_QUICK_FILTERS, SEO_LIST_SORT_FIELDS, SEO_ROBOTS_OPTIONS } from '../constants/seo'

export type SeoPublishStatusValue = (typeof PUBLISH_STATUSES)[number]
export type SeoVisibilityValue = (typeof VISIBILITY_STATUSES)[number]
export type SeoRobotsValue = (typeof SEO_ROBOTS_OPTIONS)[number]
export type SeoSortFieldValue = (typeof SEO_LIST_SORT_FIELDS)[number]
export type SeoQuickFilterValue = (typeof SEO_LIST_QUICK_FILTERS)[number]

export type SeoListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: SeoSortFieldValue
  sortOrder: 'asc' | 'desc'
  quickFilter: SeoQuickFilterValue
  publishStatus?: SeoPublishStatusValue
  visibility?: SeoVisibilityValue
  localeCode?: string
}

export type SeoMutationInput = {
  name: string
  title: string
  slug?: string
  routePath: string
  canonicalUrl?: string
  metaTitle: string
  metaDescription?: string
  metaKeywords: string[]
  robots?: SeoRobotsValue
  openGraphTitle?: string
  openGraphDescription?: string
  openGraphImage?: string
  schemaJson?: unknown
  lessonId?: number
  experienceId?: number
  eventId?: number
  localeCode?: string
  publishStatus: SeoPublishStatusValue
  visibility: SeoVisibilityValue
  status: string
}

export type SeoPublicQuery = {
  path: string
  localeCode?: string
}
