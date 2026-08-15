import { apiRequest } from './http'
import { type LessonEntity, type LessonListQuery, type LessonMutationInput } from '../types/lessons'

type LessonListResponse = {
  items: LessonEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toQueryString(query: LessonListQuery) {
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
  if (query.filters.difficulty) {
    params.set('difficulty', query.filters.difficulty)
  }
  if (query.filters.instructor) {
    params.set('instructor', query.filters.instructor)
  }

  return params.toString()
}

export const lessonsService = {
  list(query: LessonListQuery) {
    return apiRequest<LessonListResponse>(`/lessons?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<LessonEntity>(`/lessons/id/${id}`)
  },

  create(payload: LessonMutationInput) {
    return apiRequest<LessonEntity>('/lessons', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<LessonMutationInput>) {
    return apiRequest<LessonEntity>(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/lessons/${id}`, {
      method: 'DELETE',
    })
  },

  patchStatus(ids: number[], publishStatus: LessonMutationInput['publishStatus']) {
    return apiRequest<null>('/lessons/status', {
      method: 'PATCH',
      body: JSON.stringify({ ids, publishStatus }),
    })
  },

  patchFeatured(ids: number[], isFeatured: boolean) {
    return apiRequest<null>('/lessons/featured', {
      method: 'PATCH',
      body: JSON.stringify({ ids, isFeatured }),
    })
  },
}
