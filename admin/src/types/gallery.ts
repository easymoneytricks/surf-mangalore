export type PublishStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
export type GalleryStatus = 'active' | 'inactive'

export type GalleryAlbumEntity = {
  id: number
  uuid: string
  name: string
  slug: string
  shortDescription?: string
  description?: string
  coverImageUrl?: string
  displayOrder: number
  status: GalleryStatus
  publishStatus: PublishStatus
  visibility: Visibility
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
  imagesCount: number
  audit: {
    createdAt: string
    updatedAt: string
  }
}

export type GalleryImageEntity = {
  id: number
  uuid: string
  title: string
  slug: string
  altText?: string
  caption?: string
  description?: string
  album?: {
    id: number
    uuid: string
    slug: string
    name: string
    publishStatus: PublishStatus
  } | null
  photographer?: string
  tags: string[]
  isFeatured: boolean
  displayOrder: number
  status: GalleryStatus
  publishStatus: PublishStatus
  visibility: Visibility
  media: {
    id: number
    title: string
    imageUrl: string
    thumbnailUrl: string
    width?: number
    height?: number
  }
  audit: {
    createdAt: string
    updatedAt: string
    createdBy?: { id: number; uuid: string; name: string }
    updatedBy?: { id: number; uuid: string; name: string }
  }
}

export type GalleryListFilters = {
  quickFilter: 'all' | 'published' | 'draft' | 'featured' | 'recent'
  albumId?: number
  status?: GalleryStatus
  publishStatus?: PublishStatus
  visibility?: Visibility
  featured?: 'true' | 'false'
}

export type GalleryAlbumListFilters = {
  quickFilter: 'all' | 'published' | 'draft' | 'featured' | 'recent'
  status?: GalleryStatus
  publishStatus?: PublishStatus
  visibility?: Visibility
  featured?: 'true' | 'false'
}

export type GalleryListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'title' | 'displayOrder' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  filters: GalleryListFilters
}

export type GalleryAlbumListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'name' | 'displayOrder' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  filters: GalleryAlbumListFilters
}

export type GalleryImageMutationInput = {
  title: string
  slug: string
  altText?: string
  caption?: string
  description?: string
  albumId?: number
  mediaId?: number
  mediaIds?: number[]
  photographer?: string
  tags: string[]
  isFeatured: boolean
  displayOrder: number
  status: GalleryStatus
  publishStatus: PublishStatus
  visibility: Visibility
}

export type GalleryAlbumMutationInput = {
  name: string
  slug: string
  shortDescription?: string
  coverImageUrl?: string
  displayOrder: number
  status: GalleryStatus
  publishStatus: PublishStatus
  visibility: Visibility
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
}
