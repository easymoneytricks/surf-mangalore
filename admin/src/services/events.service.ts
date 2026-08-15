import { apiRequest } from './http'
import { type EventEntity, type EventListQuery, type EventMutationInput } from '../types/events'

type EventListResponse = {
  items: EventEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toQueryString(query: EventListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    quickFilter: query.filters.quickFilter,
    sortBy: query.sortBy || 'eventStartsAt',
    sortOrder: query.sortOrder || 'desc',
  })

  if (query.search) {
    params.set('search', query.search)
  }
  if (query.filters.category) {
    params.set('category', query.filters.category)
  }
  if (query.filters.instructor) {
    params.set('instructor', query.filters.instructor)
  }

  return params.toString()
}

export const eventsService = {
  list(query: EventListQuery) {
    return apiRequest<EventListResponse>(`/events?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<EventEntity>(`/events/${id}`)
  },

  create(payload: EventMutationInput) {
    return apiRequest<EventEntity>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<EventMutationInput>) {
    return apiRequest<EventEntity>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/events/${id}`, {
      method: 'DELETE',
    })
  },

  duplicate(id: number) {
    return apiRequest<EventEntity>(`/events/${id}/duplicate`, {
      method: 'POST',
    })
  },

  patchStatus(ids: number[], publishStatus?: EventMutationInput['publishStatus'], eventStatus?: EventMutationInput['eventStatus']) {
    return apiRequest<null>('/events/status', {
      method: 'PATCH',
      body: JSON.stringify({ ids, publishStatus, eventStatus }),
    })
  },

  patchFeatured(ids: number[], isFeatured: boolean) {
    return apiRequest<null>('/events/featured', {
      method: 'PATCH',
      body: JSON.stringify({ ids, isFeatured }),
    })
  },
}
