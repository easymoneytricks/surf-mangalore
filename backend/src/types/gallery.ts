import {
  GALLERY_ALBUM_SORT_FIELDS,
  GALLERY_LIST_QUICK_FILTERS,
  GALLERY_LIST_SORT_FIELDS,
  GALLERY_STATUSES,
  PUBLISH_STATUSES,
  VISIBILITY_STATUSES,
} from '../constants/gallery'

export type GallerySortFieldValue = (typeof GALLERY_LIST_SORT_FIELDS)[number]
export type GalleryAlbumSortFieldValue = (typeof GALLERY_ALBUM_SORT_FIELDS)[number]
export type GalleryQuickFilterValue = (typeof GALLERY_LIST_QUICK_FILTERS)[number]
export type GalleryStatusValue = (typeof GALLERY_STATUSES)[number]
export type PublishStatusValue = (typeof PUBLISH_STATUSES)[number]
export type VisibilityValue = (typeof VISIBILITY_STATUSES)[number]

export type GalleryListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: GallerySortFieldValue
  sortOrder: 'asc' | 'desc'
  quickFilter: GalleryQuickFilterValue
  albumId?: number
  status?: GalleryStatusValue
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
  featured?: 'true' | 'false'
}

export type GalleryAlbumListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy: GalleryAlbumSortFieldValue
  sortOrder: 'asc' | 'desc'
  quickFilter: GalleryQuickFilterValue
  status?: GalleryStatusValue
  publishStatus?: PublishStatusValue
  visibility?: VisibilityValue
  featured?: 'true' | 'false'
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
  status: GalleryStatusValue
  publishStatus: PublishStatusValue
  visibility: VisibilityValue
}

export type GalleryAlbumMutationInput = {
  name: string
  slug: string
  shortDescription?: string
  coverImageUrl?: string
  displayOrder: number
  status: GalleryStatusValue
  publishStatus: PublishStatusValue
  visibility: VisibilityValue
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
}
