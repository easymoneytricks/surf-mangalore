import { apiRequest } from './http'
import { type ContactMessageEntity, type ContactMessageListQuery, type ContactMessageCreateInput, type ContactMessageUpdateInput } from '../types/contact-messages'

type ContactMessageListResponse = {
  items: ContactMessageEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toQueryString(query: ContactMessageListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    quickFilter: query.filters.quickFilter,
  })

  if (query.search) params.set('search', query.search)
  if (query.filters.status) params.set('status', query.filters.status)

  return params.toString()
}

export const contactMessagesService = {
  list(query: ContactMessageListQuery) {
    return apiRequest<ContactMessageListResponse>(`/contact-messages?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<ContactMessageEntity>(`/contact-messages/id/${id}`)
  },

  create(payload: ContactMessageCreateInput) {
    return apiRequest<ContactMessageEntity>('/contact-messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<ContactMessageUpdateInput>) {
    return apiRequest<ContactMessageEntity>(`/contact-messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/contact-messages/${id}`, {
      method: 'DELETE',
    })
  },

  reply(id: number, payload: { message: string; subject?: string }) {
    return apiRequest<ContactMessageEntity>(`/contact-messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
