import { type BookingConfirmation, type BookingCreatePayload, type BookingSelectableItem, type PublicBookingType } from '../types/booking'
import { API_BASE_URL, safeFetch } from './http'

type BookableOptionsResponse = {
  success: boolean
  message: string
  data: {
    lessons: Array<{
      bookingType: PublicBookingType
      id: number
      title: string
      description?: string | null
      difficulty?: string | null
      duration?: string | null
      maxParticipants?: number | null
    }>
    experiences: Array<{
      bookingType: PublicBookingType
      id: number
      title: string
      description?: string | null
      difficulty?: string | null
      duration?: string | null
      maxParticipants?: number | null
    }>
    events: Array<{
      bookingType: PublicBookingType
      id: number
      title: string
      description?: string | null
      difficulty?: string | null
      duration?: string | null
      maxParticipants?: number | null
    }>
  }
}

type CreateBookingResponse = {
  success: boolean
  message: string
  data: BookingConfirmation
}

function difficultyToLabel(value?: string | null) {
  if (!value || value === 'ALL_LEVELS') {
    return 'All levels'
  }

  return `${value.charAt(0)}${value.slice(1).toLowerCase()}`
}

function mapItems(items: Array<{ bookingType: PublicBookingType; id: number; title: string; description?: string | null; difficulty?: string | null; duration?: string | null; maxParticipants?: number | null }>): BookingSelectableItem[] {
  return items.map((item) => ({
    id: item.id,
    bookingType: item.bookingType,
    title: item.title,
    description: item.description || 'Available for booking now.',
    duration: item.duration || 'Flexible',
    level: difficultyToLabel(item.difficulty),
    groupSize: item.maxParticipants ? `1 to ${item.maxParticipants} guests` : 'Flexible group size',
    badge: item.bookingType,
  }))
}

export async function fetchBookableOptions() {
  const response = await safeFetch(`${API_BASE_URL}/bookings/options`, undefined, 'Unable to load booking options. Please try again.')
  const json = (await response.json()) as BookableOptionsResponse

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Failed to load bookable options')
  }

  return [
    ...mapItems(json.data.lessons),
    ...mapItems(json.data.experiences),
    ...mapItems(json.data.events),
  ]
}

export async function createBooking(payload: BookingCreatePayload) {
  const response = await safeFetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }, 'Unable to submit booking right now. Please try again.')

  const json = (await response.json()) as Partial<CreateBookingResponse>

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message || 'Failed to submit booking request')
  }

  return json.data
}
