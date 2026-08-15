export const BOOKING_TYPES = ['LESSON', 'EXPERIENCE', 'EVENT'] as const
export const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED', 'NO_SHOW'] as const

export const BOOKING_LIST_SORT_FIELDS = ['bookingDate', 'createdAt', 'updatedAt', 'fullName', 'bookingStatus'] as const
export const BOOKING_LIST_QUICK_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'no_show'] as const
