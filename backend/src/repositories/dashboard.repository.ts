import { type BookingStatus } from '@prisma/client'

import { prisma } from '../lib/prisma'

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'NO_SHOW', 'CANCELLED', 'REJECTED']

export const dashboardRepository = {
  async countBookingsBetween(from: Date, to: Date) {
    return prisma.booking.count({
      where: {
        deletedAt: null,
        bookingStatus: { in: ACTIVE_BOOKING_STATUSES },
        createdAt: { gte: from, lt: to },
      },
    })
  },

  async countBookingsByStatusBetween(from: Date, to: Date, status: BookingStatus) {
    return prisma.booking.count({
      where: {
        deletedAt: null,
        bookingStatus: status,
        createdAt: { gte: from, lt: to },
      },
    })
  },

  async countUpcomingEvents(from: Date) {
    return prisma.event.count({
      where: {
        deletedAt: null,
        status: 'active',
        publishStatus: 'PUBLISHED',
        visibility: 'PUBLIC',
        eventStatus: { notIn: ['CANCELLED', 'COMPLETED', 'DRAFT'] },
        eventStartsAt: { gte: from },
      },
    })
  },

  async countActiveLessons() {
    return prisma.lesson.count({
      where: {
        deletedAt: null,
        status: 'active',
        publishStatus: 'PUBLISHED',
        visibility: 'PUBLIC',
      },
    })
  },

  async countUnreadContacts() {
    return prisma.contactMessage.count({
      where: {
        deletedAt: null,
        status: 'NEW',
      },
    })
  },

  async listRecentBookings(limit: number) {
    return prisma.booking.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        lesson: { select: { title: true } },
        experience: { select: { title: true } },
        event: { select: { title: true } },
      },
    })
  },

  async listUpcomingEventCapacity(limit: number, from: Date) {
    return prisma.event.findMany({
      where: {
        deletedAt: null,
        status: 'active',
        publishStatus: 'PUBLISHED',
        visibility: 'PUBLIC',
        eventStatus: { notIn: ['CANCELLED', 'COMPLETED', 'DRAFT'] },
        eventStartsAt: { gte: from },
      },
      orderBy: { eventStartsAt: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        eventStartsAt: true,
        capacityMax: true,
        currentParticipants: true,
      },
    })
  },

  async listRecentAuditActivity(limit: number) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        actor: {
          select: {
            name: true,
          },
        },
      },
    })
  },

  async listBookingsGroupedByDay(from: Date, to: Date) {
    return prisma.booking.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: from, lt: to },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  },
}
