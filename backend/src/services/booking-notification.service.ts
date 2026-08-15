type BookingNotificationPayload = {
  bookingId: number
  bookingStatus: string
  customerName: string
  email: string
  phone?: string | null
}

export const bookingNotificationService = {
  async prepareBookingCreated(_payload: BookingNotificationPayload) {
    return {
      email: { enabled: false, queued: false },
      whatsapp: { enabled: false, queued: false },
      sms: { enabled: false, queued: false },
    }
  },

  async prepareBookingStatusChanged(_payload: BookingNotificationPayload) {
    return {
      email: { enabled: false, queued: false },
      whatsapp: { enabled: false, queued: false },
      sms: { enabled: false, queued: false },
    }
  },
}
