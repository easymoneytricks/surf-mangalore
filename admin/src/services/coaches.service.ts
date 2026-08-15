import { apiRequest } from './http'
import { type CoachEntity, type CoachListQuery, type CoachMutationInput } from '../types/coaches'

type CoachListResponse = {
  items: CoachEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toQueryString(query: CoachListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    quickFilter: query.filters.quickFilter,
    sortBy: query.sortBy || 'displayOrder',
    sortOrder: query.sortOrder || 'desc',
  })

  if (query.search) {
    params.set('search', query.search)
  }
  if (query.filters.status) {
    params.set('status', query.filters.status)
  }
  if (query.filters.publishStatus) {
    params.set('publishStatus', query.filters.publishStatus)
  }
  if (query.filters.visibility) {
    params.set('visibility', query.filters.visibility)
  }
  if (query.filters.featured) {
    params.set('featured', query.filters.featured)
  }

  return params.toString()
}

export const coachesService = {
  list(query: CoachListQuery) {
    return apiRequest<CoachListResponse>(`/coaches?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<CoachEntity>(`/coaches/id/${id}`)
  },

  create(payload: CoachMutationInput) {
    return apiRequest<CoachEntity>('/coaches', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<CoachMutationInput>) {
    return apiRequest<CoachEntity>(`/coaches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/coaches/${id}`, {
      method: 'DELETE',
    })
  },

  duplicate(id: number) {
    return apiRequest<CoachEntity>(`/coaches/${id}/duplicate`, {
      method: 'POST',
    })
  },

  patchStatus(ids: number[], publishStatus: CoachMutationInput['publishStatus']) {
    return apiRequest<null>('/coaches/status', {
      method: 'PATCH',
      body: JSON.stringify({ ids, publishStatus }),
    })
  },

  patchFeatured(ids: number[], isFeatured: boolean) {
    return apiRequest<null>('/coaches/featured', {
      method: 'PATCH',
      body: JSON.stringify({ ids, isFeatured }),
    })
  },
}
