import { API_BASE_URL, safeFetch } from './http'

export type CoachPublicModel = {
  id: number
  slug?: string
  name: string
  role: string
  bio: string
  accent: string
  imageUrl?: string
  coverImageUrl?: string
  social?: {
    instagram?: string
    facebook?: string
    website?: string
  }
  yearsOfExperience?: number
  specialization?: string[]
}

type CoachesListResponse = {
  success: boolean
  message: string
  data: {
    items: Array<{
      id: number
      slug: string
      fullName: string
      jobTitle: string
      shortBio?: string | null
      fullBio?: string | null
      specialization?: string[]
      languages?: string[]
      yearsOfExperience?: number | null
      profilePhotoUrl?: string | null
      coverPhotoUrl?: string | null
      publishStatus?: string
      visibility?: string
      status?: string
      isFeatured?: boolean
      displayOrder?: number
      instagram?: string | null
      facebook?: string | null
      website?: string | null
      socialLinks?: {
        instagram?: string | null
        facebook?: string | null
        website?: string | null
      }
      publicCard?: {
        bio?: string
      }
    }>
  }
}

let coachesCache: CoachPublicModel[] | null = null

function toAccent(item: CoachesListResponse['data']['items'][number]) {
  if (item.specialization?.[0]) {
    return item.specialization[0]
  }

  if (item.languages?.length) {
    return `${item.languages.length} languages`
  }

  if (item.yearsOfExperience) {
    return `${item.yearsOfExperience}+ years`
  }

  return 'Guest favorite'
}

function mapCoach(item: CoachesListResponse['data']['items'][number]): CoachPublicModel {
  return {
    id: item.id,
    slug: item.slug,
    name: item.fullName,
    role: item.jobTitle,
    bio: item.shortBio || item.publicCard?.bio || item.fullBio || 'Friendly coaching for all levels.',
    accent: toAccent(item),
    imageUrl: item.profilePhotoUrl || undefined,
    coverImageUrl: item.coverPhotoUrl || undefined,
    social: {
      instagram: item.socialLinks?.instagram || item.instagram || undefined,
      facebook: item.socialLinks?.facebook || item.facebook || undefined,
      website: item.socialLinks?.website || item.website || undefined,
    },
    yearsOfExperience: item.yearsOfExperience || undefined,
    specialization: item.specialization || [],
  }
}

type CoachDetailResponse = {
  success: boolean
  message: string
  data: CoachesListResponse['data']['items'][number]
}

export async function fetchPublicCoaches() {
  if (coachesCache) {
    return coachesCache
  }

  const response = await safeFetch(`${API_BASE_URL}/coaches?quickFilter=published&status=active&page=1&pageSize=24&sortBy=isFeatured&sortOrder=desc`, undefined, 'Unable to load coaches. Please try again.')
  const json = (await response.json()) as CoachesListResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load coaches')
  }

  const mapped = json.data.items
    .sort((a, b) => {
      const featuredWeight = Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))
      if (featuredWeight !== 0) {
        return featuredWeight
      }

      return (a.displayOrder || 0) - (b.displayOrder || 0)
    })
    .map(mapCoach)

  coachesCache = mapped
  return mapped
}

export async function fetchPublicCoachBySlug(slug: string) {
  const response = await safeFetch(`${API_BASE_URL}/coaches/${slug}`, undefined, 'Unable to load this coach profile. Please try again.')
  const json = (await response.json()) as CoachDetailResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load coach')
  }

  return mapCoach(json.data)
}
