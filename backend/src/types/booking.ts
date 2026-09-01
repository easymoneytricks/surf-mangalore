import { BOOKING_LIST_QUICK_FILTERS, BOOKING_LIST_SORT_FIELDS, BOOKING_STATUSES, BOOKING_TYPES } from '../constants/bookings'

export type BookingTypeValue = (typeof BOOKING_TYPES)[number]
export type BookingStatusValue = (typeof BOOKING_STATUSES)[number]
export type BookingSortFieldValue = (typeof BOOKING_LIST_SORT_FIELDS)[number]
export type BookingQuickFilterValue = (typeof BOOKING_LIST_QUICK_FILTERS)[number]

export type BookingListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: BookingSortFieldValue
  sortOrder: 'asc' | 'desc'
  quickFilter: BookingQuickFilterValue
  bookingStatus?: BookingStatusValue
  bookingType?: BookingTypeValue
  eventId?: number
  lessonId?: number
  experienceId?: number
  instructor?: string
  fromDate?: string
  toDate?: string
}

export type BookingCreateInput = {
  bookingType: BookingTypeValue
  selectedItemId: number
  preferredDate?: string
  preferredTime?: string
  participants: number
  customerName: string
  email: string
  phone: string
  emergencyContact?: string
  specialNotes?: string
}

export type BookingStatusPatchInput = {
  bookingStatus: BookingStatusValue
  note?: string
}

export type BookingUpdateInput = {
  preferredDate?: string
  preferredTime?: string
  participants?: number
  assignedInstructor?: string
  internalNotes?: string
  emergencyContact?: string
  specialNotes?: string
}
