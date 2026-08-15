import { apiRequest } from './http'
import { type ExperienceEntity, type ExperienceListQuery, type ExperienceMutationInput } from '../types/experiences'

type ExperienceListResponse = {
  items: ExperienceEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toQueryString(query: ExperienceListQuery) {
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
  if (query.filters.category) {
    params.set('category', query.filters.category)
  }
  if (query.filters.difficulty) {
    params.set('difficulty', query.filters.difficulty)
  }
  if (query.filters.instructor) {
    params.set('instructor', query.filters.instructor)
  }

  return params.toString()
}

export const experiencesService = {
  list(query: ExperienceListQuery) {
    return apiRequest<ExperienceListResponse>(`/experiences?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<ExperienceEntity>(`/experiences/id/${id}`)
  },

  create(payload: ExperienceMutationInput) {
    return apiRequest<ExperienceEntity>('/experiences', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<ExperienceMutationInput>) {
    return apiRequest<ExperienceEntity>(`/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/experiences/${id}`, {
      method: 'DELETE',
    })
  },

  duplicate(id: number) {
    return apiRequest<ExperienceEntity>(`/experiences/${id}/duplicate`, {
      method: 'POST',
    })
  },

  patchStatus(ids: number[], publishStatus: ExperienceMutationInput['publishStatus']) {
    return apiRequest<null>('/experiences/status', {
      method: 'PATCH',
      body: JSON.stringify({ ids, publishStatus }),
    })
  },

  patchFeatured(ids: number[], isFeatured: boolean) {
    return apiRequest<null>('/experiences/featured', {
      method: 'PATCH',
      body: JSON.stringify({ ids, isFeatured }),
    })
  },
}
