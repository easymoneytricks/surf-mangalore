export const EVENT_DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'] as const
export const EVENT_TYPES = ['WORKSHOP', 'CAMP', 'RETREAT', 'COMPETITION', 'COMMUNITY', 'PRIVATE_SESSION', 'OTHER'] as const
export const CURRENCY_CODES = ['INR', 'USD', 'EUR', 'GBP'] as const
export const EVENT_STATUSES = ['DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'] as const
export const PUBLISH_STATUSES = ['DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'] as const
export const VISIBILITY_STATUSES = ['PUBLIC', 'PRIVATE', 'UNLISTED'] as const

export const EVENT_LIST_SORT_FIELDS = ['title', 'eventStartsAt', 'createdAt', 'updatedAt', 'basePrice'] as const
export const EVENT_LIST_QUICK_FILTERS = ['all', 'upcoming', 'past', 'featured', 'draft', 'published', 'cancelled'] as const
