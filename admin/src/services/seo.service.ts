import { apiRequest } from './http'
import { type AdminSeoEntity, type AdminSeoListQuery, type AdminSeoMutationInput } from '../types/seo'

type SeoListResponse = {
  items: AdminSeoEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toQueryString(query: AdminSeoListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    sortBy: query.sortBy || 'updatedAt',
    sortOrder: query.sortOrder || 'desc',
    quickFilter: query.quickFilter || 'all',
  })

  if (query.search) params.set('search', query.search)
  if (query.publishStatus) params.set('publishStatus', query.publishStatus)
  if (query.visibility) params.set('visibility', query.visibility)

  return params.toString()
}

export const seoService = {
  list(query: AdminSeoListQuery) {
    return apiRequest<SeoListResponse>(`/seo?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<AdminSeoEntity>(`/seo/${id}`)
  },

  create(payload: AdminSeoMutationInput) {
    return apiRequest<AdminSeoEntity>('/seo', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<AdminSeoMutationInput>) {
    return apiRequest<AdminSeoEntity>(`/seo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/seo/${id}`, {
      method: 'DELETE',
    })
  },
}
