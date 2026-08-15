export type EventStatus = 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
export type PublishStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
export type EventDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'
export type EventType = 'WORKSHOP' | 'CAMP' | 'RETREAT' | 'COMPETITION' | 'COMMUNITY' | 'PRIVATE_SESSION' | 'OTHER'
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP'

export type EventEntity = {
  id: number
  uuid: string
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  galleryImageUrls: string[]
  category?: string
  difficulty: EventDifficulty
  eventType: EventType
  location?: string
  googleMapsUrl?: string
  startDate: string
  endDate?: string
  registrationDeadline?: string
  startTime?: string
  endTime?: string
  maxParticipants?: number
  currentParticipants: number
  price?: number
  discountPrice?: number
  currency: CurrencyCode
  instructor?: string
  status: EventStatus
  publishStatus: PublishStatus
  visibility: Visibility
  featuredEvent: boolean
  seoTitle?: string
  seoDescription?: string
  metaKeywords: string[]
  audit: {
    createdAt: string
    updatedAt: string
    createdBy?: { id: number; uuid: string; name: string }
    updatedBy?: { id: number; uuid: string; name: string }
  }
}

export type EventListFilters = {
  quickFilter: 'all' | 'upcoming' | 'past' | 'featured' | 'draft' | 'published' | 'cancelled'
  category?: string
  instructor?: string
}

export type EventListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'title' | 'eventStartsAt' | 'createdAt' | 'updatedAt' | 'basePrice'
  sortOrder?: 'asc' | 'desc'
  filters: EventListFilters
}

export type EventMutationInput = {
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  coverImageUrl?: string
  galleryImageUrls: string[]
  category?: string
  difficulty: EventDifficulty
  eventType: EventType
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
  currencyCode: CurrencyCode
  instructorName?: string
  eventStatus: EventStatus
  publishStatus: PublishStatus
  visibility: Visibility
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
  metaKeywords: string[]
}
