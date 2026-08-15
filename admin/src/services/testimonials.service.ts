import { apiRequest } from './http'
import { type TestimonialEntity, type TestimonialListQuery, type TestimonialMutationInput } from '../types/testimonials'

type TestimonialListResponse = {
  items: TestimonialEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toQueryString(query: TestimonialListQuery) {
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

export const testimonialsService = {
  list(query: TestimonialListQuery) {
    return apiRequest<TestimonialListResponse>(`/testimonials?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<TestimonialEntity>(`/testimonials/id/${id}`)
  },

  create(payload: TestimonialMutationInput) {
    return apiRequest<TestimonialEntity>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<TestimonialMutationInput>) {
    return apiRequest<TestimonialEntity>(`/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  duplicate(id: number) {
    return apiRequest<TestimonialEntity>(`/testimonials/${id}/duplicate`, {
      method: 'POST',
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/testimonials/${id}`, {
      method: 'DELETE',
    })
  },
}
