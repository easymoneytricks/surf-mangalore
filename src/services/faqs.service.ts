import { API_BASE_URL, safeFetch } from './http'

type FaqListResponse = {
  success: boolean
  message: string
  data: {
    items: Array<{
      id: number
      uuid: string
      slug: string
      question: string
      answer: string
      status: string
      publishStatus: string
      visibility: string
      sortOrder: number
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

export type PublicFaq = FaqListResponse['data']['items'][number]

export async function fetchPublicFaqs() {
  const response = await safeFetch(
    `${API_BASE_URL}/faqs?quickFilter=published&status=active&visibility=PUBLIC&page=1&pageSize=10&sortBy=sortOrder&sortOrder=asc`,
    undefined,
    'Unable to load FAQs. Please try again.',
  )
  const json = (await response.json()) as FaqListResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load FAQs')
  }

  return json.data.items
}
