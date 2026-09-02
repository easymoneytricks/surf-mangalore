type BookingNotificationPayload = {
  bookingId: number
  bookingStatus: string
  customerName: string
  email: string
  phone?: string | null
  reference?: string
  bookingType?: string
  title?: string
  bookingDate?: Date
  preferredTime?: string | null
  participants?: number
  price?: number | null
}
import { sendBookingStatusEmail } from './email.service'

export const bookingNotificationService = {
  async prepareBookingCreated(_payload: BookingNotificationPayload) {
    return {
      email: { enabled: false, queued: false },
      whatsapp: { enabled: false, queued: false },
      sms: { enabled: false, queued: false },
    }
  },

  async prepareBookingStatusChanged(payload: BookingNotificationPayload) {
    if (['CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(payload.bookingStatus) && payload.reference && payload.title && payload.bookingDate && payload.participants) {
      try {
        await sendBookingStatusEmail({ to: payload.email, customerName: payload.customerName, reference: payload.reference, bookingType: payload.bookingType || 'Booking', title: payload.title, status: payload.bookingStatus, bookingDate: payload.bookingDate, preferredTime: payload.preferredTime, participants: payload.participants, price: payload.price })
        return { email: { enabled: true, queued: false, sent: true }, whatsapp: { enabled: false, queued: false }, sms: { enabled: false, queued: false } }
      } catch {
        return { email: { enabled: true, queued: false, sent: false }, whatsapp: { enabled: false, queued: false }, sms: { enabled: false, queued: false } }
      }
    }
    return {
      email: { enabled: false, queued: false },
      whatsapp: { enabled: false, queued: false },
      sms: { enabled: false, queued: false },
    }
  },
}
