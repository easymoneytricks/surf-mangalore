import { Prisma, type BookingStatus, type BookingType } from '@prisma/client'

import { prisma } from '../lib/prisma'

const bookingInclude = {
  lesson: { select: { id: true, title: true, slug: true } },
  experience: { select: { id: true, title: true, slug: true } },
  event: { select: { id: true, title: true, slug: true, capacityMax: true, currentParticipants: true, locationName: true, eventStartsAt: true, eventEndsAt: true, startTimeLabel: true, endTimeLabel: true } },
  location: { select: { id: true, name: true, slug: true } },
  beach: { select: { id: true, name: true, slug: true } },
  activityLogs: {
    orderBy: { createdAt: 'desc' as const },
    include: {
      adminUser: { select: { id: true, uuid: true, name: true } },
    },
  },
} as const

export type BookingRecord = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>

export const bookingRepository = {
  async listRaw(params: {
    where: Prisma.BookingWhereInput
    orderBy: Prisma.BookingOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.booking.count({ where: params.where }),
      prisma.booking.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: bookingInclude,
      }),
    ])

    return { total, items }
  },

  async findById(id: number) {
    return prisma.booking.findFirst({
      where: { id, deletedAt: null },
      include: bookingInclude,
    })
  },

  async create(data: Prisma.BookingCreateInput) {
    return prisma.booking.create({
      data,
      include: bookingInclude,
    })
  },

  async update(id: number, data: Prisma.BookingUpdateInput) {
    return prisma.booking.update({
      where: { id },
      data,
      include: bookingInclude,
    })
  },

  async findRecentDuplicate(params: {
    bookingType: BookingType
    selectedItemId: number
    email: string
    bookingDate: Date
    participantCount: number
    createdAfter: Date
  }) {
    const relationFilter: Prisma.BookingWhereInput =
      params.bookingType === 'LESSON'
        ? { lessonId: params.selectedItemId }
        : params.bookingType === 'EXPERIENCE'
          ? { experienceId: params.selectedItemId }
          : { eventId: params.selectedItemId }

    return prisma.booking.findFirst({
      where: {
        deletedAt: null,
        bookingType: params.bookingType,
        email: { equals: params.email, mode: 'insensitive' },
        bookingDate: params.bookingDate,
        participantCount: params.participantCount,
        createdAt: { gte: params.createdAfter },
        ...relationFilter,
      },
      select: { id: true, uuid: true, createdAt: true },
    })
  },

  async createActivity(data: {
    bookingId: number
    action: 'CREATED' | 'STATUS_CHANGED' | 'UPDATED' | 'CANCELLED'
    oldStatus?: BookingStatus
    newStatus?: BookingStatus
    note?: string
    adminUserId?: number
    metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput
  }) {
    return prisma.bookingActivity.create({
      data: {
        booking: { connect: { id: data.bookingId } },
        action: data.action,
        oldStatus: data.oldStatus,
        newStatus: data.newStatus,
        note: data.note,
        metadata: data.metadata,
        adminUser: data.adminUserId ? { connect: { id: data.adminUserId } } : undefined,
      },
    })
  },

  async findBookableByType(type: BookingType, id: number) {
    if (type === 'LESSON') {
      return prisma.lesson.findFirst({
        where: {
          id,
          deletedAt: null,
          status: 'active',
          publishStatus: 'PUBLISHED',
          visibility: 'PUBLIC',
        },
        select: { id: true, title: true, slug: true, status: true, publishStatus: true, visibility: true, maxParticipants: true, price: true },
      })
    }

    if (type === 'EXPERIENCE') {
      return prisma.experience.findFirst({
        where: {
          id,
          deletedAt: null,
          publishStatus: 'PUBLISHED',
          visibility: 'PUBLIC',
          status: 'active',
        },
        select: { id: true, title: true, slug: true, status: true, publishStatus: true, visibility: true, maxParticipants: true, basePrice: true, discountPrice: true, metadata: true },
      })
    }

    return prisma.event.findFirst({
      where: {
        id,
        deletedAt: null,
        publishStatus: 'PUBLISHED',
        visibility: 'PUBLIC',
        status: 'active',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishStatus: true,
        visibility: true,
        eventStatus: true,
        eventStartsAt: true,
        capacityMax: true,
        currentParticipants: true,
        locationName: true,
      },
    })
  },

  async findEventForCapacity(id: number) {
    return prisma.event.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        eventStartsAt: true,
        status: true,
        publishStatus: true,
        visibility: true,
        eventStatus: true,
        capacityMax: true,
        currentParticipants: true,
        locationName: true,
      },
    })
  },

  async sumParticipantsByEvent(eventId: number, statuses: BookingStatus[]) {
    const result = await prisma.booking.aggregate({
      where: {
        deletedAt: null,
        eventId,
        bookingStatus: { in: statuses },
      },
      _sum: {
        participantCount: true,
      },
    })

    return result._sum.participantCount ?? 0
  },

  async adjustEventParticipants(eventId: number, delta: number) {
    return prisma.event.updateMany({
      where: {
        id: eventId,
        deletedAt: null,
      },
      data: {
        currentParticipants: {
          increment: delta,
        },
      },
    })
  },

  async listBookableOptions() {
    const [lessons, experiences, events] = await prisma.$transaction([
      prisma.lesson.findMany({
        where: { deletedAt: null, publishStatus: 'PUBLISHED', visibility: 'PUBLIC' },
        orderBy: { displayOrder: 'desc' },
        select: { id: true, title: true, slug: true, shortDescription: true, difficulty: true, duration: true, maxParticipants: true, price: true },
      }),
      prisma.experience.findMany({
        where: { deletedAt: null, publishStatus: 'PUBLISHED', visibility: 'PUBLIC', status: 'active' },
        orderBy: { displayOrder: 'desc' },
        select: { id: true, title: true, slug: true, shortDescription: true, difficulty: true, duration: true, maxParticipants: true, basePrice: true, discountPrice: true, metadata: true },
      }),
      prisma.event.findMany({
        where: { deletedAt: null, publishStatus: 'PUBLISHED', visibility: 'PUBLIC', status: 'active' },
        orderBy: { eventStartsAt: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          difficulty: true,
          startTimeLabel: true,
          capacityMax: true,
          currentParticipants: true,
          locationName: true,
          eventStartsAt: true,
          eventEndsAt: true,
          basePrice: true,
          discountPrice: true,
        },
      }),
    ])

    return { lessons, experiences, events }
  },
}
