import { API_BASE_URL, safeFetch } from './http'

export type ExperiencePublicModel = {
  id: number
  title: string
  slug: string
  description: string
  duration: string
  skillLevel: string
  groupSize: string
  cta: string
  imageLabel: string
  imageClassName: string
  imageUrl: string
  bestFor: string
  support: string
  outcome: string
}

export type ExperiencePublicDetailModel = {
  id: number
  title: string
  slug: string
  shortDescription?: string | null
  fullDescription?: string | null
  coverImageUrl?: string | null
  category?: string | null
  difficulty?: string | null
  duration?: string | null
  maxParticipants?: number | null
  recommendedAge?: string | null
  instructor?: string | null
  price?: number | null
}

type ExperienceListResponse = {
  success: boolean
  message: string
  data: {
    items: Array<{
      id: number
      title: string
      slug: string
      shortDescription?: string | null
      fullDescription?: string | null
      coverImageUrl?: string | null
      category?: string | null
      difficulty?: string | null
      duration?: string | null
      maxParticipants?: number | null
      recommendedAge?: string | null
      instructor?: string | null
      isFeatured?: boolean
      publicCard?: {
        summary?: string | null
      }
    }>
  }
}

type ExperienceDetailResponse = {
  success: boolean
  message: string
  data: {
    id: number
    title: string
    slug: string
    shortDescription?: string | null
    fullDescription?: string | null
    coverImageUrl?: string | null
    category?: string | null
    difficulty?: string | null
    duration?: string | null
    maxParticipants?: number | null
    recommendedAge?: string | null
    instructor?: string | null
    basePrice?: number | string | null
    discountPrice?: number | string | null
  }
}

function normalizeNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return undefined
  }

  const normalized = typeof value === 'number' ? value : Number(value)
  return Number.isNaN(normalized) ? undefined : normalized
}

function toDifficultyLabel(value?: string | null) {
  if (!value || value === 'ALL_LEVELS') {
    return 'All levels'
  }

  return value.charAt(0) + value.slice(1).toLowerCase()
}

function toExperienceCard(item: ExperienceListResponse['data']['items'][number]): ExperiencePublicModel {
  const coverImage = item.coverImageUrl
    ? `url('${item.coverImageUrl}')`
    : "url('/images/placeholders/ocean.svg')"

  const shortDescription = item.shortDescription || item.publicCard?.summary || item.fullDescription || 'Surf experience available now.'
  const groupSize = item.maxParticipants ? `1 to ${item.maxParticipants} guests` : 'Flexible group size'

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: shortDescription,
    duration: item.duration || 'Flexible',
    skillLevel: toDifficultyLabel(item.difficulty),
    groupSize,
    cta: 'Book this experience',
    imageLabel: item.category || 'Surf Experience',
    imageClassName: `bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),${coverImage}] bg-cover bg-center`,
    imageUrl: item.coverImageUrl || '/images/placeholders/ocean.svg',
    bestFor: item.recommendedAge || 'Guests looking for guided surf progression',
    support: item.instructor ? `Led by ${item.instructor}` : 'Guided by certified instructors',
    outcome: item.fullDescription || shortDescription,
  }
}

export async function fetchExperiences() {
  const response = await safeFetch(
    `${API_BASE_URL}/experiences?quickFilter=published&status=active&visibility=PUBLIC&page=1&pageSize=12&sortBy=displayOrder&sortOrder=desc`,
    undefined,
    'Unable to load experiences. Please try again.',
  )
  const json = (await response.json()) as ExperienceListResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load experiences')
  }

  return json.data.items.map(toExperienceCard)
}

export async function fetchExperienceBySlug(slug: string) {
  const response = await safeFetch(`${API_BASE_URL}/experiences/${slug}`, undefined, 'Unable to load this experience. Please try again.')
  const json = (await response.json()) as ExperienceDetailResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load experience')
  }

  return {
    id: json.data.id,
    title: json.data.title,
    slug: json.data.slug,
    shortDescription: json.data.shortDescription,
    fullDescription: json.data.fullDescription,
    coverImageUrl: json.data.coverImageUrl,
    category: json.data.category,
    difficulty: json.data.difficulty,
    duration: json.data.duration,
    maxParticipants: json.data.maxParticipants,
    recommendedAge: json.data.recommendedAge,
    instructor: json.data.instructor,
    price: normalizeNumber(json.data.discountPrice ?? json.data.basePrice),
  }
}
