import { API_BASE_URL, safeFetch } from './http'

type SeoPublicResponse = {
  id: number
  routePath: string
  canonicalUrl?: string | null
  metaTitle: string
  metaDescription?: string | null
  metaKeywords: string[]
  robots?: string | null
  openGraphTitle?: string | null
  openGraphDescription?: string | null
  openGraphImage?: string | null
}

export async function fetchSeoForPath(pathname: string): Promise<SeoPublicResponse | null> {
  try {
    const params = new URLSearchParams({ path: pathname }).toString()
    const response = await safeFetch(`${API_BASE_URL}/seo/public?${params}`, undefined, 'Unable to load SEO metadata.')

    if (!response.ok) {
      return null
    }

    const json = (await response.json()) as { success?: boolean; data?: SeoPublicResponse | null }
    if (!json?.success) {
      return null
    }

    return json.data ?? null
  } catch {
    return null
  }
}
