export type BookingStep = 'offering' | 'date' | 'time' | 'participants' | 'details' | 'review' | 'success'

export type PublicBookingType = 'LESSON' | 'EXPERIENCE' | 'EVENT'

export type BookingSelectableItem = {
  id: number
  bookingType: PublicBookingType
  title: string
  description: string
  duration: string
  level: string
  groupSize: string
  badge: string
  pricePerParticipant?: number | null
  eventStart?: string | null
  eventEnd?: string | null
  eventLocation?: string | null
  availability?: Array<{ date: string; slots: Array<{ id: string; label: string; period: string; capacity?: number | null }> }>
}

export type BookingFormData = {
  bookingType: PublicBookingType | ''
  selectedItemId: string
  preferredDate: string
  preferredTime: string
  participants: number
  name: string
  email: string
  phone: string
  emergencyContact: string
  specialNotes: string
}

export type BookingFieldError = Partial<Record<keyof BookingFormData, string>>

export type BookingCreatePayload = {
  bookingType: PublicBookingType
  selectedItemId: number
  preferredDate?: string
  preferredTime?: string
  participants: number
  customerName: string
  email: string
  phone: string
  emergencyContact?: string
  specialNotes?: string
}

export type BookingConfirmation = {
  id: number
  uuid: string
  bookingReference: string
  bookingType: PublicBookingType
  activity?: string | null
  bookingDate: string
  preferredTime?: string
  participants: number
  location?: string | null
  paymentNotice?: string
  customer: {
    name: string
    email: string
    phone?: string
  }
}

export type BookingStepConfig = {
  id: Exclude<BookingStep, 'success'>
  label: string
  helper: string
}
