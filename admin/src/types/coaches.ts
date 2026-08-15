export type PublishStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
export type CoachStatus = 'active' | 'inactive'

export type CoachEntity = {
  id: number
  uuid: string
  fullName: string
  slug: string
  profilePhotoUrl?: string
  coverPhotoUrl?: string
  jobTitle: string
  designation?: string
  shortBio?: string
  fullBio?: string
  description?: string
  specialization: string[]
  languages: string[]
  certifications: string[]
  yearsOfExperience?: number
  email?: string
  phone?: string
  socialLinks: {
    instagram?: string
    facebook?: string
    linkedin?: string
    website?: string
  }
  instagram?: string
  facebook?: string
  website?: string
  status: CoachStatus
  active?: boolean
  publishStatus: PublishStatus
  visibility: Visibility
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
  audit: {
    createdAt: string
    updatedAt: string
    createdBy?: { id: number; uuid: string; name: string }
    updatedBy?: { id: number; uuid: string; name: string }
  }
}

export type CoachListFilters = {
  quickFilter: 'all' | 'featured' | 'draft' | 'published'
  status?: CoachStatus
  publishStatus?: PublishStatus
  visibility?: Visibility
  featured?: 'true' | 'false'
}

export type CoachListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'name' | 'displayOrder' | 'yearsExperience' | 'isFeatured' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  filters: CoachListFilters
}

export type CoachMutationInput = {
  fullName: string
  slug: string
  profilePhotoUrl?: string
  coverPhotoUrl?: string
  jobTitle: string
  shortBio?: string
  fullBio?: string
  yearsOfExperience?: number
  specialization: string[]
  languages: string[]
  certifications: string[]
  phone?: string
  email?: string
  instagramUrl?: string
  facebookUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  status: CoachStatus
  publishStatus: PublishStatus
  visibility: Visibility
  isFeatured: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
}
