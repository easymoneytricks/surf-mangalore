import { API_BASE_URL, safeFetch } from './http'

export type EventPublicItem = {
  id: string
  slug: string
  title: string
  date: string
  startDate: string
  startTimeLabel?: string
  location: string
  category: string
  description: string
  image: string
  participants: string
  status: 'upcoming' | 'past'
  tag: string
  featured: boolean
  story: string
  cta: string
}

export type EventPublicDetail = {
  id: number
  slug: string
  title: string
  shortDescription?: string | null
  fullDescription?: string | null
  coverImageUrl?: string | null
  category?: string | null
  eventType?: string | null
  location?: string | null
  startDate: string
  endDate?: string | null
  startTimeLabel?: string | null
  endTimeLabel?: string | null
  maxParticipants?: number | null
  currentParticipants?: number | null
  price?: number | null
  currency?: string | null
  instructor?: string | null
}

type EventListResponse = {
  success: boolean
  message: string
  data: {
    items: Array<{
      id: number
      slug: string
      title: string
      shortDescription?: string | null
      fullDescription?: string | null
      coverImageUrl?: string | null
      category?: string | null
      eventType?: string | null
      location?: string | null
      startDate: string
      endDate?: string | null
      startTimeLabel?: string | null
      capacityMax?: number | null
      currentParticipants?: number | null
      price?: number | string | null
      currency?: string | null
      instructor?: string | null
      isFeatured?: boolean | null
      featuredEvent?: boolean | null
    }>
  }
}

type EventDetailResponse = {
  success: boolean
  message: string
  data: {
    id: number
    slug: string
    title: string
    shortDescription?: string | null
    fullDescription?: string | null
    coverImageUrl?: string | null
    category?: string | null
    eventType?: string | null
    location?: string | null
    startDate: string
    endDate?: string | null
    startTime?: string | null
    endTime?: string | null
    maxParticipants?: number | null
    currentParticipants?: number | null
    price?: number | string | null
    currency?: string | null
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

function formatEventDate(value?: string | null) {
  if (!value) {
    return 'Date TBD'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Date TBD'
  }

  const dateLabel = date.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const timeLabel = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return `${dateLabel} • ${timeLabel}`
}

function buildEventImage(coverImageUrl?: string | null) {
  const imageUrl = coverImageUrl || '/images/placeholders/events.svg'
  return `bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('${imageUrl}')]`
}

function resolveEventStatus(startDate: string) {
  const eventDate = new Date(startDate)
  if (Number.isNaN(eventDate.getTime())) {
    return 'upcoming'
  }

  return eventDate.getTime() >= Date.now() ? 'upcoming' : 'past'
}

function toEventPublicItem(item: EventListResponse['data']['items'][number]): EventPublicItem {
  const description = item.shortDescription || item.fullDescription || 'A surf event available now.'
  const story = item.fullDescription || item.shortDescription || 'A surf event designed for coastal connection and local energy.'
  const category = item.category || item.eventType || 'Surf event'

  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    date: formatEventDate(item.startDate),
    startDate: item.startDate,
    startTimeLabel: item.startTimeLabel || undefined,
    location: item.location || 'Mangalore coast',
    category,
    description,
    image: buildEventImage(item.coverImageUrl),
    participants: item.capacityMax ? `Up to ${item.capacityMax} guests` : 'Flexible group size',
    status: resolveEventStatus(item.startDate),
    tag: item.eventType || category,
    featured: Boolean(item.isFeatured ?? item.featuredEvent),
    story,
    cta: 'Reserve a spot',
  }
}

export async function fetchEvents() {
  const response = await safeFetch(
    `${API_BASE_URL}/events?quickFilter=published&visibility=PUBLIC&page=1&pageSize=24&sortBy=eventStartsAt&sortOrder=asc`,
    undefined,
    'Unable to load events. Please try again.',
  )

  const json = (await response.json()) as EventListResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load events')
  }

  return json.data.items.map(toEventPublicItem)
}

export async function fetchEventBySlug(slug: string) {
  const response = await safeFetch(
    `${API_BASE_URL}/events/slug/${encodeURIComponent(slug)}`,
    undefined,
    'Unable to load this event. Please try again.',
  )
  const json = (await response.json()) as EventDetailResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load event')
  }

  return {
    id: json.data.id,
    slug: json.data.slug,
    title: json.data.title,
    shortDescription: json.data.shortDescription,
    fullDescription: json.data.fullDescription,
    coverImageUrl: json.data.coverImageUrl,
    category: json.data.category,
    eventType: json.data.eventType,
    location: json.data.location,
    startDate: json.data.startDate,
    endDate: json.data.endDate,
    startTimeLabel: json.data.startTime,
    endTimeLabel: json.data.endTime,
    maxParticipants: json.data.maxParticipants,
    currentParticipants: json.data.currentParticipants,
    price: normalizeNumber(json.data.price),
    currency: json.data.currency,
    instructor: json.data.instructor,
  } as EventPublicDetail
}
