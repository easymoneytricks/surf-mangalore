import { type BookingStatus } from '@prisma/client'

import { dashboardRepository } from '../repositories/dashboard.repository'
import { type DashboardOverview, type DashboardQuery, type DashboardRange } from '../types/dashboard'

function startOfDay(value: Date) {
  const normalized = new Date(value)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

function addDays(value: Date, days: number) {
  const next = new Date(value)
  next.setDate(next.getDate() + days)
  return next
}

function getRangeDays(range: DashboardRange) {
  if (range === 'today') {
    return 1
  }

  if (range === '30d') {
    return 30
  }

  if (range === '90d') {
    return 90
  }

  return 7
}

async function countStatus(from: Date, to: Date, status: BookingStatus) {
  return dashboardRepository.countBookingsByStatusBetween(from, to, status)
}

function buildDailySeries(from: Date, days: number, samples: Array<{ createdAt: Date }>) {
  const map = new Map<string, number>()

  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(from, offset)
    const key = date.toISOString().slice(0, 10)
    map.set(key, 0)
  }

  for (const sample of samples) {
    const key = sample.createdAt.toISOString().slice(0, 10)
    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + 1)
    }
  }

  return [...map.entries()].map(([date, count]) => ({ date, count }))
}

export const dashboardService = {
  async getOverview(query: DashboardQuery): Promise<DashboardOverview> {
    const range = query.range || '7d'
    const days = getRangeDays(range)
    const now = new Date()
    const from = startOfDay(addDays(now, -(days - 1)))
    const to = addDays(startOfDay(now), 1)
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      noShowBookings,
      upcomingEvents,
      activeLessons,
      unreadContacts,
      recentBookings,
      upcomingEventCapacity,
      recentActivity,
      bookingsByDayRaw,
    ] = await Promise.all([
      dashboardRepository.countBookingsBetween(from, to),
      countStatus(from, to, 'PENDING'),
      countStatus(from, to, 'CONFIRMED'),
      countStatus(from, to, 'COMPLETED'),
      countStatus(from, to, 'CANCELLED'),
      countStatus(from, to, 'NO_SHOW'),
      dashboardRepository.countUpcomingEvents(now),
      dashboardRepository.countActiveLessons(),
      dashboardRepository.countUnreadContacts(),
      dashboardRepository.listRecentBookings(8),
      dashboardRepository.listUpcomingEventCapacity(8, now),
      dashboardRepository.listRecentAuditActivity(12),
      dashboardRepository.listBookingsGroupedByDay(from, to),
    ])

    const bookingsByDay = buildDailySeries(from, days, bookingsByDayRaw)

    return {
      range,
      generatedAt: now.toISOString(),
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        noShowBookings,
        upcomingEvents,
        activeLessons,
        unreadContacts,
      },
      charts: {
        bookingsByDay,
      },
      recentBookings: recentBookings.map((item) => ({
        id: item.id,
        bookingReference: item.slug || `SM-${item.createdAt.getUTCFullYear()}-${String(item.id).padStart(6, '0')}`,
        customerName: item.fullName,
        bookingType: item.bookingType,
        bookingStatus: item.bookingStatus,
        participants: item.participantCount,
        bookingDate: item.bookingDate,
        createdAt: item.createdAt,
        activity: item.lesson?.title || item.experience?.title || item.event?.title || null,
      })),
      upcomingEventCapacity: upcomingEventCapacity.map((item) => {
        const remainingSpots = item.capacityMax ? Math.max(item.capacityMax - item.currentParticipants, 0) : null
        const occupancyPercent = item.capacityMax && item.capacityMax > 0
          ? Math.min(100, Math.round((item.currentParticipants / item.capacityMax) * 100))
          : null

        return {
          id: item.id,
          title: item.title,
          eventDate: item.eventStartsAt,
          capacityMax: item.capacityMax,
          currentParticipants: item.currentParticipants,
          remainingSpots,
          occupancyPercent,
        }
      }),
      recentActivity: recentActivity.map((item) => ({
        id: item.id,
        action: item.action,
        resourceType: item.resourceType,
        description: item.description,
        createdAt: item.createdAt,
        actorName: item.actor?.name ?? null,
      })),
    }
  },
}
