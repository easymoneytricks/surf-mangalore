import { API_BASE_URL, apiRequest, getAuthHeaders } from './http'
import { type MediaEntity, type MediaListQuery, type MediaUpdatePayload, type MediaUploadPayload } from '../types/media'

type MediaListResponse = {
  items: MediaEntity[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

function toQueryString(query: MediaListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder || 'desc',
  })

  if (query.search) {
    params.set('search', query.search)
  }
  if (query.filters.folder) {
    params.set('folder', query.filters.folder)
  }
  if (query.filters.tag) {
    params.set('tag', query.filters.tag)
  }
  if (query.filters.status) {
    params.set('status', query.filters.status)
  }
  if (query.filters.visibility) {
    params.set('visibility', query.filters.visibility)
  }
  if (query.filters.publishStatus) {
    params.set('publishStatus', query.filters.publishStatus)
  }

  return params.toString()
}

function appendOptionalField(formData: FormData, key: string, value?: string) {
  if (!value || !value.trim()) {
    return
  }

  formData.set(key, value.trim())
}

export const mediaService = {
  list(query: MediaListQuery) {
    return apiRequest<MediaListResponse>(`/media?${toQueryString(query)}`)
  },

  getById(id: number) {
    return apiRequest<MediaEntity>(`/media/${id}`)
  },

  upload(payload: MediaUploadPayload, onProgress?: (percent: number) => void) {
    const formData = new FormData()

    payload.files.forEach((file) => {
      formData.append('files', file)
    })

    appendOptionalField(formData, 'folder', payload.folder)
    appendOptionalField(formData, 'altText', payload.altText)
    appendOptionalField(formData, 'caption', payload.caption)
    appendOptionalField(formData, 'description', payload.description)

    if (payload.tags?.length) {
      formData.set('tags', payload.tags.join(','))
    }

    return new Promise<MediaEntity[]>((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('POST', `${API_BASE_URL}/media/upload`)
      request.withCredentials = true

      for (const [key, value] of Object.entries(getAuthHeaders())) {
        request.setRequestHeader(key, value)
      }

      request.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100))
          onProgress(percent)
        }
      }

      request.onerror = () => {
        reject(new Error('Media upload failed'))
      }

      request.onload = () => {
        let json: ApiEnvelope<MediaEntity[]> | null = null

        try {
          json = JSON.parse(request.responseText) as ApiEnvelope<MediaEntity[]>
        } catch {
          json = null
        }

        if (request.status < 200 || request.status >= 300 || !json?.success) {
          reject(new Error(json?.message || 'Media upload failed'))
          return
        }

        onProgress?.(100)
        resolve(json.data)
      }

      request.send(formData)
    })
  },

  update(id: number, payload: MediaUpdatePayload) {
    const formData = new FormData()

    if (payload.title) {
      formData.set('title', payload.title)
    }
    if (payload.folder) {
      formData.set('folder', payload.folder)
    }
    if (payload.altText) {
      formData.set('altText', payload.altText)
    }
    if (payload.caption) {
      formData.set('caption', payload.caption)
    }
    if (payload.description) {
      formData.set('description', payload.description)
    }
    if (payload.status) {
      formData.set('status', payload.status)
    }
    if (payload.visibility) {
      formData.set('visibility', payload.visibility)
    }
    if (payload.publishStatus) {
      formData.set('publishStatus', payload.publishStatus)
    }
    if (payload.tags?.length) {
      formData.set('tags', payload.tags.join(','))
    }
    if (payload.replacementFile) {
      formData.set('file', payload.replacementFile)
    }

    return apiRequest<MediaEntity>(`/media/${id}`, {
      method: 'PATCH',
      body: formData,
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/media/${id}`, {
      method: 'DELETE',
    })
  },
}
