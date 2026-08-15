import { apiRequest } from './http'
import {
  type GalleryAlbumEntity,
  type GalleryAlbumListQuery,
  type GalleryAlbumMutationInput,
  type GalleryImageEntity,
  type GalleryImageMutationInput,
  type GalleryListQuery,
} from '../types/gallery'

type PaginatedResponse<T> = {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function toGalleryQueryString(query: GalleryListQuery) {
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
  if (query.filters.albumId) {
    params.set('albumId', String(query.filters.albumId))
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

function toAlbumQueryString(query: GalleryAlbumListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    quickFilter: query.filters.quickFilter,
    sortBy: query.sortBy || 'displayOrder',
    sortOrder: query.sortOrder || 'asc',
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

export const galleryService = {
  list(query: GalleryListQuery) {
    return apiRequest<PaginatedResponse<GalleryImageEntity>>(`/gallery?${toGalleryQueryString(query)}`)
  },

  listAlbums(query: GalleryAlbumListQuery) {
    return apiRequest<PaginatedResponse<GalleryAlbumEntity>>(`/gallery/albums?${toAlbumQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<GalleryImageEntity>(`/gallery/${id}`)
  },

  create(payload: GalleryImageMutationInput) {
    return apiRequest<GalleryImageEntity | GalleryImageEntity[]>('/gallery', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: Partial<GalleryImageMutationInput>) {
    return apiRequest<GalleryImageEntity>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/gallery/${id}`, {
      method: 'DELETE',
    })
  },

  createAlbum(payload: GalleryAlbumMutationInput) {
    return apiRequest<GalleryAlbumEntity>('/gallery/albums', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  updateAlbum(id: number, payload: Partial<GalleryAlbumMutationInput>) {
    return apiRequest<GalleryAlbumEntity>(`/gallery/albums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  removeAlbum(id: number) {
    return apiRequest<null>(`/gallery/albums/${id}`, {
      method: 'DELETE',
    })
  },

  moveImages(imageIds: number[], albumId?: number) {
    return apiRequest<null>('/gallery/move-images', {
      method: 'PATCH',
      body: JSON.stringify({ imageIds, albumId: albumId ?? null }),
    })
  },
}
