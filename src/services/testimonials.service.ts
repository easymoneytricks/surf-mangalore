import { API_BASE_URL, safeFetch } from './http'

type TestimonialListResponse = {
  success: boolean
  message: string
  data: {
    items: Array<{
      id: number
      uuid: string
      slug: string
      authorName: string
      authorEmail?: string | null
      authorLocation?: string | null
      quote: string
      rating?: number | null
      status: string
      publishStatus: string
      visibility: string
      isFeatured: boolean
      createdAt: string
      updatedAt: string
    }>
    pagination: {
      page: number
      pageSize: number
      totalItems: number
      totalPages: number
    }
  }
}

export type PublicTestimonial = TestimonialListResponse['data']['items'][number]

export async function fetchPublicTestimonials() {
  const response = await safeFetch(
    `${API_BASE_URL}/testimonials?quickFilter=published&status=active&visibility=PUBLIC&page=1&pageSize=6&sortBy=createdAt&sortOrder=desc`,
    undefined,
    'Unable to load testimonials. Please try again.',
  )
  const json = (await response.json()) as TestimonialListResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load testimonials')
  }

  return json.data.items
}
