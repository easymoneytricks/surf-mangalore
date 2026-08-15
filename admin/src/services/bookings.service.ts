import { apiRequest } from './http'
import { type BookableOption, type BookingCreateInput, type BookingEntity, type BookingListQuery, type BookingStatusPatchInput, type BookingUpdateInput } from '../types/bookings'

type BookingListResponse = {
  items: BookingEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

type BookableOptionsResponse = {
  lessons: BookableOption[]
  experiences: BookableOption[]
  events: BookableOption[]
}

function toQueryString(query: BookingListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    quickFilter: query.filters.quickFilter,
    sortBy: query.sortBy || 'bookingDate',
    sortOrder: query.sortOrder || 'desc',
  })

  if (query.search) {
    params.set('search', query.search)
  }
  if (query.filters.bookingStatus) {
    params.set('bookingStatus', query.filters.bookingStatus)
  }
  if (query.filters.bookingType) {
    params.set('bookingType', query.filters.bookingType)
  }
  if (query.filters.eventId) {
    params.set('eventId', String(query.filters.eventId))
  }
  if (query.filters.lessonId) {
    params.set('lessonId', String(query.filters.lessonId))
  }
  if (query.filters.experienceId) {
    params.set('experienceId', String(query.filters.experienceId))
  }
  if (query.filters.instructor) {
    params.set('instructor', query.filters.instructor)
  }
  if (query.filters.fromDate) {
    params.set('fromDate', query.filters.fromDate)
  }
  if (query.filters.toDate) {
    params.set('toDate', query.filters.toDate)
  }

  return params.toString()
}

export const bookingsService = {
  listOptions() {
    return apiRequest<BookableOptionsResponse>('/bookings/options')
  },

  list(query: BookingListQuery) {
    return apiRequest<BookingListResponse>(`/bookings?${toQueryString(query)}`)
  },

  create(payload: BookingCreateInput) {
    return apiRequest<BookingEntity>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getById(id: number) {
    return apiRequest<BookingEntity>(`/bookings/${id}`)
  },

  patchStatus(id: number, payload: BookingStatusPatchInput) {
    return apiRequest<BookingEntity>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  patch(id: number, payload: BookingUpdateInput) {
    return apiRequest<BookingEntity>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
}
