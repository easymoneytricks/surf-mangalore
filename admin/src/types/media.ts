export type MediaPublishStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type MediaVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
export type MediaStatus = 'active' | 'archived'

export type MediaEntity = {
  id: number
  uuid: string
  slug: string
  title: string
  description?: string
  status: MediaStatus
  publishStatus: MediaPublishStatus
  visibility: MediaVisibility
  mediaType: 'IMAGE'
  mimeType: string
  fileName: string
  filePath: string
  fileSizeBytes: number
  width: number
  height: number
  altText?: string
  caption?: string
  tags: string[]
  folder: string
  thumbnailUrl: string
  usageCount: number
  createdAt: string
  updatedAt: string
  createdBy?: { id: number; uuid: string; name: string }
  updatedBy?: { id: number; uuid: string; name: string }
}

export type MediaListFilters = {
  folder?: string
  tag?: string
  status?: MediaStatus
  visibility?: MediaVisibility
  publishStatus?: MediaPublishStatus
}

export type MediaListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'fileSizeBytes' | 'width' | 'height'
  sortOrder?: 'asc' | 'desc'
  filters: MediaListFilters
}

export type MediaUploadPayload = {
  files: File[]
  folder?: string
  tags?: string[]
  altText?: string
  caption?: string
  description?: string
}

export type MediaUpdatePayload = {
  title?: string
  folder?: string
  tags?: string[]
  altText?: string
  caption?: string
  description?: string
  status?: MediaStatus
  visibility?: MediaVisibility
  publishStatus?: MediaPublishStatus
  replacementFile?: File
}
