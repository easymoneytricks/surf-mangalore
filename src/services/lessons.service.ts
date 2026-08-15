import { API_BASE_URL, safeFetch } from './http'

type LessonPublicCard = {
  title: string
  slug: string
  summary?: string | null
  coverImageUrl?: string | null
  duration?: string | null
  price?: number | null
  featured?: boolean
  visibility?: string
}

export type LessonPublicModel = {
  id: number
  title: string
  slug: string
  shortDescription?: string | null
  fullDescription?: string | null
  coverImageUrl?: string | null
  difficulty?: string | null
  duration?: string | null
  price?: number | null
  maxParticipants?: number | null
  instructor?: string | null
}

type LessonListResponse = {
  success: boolean
  message: string
  data: {
    items: Array<{
      title: string
      slug: string
      shortDescription?: string | null
      fullDescription?: string | null
      coverImageUrl?: string | null
      difficulty?: string | null
      duration?: string | null
      price?: number | null
      maxParticipants?: number | null
      instructor?: string | null
      isFeatured?: boolean
      publishStatus?: string | null
      visibility?: string | null
      publicCard?: LessonPublicCard
    }>
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
    }
  }
}

type LessonDetailResponse = {
  success: boolean
  message: string
  data: {
    id: number
    title: string
    slug: string
    shortDescription?: string | null
    fullDescription?: string | null
    coverImageUrl?: string | null
    difficulty?: string | null
    duration?: string | null
    price?: number | string | null
    maxParticipants?: number | null
    instructor?: string | null
  }
}

function normalizeNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return undefined
  }

  const normalized = typeof value === 'number' ? value : Number(value)
  return Number.isNaN(normalized) ? undefined : normalized
}

export async function fetchLessons() {
  const response = await safeFetch(
    `${API_BASE_URL}/lessons?quickFilter=published&visibility=PUBLIC&page=1&pageSize=12&sortBy=displayOrder&sortOrder=desc`,
    undefined,
    'Unable to load lessons. Please try again.',
  )
  const json = (await response.json()) as LessonListResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load lessons')
  }

  return json.data.items.map((item) => ({
    title: item.title,
    description: item.shortDescription || item.fullDescription || 'Surf lesson available now.',
    level: item.difficulty || 'ALL_LEVELS',
    duration: item.duration || 'Flexible',
    accent: item.publicCard?.featured ? 'Featured lesson' : item.instructor ? `Led by ${item.instructor}` : 'Book now',
    coverImageUrl: item.coverImageUrl,
    slug: item.slug,
    price: item.price,
  }))
}

export async function fetchPublicLessonBySlug(slug: string) {
  const response = await safeFetch(`${API_BASE_URL}/lessons/${slug}`, undefined, 'Unable to load this lesson. Please try again.')
  const json = (await response.json()) as LessonDetailResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load lesson')
  }

  return {
    id: json.data.id,
    title: json.data.title,
    slug: json.data.slug,
    shortDescription: json.data.shortDescription,
    fullDescription: json.data.fullDescription,
    coverImageUrl: json.data.coverImageUrl,
    difficulty: json.data.difficulty,
    duration: json.data.duration,
    price: normalizeNumber(json.data.price),
    maxParticipants: json.data.maxParticipants,
    instructor: json.data.instructor,
  }
}
