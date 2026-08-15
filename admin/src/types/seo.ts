export type AdminSeoPublishStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type AdminSeoVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'

export type AdminSeoEntity = {
  id: number
  uuid: string
  slug: string
  name: string
  title: string
  status: string
  publishStatus: AdminSeoPublishStatus
  visibility: AdminSeoVisibility
  routePath: string
  canonicalUrl?: string | null
  metaTitle: string
  metaDescription?: string | null
  metaKeywords: string[]
  robots?: string | null
  openGraphTitle?: string | null
  openGraphDescription?: string | null
  openGraphImage?: string | null
  schemaJson?: unknown
  localeCode?: string | null
  lesson?: { id: number; title: string; slug: string } | null
  experience?: { id: number; title: string; slug: string } | null
  event?: { id: number; title: string; slug: string } | null
  createdAt: string
  updatedAt: string
}

export type AdminSeoListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'updatedAt' | 'createdAt' | 'routePath' | 'metaTitle'
  sortOrder?: 'asc' | 'desc'
  quickFilter?: 'all' | 'published' | 'draft' | 'public' | 'private' | 'indexable' | 'noindex'
  publishStatus?: AdminSeoPublishStatus
  visibility?: AdminSeoVisibility
}

export type AdminSeoMutationInput = {
  name: string
  title: string
  slug?: string
  routePath: string
  canonicalUrl?: string
  metaTitle: string
  metaDescription?: string
  metaKeywords: string[]
  robots?: 'index,follow' | 'noindex,nofollow' | 'noindex,follow' | 'index,nofollow'
  openGraphTitle?: string
  openGraphDescription?: string
  openGraphImage?: string
  schemaJson?: unknown
  publishStatus: AdminSeoPublishStatus
  visibility: AdminSeoVisibility
  status: string
}
