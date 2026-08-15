export type BookingType = 'LESSON' | 'EXPERIENCE' | 'EVENT'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED' | 'NO_SHOW'

export type BookableOption = {
  bookingType: BookingType
  id: number
  title: string
  slug: string
  shortDescription?: string
  duration?: string
  maxParticipants?: number
  eventStartsAt?: string
  startTimeLabel?: string
}

export type BookingEntity = {
  id: number
  uuid: string
  bookingReference: string
  bookingType: BookingType
  activity?: string | null
  selectedItem?: {
    id: number
    title: string
    slug: string
  } | null
  event?: { id: number; title: string; slug: string } | null
  lesson?: { id: number; title: string; slug: string } | null
  experience?: { id: number; title: string; slug: string } | null
  bookingDate: string
  bookingDateLabel?: string
  preferredTime?: string
  participants: number
  participantCount?: number
  bookingStatus: BookingStatus
  paymentStatus: string
  source: string
  paymentNotice?: string
  location?: string | null
  customer: {
    name: string
    email: string
    phone?: string
    emergencyContact?: string
  }
  specialNotes?: string
  internalNotes?: string
  assignedInstructor?: string
  createdAt: string
  updatedAt: string
  activityHistory: Array<{
    id: number
    uuid: string
    action: string
    oldStatus?: BookingStatus
    newStatus?: BookingStatus
    note?: string
    adminUser?: { id: number; uuid: string; name: string }
    createdAt: string
  }>
}

export type BookingListFilters = {
  quickFilter: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'no_show'
  bookingStatus?: BookingStatus
  bookingType?: BookingType
  eventId?: number
  lessonId?: number
  experienceId?: number
  instructor?: string
  fromDate?: string
  toDate?: string
}

export type BookingListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'bookingDate' | 'createdAt' | 'updatedAt' | 'fullName' | 'bookingStatus'
  sortOrder?: 'asc' | 'desc'
  filters: BookingListFilters
}

export type BookingStatusPatchInput = {
  bookingStatus: BookingStatus
  note?: string
}

export type BookingCreateInput = {
  bookingType: BookingType
  selectedItemId: number
  preferredDate: string
  preferredTime?: string
  participants: number
  customerName: string
  email: string
  phone: string
  emergencyContact?: string
  specialNotes?: string
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
