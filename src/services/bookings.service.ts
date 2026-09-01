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
      pricePerParticipant?: number | string | null
      availability?: Array<{ date: string; isActive?: boolean; slots?: Array<{ id?: string; startTime: string; endTime?: string | null; capacity?: number | null; isActive?: boolean }> }>
    }>
    experiences: Array<{
      bookingType: PublicBookingType
      id: number
      title: string
      description?: string | null
      difficulty?: string | null
      duration?: string | null
      maxParticipants?: number | null
      pricePerParticipant?: number | string | null
      availability?: Array<{ date: string; isActive?: boolean; slots?: Array<{ id?: string; startTime: string; endTime?: string | null; capacity?: number | null; isActive?: boolean }> }>
    }>
    events: Array<{
      bookingType: PublicBookingType
      id: number
      title: string
      description?: string | null
      difficulty?: string | null
      duration?: string | null
      maxParticipants?: number | null
      pricePerParticipant?: number | string | null
      eventDate?: string
      eventEnd?: string | null
      location?: string | null
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

type RawAvailabilityDate = { date: string; isActive?: boolean; slots?: Array<{ id?: string; startTime: string; endTime?: string | null; capacity?: number | null; isActive?: boolean }> }

function normalizeAvailability(value: unknown): NonNullable<BookingSelectableItem['availability']> {
  if (!Array.isArray(value)) return []

  return (value as RawAvailabilityDate[]).filter((date) => date && typeof date.date === 'string' && date.isActive !== false).map((date) => ({
    date: date.date.slice(0, 10),
    slots: (Array.isArray(date.slots) ? date.slots : []).filter((slot) => slot && typeof slot.startTime === 'string' && slot.isActive !== false).map((slot) => ({
      id: slot.id || `${slot.startTime}-${slot.endTime || ''}`,
      label: slot.startTime,
      period: slot.endTime ? `Until ${slot.endTime}` : 'Available slot',
      capacity: slot.capacity,
    })),
  }))
}

function mapItems(items: Array<{ bookingType: PublicBookingType; id: number; title: string; description?: string | null; difficulty?: string | null; duration?: string | null; maxParticipants?: number | null; pricePerParticipant?: number | string | null; availability?: unknown; eventDate?: string; eventEnd?: string | null; location?: string | null }>): BookingSelectableItem[] {
  return items.map((item) => ({
    id: item.id,
    bookingType: item.bookingType,
    title: item.title,
    description: item.description || 'Available for booking now.',
    duration: item.duration || 'Flexible',
    level: difficultyToLabel(item.difficulty),
    groupSize: item.maxParticipants ? `1 to ${item.maxParticipants} guests` : 'Flexible group size',
    badge: item.bookingType,
    pricePerParticipant: item.pricePerParticipant === null || item.pricePerParticipant === undefined ? null : Number(item.pricePerParticipant),
    eventStart: item.eventDate || null,
    eventEnd: item.eventEnd || null,
    eventLocation: item.location || null,
    availability: item.bookingType === 'EXPERIENCE' ? normalizeAvailability(item.availability) : [],
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
