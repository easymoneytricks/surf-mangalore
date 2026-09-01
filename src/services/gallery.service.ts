import { API_BASE_URL, safeFetch } from './http'

export type GalleryPublicCategory = {
  id: number
  name: string
  slug: string
}

export type GalleryPublicItem = {
  id: string
  title: string
  category: string
  imageUrl: string
  description: string
  featured: boolean
  frame: 'portrait' | 'landscape' | 'standard'
  altText: string
}

type GalleryListResponse = {
  success: boolean
  message: string
  data: {
    items: Array<{
      id: number
      title: string
      description?: string | null
      caption?: string | null
      altText?: string | null
      isFeatured?: boolean
      album?: {
        name: string
      } | null
      media: {
        imageUrl: string
        width?: number | null
        height?: number | null
      }
    }>
  }
}

type GalleryAlbumsResponse = {
  success: boolean
  message: string
  data: {
    items: Array<{
      id: number
      name: string
      slug: string
    }>
  }
}

function resolveFrame(width?: number | null, height?: number | null): 'portrait' | 'landscape' | 'standard' {
  if (!width || !height) {
    return 'standard'
  }

  const ratio = width / height
  if (ratio >= 1.45) {
    return 'landscape'
  }
  if (ratio <= 0.85) {
    return 'portrait'
  }

  return 'standard'
}

function mapItem(item: GalleryListResponse['data']['items'][number]): GalleryPublicItem {
  return {
    id: String(item.id),
    title: item.title,
    category: item.album?.name || 'Gallery',
    imageUrl: item.media.imageUrl,
    description: item.description || item.caption || 'Coastal surf moment.',
    featured: Boolean(item.isFeatured),
    frame: resolveFrame(item.media.width, item.media.height),
    altText: item.altText || item.title,
  }
}

export async function fetchGalleryItems(options?: { featuredOnly?: boolean; pageSize?: number }) {
  const featuredOnly = options?.featuredOnly === true
  const pageSize = options?.pageSize || 36
  const query = featuredOnly ? `quickFilter=featured&status=active&featured=true&page=1&pageSize=${pageSize}&sortBy=displayOrder&sortOrder=asc` : 'quickFilter=published&status=active&page=1&pageSize=36&sortBy=createdAt&sortOrder=desc'
  const response = await safeFetch(`${API_BASE_URL}/gallery?${query}`, undefined, 'Unable to load the gallery. Please try again.')
  const json = (await response.json()) as GalleryListResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load gallery images')
  }

  return json.data.items.map(mapItem)
}

export async function fetchGalleryCategories() {
  const response = await safeFetch(`${API_BASE_URL}/gallery/albums?quickFilter=published&page=1&pageSize=100&sortBy=displayOrder&sortOrder=asc`, undefined, 'Unable to load gallery albums. Please try again.')
  const json = (await response.json()) as GalleryAlbumsResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load gallery albums')
  }

  return json.data.items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
  }))
}
