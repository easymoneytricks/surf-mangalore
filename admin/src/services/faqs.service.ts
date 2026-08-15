import { apiRequest } from './http'
import { type FaqListQuery, type FaqEntity, type FaqMutationInput } from '../types/faqs'

type FaqListResponse = {
  items: FaqEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toQueryString(query: FaqListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    quickFilter: query.filters.quickFilter,
  })

  if (query.search) params.set('search', query.search)
  if (query.filters.status) params.set('status', query.filters.status)
  if (query.filters.publishStatus) params.set('publishStatus', query.filters.publishStatus)
  if (query.filters.visibility) params.set('visibility', query.filters.visibility)

  return params.toString()
}

export const faqsService = {
  list(query: FaqListQuery) {
    return apiRequest<FaqListResponse>(`/faqs?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<FaqEntity>(`/faqs/id/${id}`)
  },

  create(payload: FaqMutationInput) {
    return apiRequest<FaqEntity>('/faqs', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<FaqMutationInput>) {
    return apiRequest<FaqEntity>(`/faqs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  duplicate(id: number) {
    return apiRequest<FaqEntity>(`/faqs/${id}/duplicate`, {
      method: 'POST',
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/faqs/${id}`, {
      method: 'DELETE',
    })
  },
}
