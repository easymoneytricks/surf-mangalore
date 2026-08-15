import {
  CURRENCY_CODES,
  EVENT_DIFFICULTIES,
  EVENT_LIST_QUICK_FILTERS,
  EVENT_LIST_SORT_FIELDS,
  EVENT_STATUSES,
  EVENT_TYPES,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/events'

export type EventDifficultyValue = (typeof EVENT_DIFFICULTIES)[number]
export type EventTypeValue = (typeof EVENT_TYPES)[number]
export type CurrencyCodeValue = (typeof CURRENCY_CODES)[number]
export type EventStatusValue = (typeof EVENT_STATUSES)[number]
export type PublishStatusValue = (typeof PUBLISH_STATUSES)[number]
export type VisibilityValue = (typeof VISIBILITY_STATUSES)[number]
export type EventSortFieldValue = (typeof EVENT_LIST_SORT_FIELDS)[number]
export type EventQuickFilterValue = (typeof EVENT_LIST_QUICK_FILTERS)[number]

export type EventListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: EventSortFieldValue
  sortOrder: 'asc' | 'desc'
  quickFilter: EventQuickFilterValue
  category?: string
  instructor?: string
  publishStatus?: PublishStatusValue
  eventStatus?: EventStatusValue
  visibility?: VisibilityValue
}

export type EventMutationInput = {
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  galleryImageUrls: string[]
  category?: string
  difficulty: EventDifficultyValue
  eventType: EventTypeValue
  locationName?: string
  googleMapsUrl?: string
  startDate: string
  endDate?: string
  registrationDeadline?: string
  startTimeLabel?: string
  endTimeLabel?: string
  maxParticipants?: number
  price?: number
  discountPrice?: number
  currencyCode: CurrencyCodeValue
  instructorName?: string
  eventStatus: EventStatusValue
  publishStatus: PublishStatusValue
  visibility: VisibilityValue
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
  metaKeywords: string[]
}
