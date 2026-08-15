export type DashboardRange = 'today' | '7d' | '30d' | '90d'

export type DashboardQuery = {
  range: DashboardRange
}

export type DashboardOverview = {
  range: DashboardRange
  generatedAt: string
  stats: {
    totalBookings: number
    pendingBookings: number
    confirmedBookings: number
    completedBookings: number
    cancelledBookings: number
    noShowBookings: number
    upcomingEvents: number
    activeLessons: number
    unreadContacts: number
  }
  charts: {
    bookingsByDay: Array<{
      date: string
      count: number
    }>
  }
  recentBookings: Array<{
    id: number
    bookingReference: string
    customerName: string
    bookingType: 'LESSON' | 'EXPERIENCE' | 'EVENT'
    bookingStatus: string
    participants: number
    bookingDate: Date
    createdAt: Date
    activity: string | null
  }>
  upcomingEventCapacity: Array<{
    id: number
    title: string
    eventDate: Date
    capacityMax: number | null
    currentParticipants: number
    remainingSpots: number | null
    occupancyPercent: number | null
  }>
  recentActivity: Array<{
    id: number
    action: string
    resourceType: string
    description: string
    createdAt: Date
    actorName: string | null
  }>
}
