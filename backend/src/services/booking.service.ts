import { type Prisma, type BookingType, type BookingStatus } from '@prisma/client'

import { HTTP_STATUS } from '../constants/http'
import { bookingRepository, type BookingRecord } from '../repositories/booking.repository'
import { bookingNotificationService } from './booking-notification.service'
import { auditLogService } from './audit-log.service'
import { ApiError } from '../utils/api-error'
import { type BookingCreateInput, type BookingListQuery, type BookingStatusPatchInput, type BookingUpdateInput } from '../types/booking'
import { normalizePagination, buildPaginationMeta } from '../content-engine'

const BOOKING_REFERENCE_PREFIX = 'SM'
const EVENT_CAPACITY_CONSUMING_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED']

function toBookingDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
}

function toDateOnlyString(value: Date) {
  return value.toISOString().slice(0, 10)
}

function formatBookingReference(id: number, createdAt: Date, type?: BookingType) {
  const prefix = type === 'LESSON' ? 'LESSON' : type === 'EXPERIENCE' ? 'EXP' : type === 'EVENT' ? 'EVENT' : ''
  return `${BOOKING_REFERENCE_PREFIX}-${prefix ? `${prefix}-` : ''}${createdAt.getUTCFullYear()}-${String(id).padStart(6, '0')}`
}

function consumesEventCapacity(status: BookingStatus) {
  return EVENT_CAPACITY_CONSUMING_STATUSES.includes(status)
}

function resolveAvailability(capacity: number | null | undefined, booked: number) {
  if (!capacity || capacity <= 0) {
    return {
      status: 'AVAILABLE' as const,
      booked,
      remaining: null,
      capacity: capacity ?? null,
    }
  }

  const remaining = Math.max(capacity - booked, 0)
  if (remaining === 0) {
    return { status: 'FULL' as const, booked, remaining, capacity }
  }

  if (remaining <= Math.max(1, Math.ceil(capacity * 0.2))) {
    return { status: 'LIMITED' as const, booked, remaining, capacity }
  }

  return { status: 'AVAILABLE' as const, booked, remaining, capacity }
}

function toBookingResponse(booking: BookingRecord) {
  const selectedItem = booking.bookingType === 'LESSON'
    ? booking.lesson
    : booking.bookingType === 'EXPERIENCE'
      ? booking.experience
      : booking.event

  const bookingReference = booking.slug || formatBookingReference(booking.id, booking.createdAt, booking.bookingType)
  const paymentNotice = 'Payment is collected at the venue.'
  const eventAvailability = booking.bookingType === 'EVENT' && booking.event
    ? resolveAvailability(booking.event.capacityMax, booking.event.currentParticipants)
    : null
  const metadata = booking.metadata && typeof booking.metadata === 'object' && !Array.isArray(booking.metadata) ? booking.metadata as Record<string, unknown> : {}

  return {
    id: booking.id,
    uuid: booking.uuid,
    bookingReference,
    bookingType: booking.bookingType,
    activity: selectedItem?.title || null,
    selectedItem,
    event: booking.event ? { id: booking.event.id, title: booking.event.title, slug: booking.event.slug, startsAt: booking.event.eventStartsAt, endsAt: booking.event.eventEndsAt, startTimeLabel: booking.event.startTimeLabel, endTimeLabel: booking.event.endTimeLabel } : null,
    lesson: booking.lesson ? { id: booking.lesson.id, title: booking.lesson.title, slug: booking.lesson.slug } : null,
    experience: booking.experience ? { id: booking.experience.id, title: booking.experience.title, slug: booking.experience.slug } : null,
    bookingDate: booking.bookingDate,
    bookingDateLabel: toDateOnlyString(booking.bookingDate),
    preferredTime: booking.preferredTime || (booking.bookingType === 'EVENT' ? [booking.event?.startTimeLabel, booking.event?.endTimeLabel].filter(Boolean).join(' – ') || undefined : undefined),
    participants: booking.participantCount,
    participantCount: booking.participantCount,
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    source: booking.source,
    paymentNotice,
    location: booking.location?.name ?? booking.event?.locationName ?? booking.beach?.name ?? null,
    eventAvailability,
    pricing: metadata.pricing || null,
    customer: {
      name: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      emergencyContact: booking.emergencyContact,
    },
    specialNotes: booking.notes,
    internalNotes: booking.internalNotes,
    assignedInstructor: booking.assignedInstructor,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    activityHistory: booking.activityLogs.map((item) => ({
      id: item.id,
      uuid: item.uuid,
      action: item.action,
      oldStatus: item.oldStatus,
      newStatus: item.newStatus,
      note: item.note,
      adminUser: item.adminUser,
      createdAt: item.createdAt,
    })),
  }
}

function buildListWhere(query: BookingListQuery): Prisma.BookingWhereInput {
  const where: Prisma.BookingWhereInput = { deletedAt: null }

  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { phone: { contains: query.search, mode: 'insensitive' } },
      { lesson: { title: { contains: query.search, mode: 'insensitive' } } },
      { experience: { title: { contains: query.search, mode: 'insensitive' } } },
      { event: { title: { contains: query.search, mode: 'insensitive' } } },
    ]
  }

  if (query.quickFilter === 'pending') {
    where.bookingStatus = 'PENDING'
  }
  if (query.quickFilter === 'confirmed') {
    where.bookingStatus = 'CONFIRMED'
  }
  if (query.quickFilter === 'completed') {
    where.bookingStatus = 'COMPLETED'
  }
  if (query.quickFilter === 'cancelled') {
    where.bookingStatus = 'CANCELLED'
  }
  if (query.quickFilter === 'rejected') {
    where.bookingStatus = 'REJECTED'
  }
  if (query.quickFilter === 'no_show') {
    where.bookingStatus = 'NO_SHOW'
  }

  if (query.bookingStatus) {
    where.bookingStatus = query.bookingStatus
  }

  if (query.bookingType) {
    where.bookingType = query.bookingType
  }

  if (query.eventId) {
    where.eventId = query.eventId
  }

  if (query.lessonId) {
    where.lessonId = query.lessonId
  }

  if (query.experienceId) {
    where.experienceId = query.experienceId
  }

  if (query.instructor) {
    where.assignedInstructor = { contains: query.instructor, mode: 'insensitive' }
  }

  if (query.fromDate || query.toDate) {
    const dateFilter: Prisma.DateTimeFilter = {}

    if (query.fromDate) {
      dateFilter.gte = toBookingDate(query.fromDate)
    }

    if (query.toDate) {
      const endDate = toBookingDate(query.toDate)
      endDate.setUTCDate(endDate.getUTCDate() + 1)
      dateFilter.lt = endDate
    }

    where.bookingDate = dateFilter
  }

  return where
}

function getOrderBy(query: BookingListQuery): Prisma.BookingOrderByWithRelationInput {
  const sortField = query.sortBy || 'bookingDate'
  const sortOrder = query.sortOrder || 'desc'

  return {
    [sortField]: sortOrder,
  } as Prisma.BookingOrderByWithRelationInput
}

async function ensureBookableItemExists(bookingType: BookingType, selectedItemId: number) {
  const item = await bookingRepository.findBookableByType(bookingType, selectedItemId)
  if (!item) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Selected item is not available for booking')
  }

  return item
}

async function ensureEventCanBeBooked(input: BookingCreateInput) {
  if (input.bookingType !== 'EVENT') {
    return null
  }

  const event = await bookingRepository.findEventForCapacity(input.selectedItemId)
  if (!event) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Selected event is invalid')
  }

  if (event.status !== 'active' || event.publishStatus !== 'PUBLISHED' || event.visibility !== 'PUBLIC') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Event is not available for booking')
  }

  if (event.eventStatus === 'CANCELLED' || event.eventStatus === 'COMPLETED' || event.eventStatus === 'DRAFT') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Event is no longer accepting bookings')
  }

  if (event.eventStartsAt.getTime() <= Date.now()) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Event has already passed')

  const booked = await bookingRepository.sumParticipantsByEvent(event.id, EVENT_CAPACITY_CONSUMING_STATUSES)
  const availability = resolveAvailability(event.capacityMax, booked)
  if (availability.remaining !== null && input.participants > availability.remaining) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'This event is fully booked or has insufficient remaining capacity')
  }

  return event
}

async function resolveSchedule(input: BookingCreateInput) {
  if (input.bookingType === 'EVENT') {
    const event = await bookingRepository.findEventForCapacity(input.selectedItemId)
    if (!event) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Selected event is invalid')
    return { date: toDateOnlyString(event.eventStartsAt), time: undefined as string | undefined }
  }
  if (!input.preferredDate) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'A start date is required')
  if (input.bookingType === 'EXPERIENCE') {
    const item = await bookingRepository.findBookableByType('EXPERIENCE', input.selectedItemId)
    const rawMetadata = (item as { metadata?: unknown } | null)?.metadata
    const metadata = rawMetadata && typeof rawMetadata === 'object' && !Array.isArray(rawMetadata) ? rawMetadata as Record<string, unknown> : {}
    const dates = Array.isArray(metadata.availability) ? metadata.availability as Array<{ date: string; isActive?: boolean; slots?: Array<{ startTime: string; endTime?: string; capacity?: number; isActive?: boolean }> }> : []
    const date = dates.find((entry) => entry.date === input.preferredDate && entry.isActive !== false)
    const selectedSlot = date?.slots?.find((slot) => slot.isActive !== false && (`${slot.startTime}-${slot.endTime || ''}` === input.preferredTime || slot.startTime === input.preferredTime))
    const validSlot = Boolean(selectedSlot)
    if (!date || !validSlot) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Selected experience date or time slot is not available')
    if (selectedSlot?.capacity && input.participants > selectedSlot.capacity) throw new ApiError(HTTP_STATUS.CONFLICT, 'Participant count exceeds this experience slot capacity')
  }
  return { date: input.preferredDate, time: input.preferredTime }
}

async function ensureBookingReference(id: number) {
  const booking = await bookingRepository.findById(id)
  if (!booking) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found')
  }

  if (booking.slug) {
    return booking
  }

  const reference = formatBookingReference(booking.id, booking.createdAt, booking.bookingType)
  const updated = await bookingRepository.update(id, { slug: reference })
  return updated
}

async function ensureBookingExists(id: number) {
  const booking = await bookingRepository.findById(id)
  if (!booking) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Booking not found')
  }

  return booking
}

function buildCreateData(input: BookingCreateInput, source: 'WEBSITE' | 'ADMIN', pricing?: { pricePerParticipant: number | null; total: number }): Prisma.BookingCreateInput {
  const relationData: Pick<Prisma.BookingCreateInput, 'lesson' | 'experience' | 'event'> =
    input.bookingType === 'LESSON'
      ? { lesson: { connect: { id: input.selectedItemId } }, experience: undefined, event: undefined }
      : input.bookingType === 'EXPERIENCE'
        ? { experience: { connect: { id: input.selectedItemId } }, lesson: undefined, event: undefined }
        : { event: { connect: { id: input.selectedItemId } }, lesson: undefined, experience: undefined }

  return {
    name: `Booking-${input.customerName}`,
    title: 'Surf Booking Request',
    description: input.specialNotes,
    status: 'active',
    bookingStatus: 'PENDING',
    bookingType: input.bookingType,
    source,
    fullName: input.customerName,
    email: input.email,
    phone: input.phone,
    emergencyContact: input.emergencyContact,
    notes: input.specialNotes,
    participantCount: input.participants,
    bookingDate: toBookingDate(input.preferredDate || toDateOnlyString(new Date())),
    preferredTime: input.preferredTime,
    metadata: {
      pricing: pricing || null,
      notification: {
        email: { enabled: false },
        whatsapp: { enabled: false },
        sms: { enabled: false },
      },
    },
    ...relationData,
  }
}

export const bookingService = {
  async list(query: BookingListQuery) {
    const pagination = normalizePagination(query.page, query.pageSize)

    const where = buildListWhere(query)
    const orderBy = getOrderBy(query)

    const result = await bookingRepository.listRaw({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.take,
    })

    return {
      items: result.items.map((booking) => toBookingResponse(booking)),
      pagination: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: result.total,
      }),
    }
  },

  async getById(id: number) {
    const booking = await ensureBookingExists(id)
    return toBookingResponse(booking)
  },

  async create(input: BookingCreateInput, userId?: number) {
    const item = await ensureBookableItemExists(input.bookingType, input.selectedItemId)
    const maxParticipants = (item as { maxParticipants?: number | null }).maxParticipants
    if (maxParticipants && input.participants > maxParticipants) throw new ApiError(HTTP_STATUS.CONFLICT, 'Participant count exceeds this offering capacity')
    await ensureEventCanBeBooked(input)
    const schedule = await resolveSchedule(input)

    const duplicateCutoff = new Date(Date.now() - 5 * 60 * 1000)
    const duplicate = await bookingRepository.findRecentDuplicate({
      bookingType: input.bookingType,
      selectedItemId: input.selectedItemId,
      email: input.email,
      bookingDate: toBookingDate(schedule.date),
      participantCount: input.participants,
      createdAfter: duplicateCutoff,
    })

    if (duplicate) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Duplicate booking submission detected. Please wait a few minutes before retrying.')
    }

    const source = userId ? 'ADMIN' : 'WEBSITE'
    const rawPrice = input.bookingType === 'LESSON' ? (item as { price?: unknown }).price : input.bookingType === 'EXPERIENCE' ? (item as { basePrice?: unknown; discountPrice?: unknown }).discountPrice ?? (item as { basePrice?: unknown }).basePrice : (item as { basePrice?: unknown; discountPrice?: unknown }).discountPrice ?? (item as { basePrice?: unknown }).basePrice
    const pricePerParticipant = rawPrice === null || rawPrice === undefined ? null : Number(rawPrice)
    const created = await bookingRepository.create(buildCreateData({ ...input, preferredDate: schedule.date, preferredTime: schedule.time }, source, { pricePerParticipant, total: pricePerParticipant === null ? 0 : pricePerParticipant * input.participants }))

    if (created.eventId && consumesEventCapacity(created.bookingStatus)) {
      await bookingRepository.adjustEventParticipants(created.eventId, created.participantCount)
    }

    await bookingRepository.createActivity({
      bookingId: created.id,
      action: 'CREATED',
      newStatus: created.bookingStatus,
      adminUserId: userId,
      metadata: {
        source,
      },
    })

    await bookingNotificationService.prepareBookingCreated({
      bookingId: created.id,
      bookingStatus: created.bookingStatus,
      customerName: created.fullName,
      email: created.email,
      phone: created.phone,
    })

    const refreshed = await ensureBookingReference(created.id)
    return toBookingResponse(refreshed)
  },

  async patchStatus(id: number, input: BookingStatusPatchInput, userId: number) {
    const existing = await ensureBookingExists(id)

    if (existing.bookingStatus === input.bookingStatus) {
      return toBookingResponse(existing)
    }

    const wasConsumingCapacity = existing.bookingType === 'EVENT' && consumesEventCapacity(existing.bookingStatus)
    const willConsumeCapacity = existing.bookingType === 'EVENT' && consumesEventCapacity(input.bookingStatus)

    if (existing.bookingType === 'EVENT' && existing.eventId) {
      if (!wasConsumingCapacity && willConsumeCapacity) {
        const booked = await bookingRepository.sumParticipantsByEvent(existing.eventId, EVENT_CAPACITY_CONSUMING_STATUSES)
        const event = await bookingRepository.findEventForCapacity(existing.eventId)
        if (!event) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Associated event was not found')
        }

        const availability = resolveAvailability(event.capacityMax, booked)
        if (availability.remaining !== null && existing.participantCount > availability.remaining) {
          throw new ApiError(HTTP_STATUS.CONFLICT, 'Cannot move booking to this status because event capacity is full')
        }

        await bookingRepository.adjustEventParticipants(existing.eventId, existing.participantCount)
      }

      if (wasConsumingCapacity && !willConsumeCapacity) {
        await bookingRepository.adjustEventParticipants(existing.eventId, -existing.participantCount)
      }
    }

    const updated = await bookingRepository.update(id, {
      bookingStatus: input.bookingStatus,
    })

    await bookingRepository.createActivity({
      bookingId: id,
      action: input.bookingStatus === 'CANCELLED' ? 'CANCELLED' : 'STATUS_CHANGED',
      oldStatus: existing.bookingStatus,
      newStatus: input.bookingStatus,
      note: input.note,
      adminUserId: userId,
      metadata: {
        changedAt: new Date().toISOString(),
      },
    })

    await bookingNotificationService.prepareBookingStatusChanged({
      bookingId: updated.id,
      bookingStatus: updated.bookingStatus,
      customerName: updated.fullName,
      email: updated.email,
      phone: updated.phone,
    })

    await auditLogService.record({
      actorId: userId,
      action: 'BOOKING_STATUS_CHANGED',
      resourceType: 'BOOKING',
      resourceId: updated.slug || updated.id,
      description: `Booking ${updated.slug || updated.id} status changed from ${existing.bookingStatus} to ${updated.bookingStatus}`,
      metadata: {
        oldStatus: existing.bookingStatus,
        newStatus: updated.bookingStatus,
        note: input.note ?? null,
      },
    })

    const refreshed = await ensureBookingReference(id)
    return toBookingResponse(refreshed)
  },

  async patch(id: number, input: BookingUpdateInput, userId: number) {
    await ensureBookingExists(id)

    const data: Prisma.BookingUpdateInput = {
      ...(input.preferredDate !== undefined ? { bookingDate: toBookingDate(input.preferredDate) } : {}),
      ...(input.preferredTime !== undefined ? { preferredTime: input.preferredTime } : {}),
      ...(input.participants !== undefined ? { participantCount: input.participants } : {}),
      ...(input.assignedInstructor !== undefined ? { assignedInstructor: input.assignedInstructor } : {}),
      ...(input.internalNotes !== undefined ? { internalNotes: input.internalNotes } : {}),
      ...(input.emergencyContact !== undefined ? { emergencyContact: input.emergencyContact } : {}),
      ...(input.specialNotes !== undefined ? { notes: input.specialNotes, description: input.specialNotes } : {}),
    }

    const updated = await bookingRepository.update(id, data)

    await bookingRepository.createActivity({
      bookingId: id,
      action: 'UPDATED',
      adminUserId: userId,
      metadata: {
        changedFields: Object.keys(input),
      },
    })

    const refreshed = await ensureBookingReference(updated.id)
    return toBookingResponse(refreshed)
  },

  async listBookableOptions() {
    const result = await bookingRepository.listBookableOptions()

    return {
      lessons: result.lessons.map((item) => ({
        bookingType: 'LESSON' as const,
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.shortDescription,
        difficulty: item.difficulty,
        duration: item.duration,
        maxParticipants: item.maxParticipants,
        pricePerParticipant: item.price,
      })),
      experiences: result.experiences.map((item) => ({
        bookingType: 'EXPERIENCE' as const,
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.shortDescription,
        difficulty: item.difficulty,
        duration: item.duration,
        maxParticipants: item.maxParticipants,
        pricePerParticipant: item.discountPrice ?? item.basePrice,
        availability: (() => { const metadata = item.metadata && typeof item.metadata === 'object' && !Array.isArray(item.metadata) ? item.metadata as Record<string, unknown> : {}; return Array.isArray(metadata.availability) ? metadata.availability : [] })(),
      })),
      events: result.events.map((item) => ({
        bookingType: 'EVENT' as const,
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.shortDescription,
        difficulty: item.difficulty,
        duration: item.startTimeLabel,
        maxParticipants: item.capacityMax,
        location: item.locationName,
        eventDate: item.eventStartsAt,
        eventEnd: item.eventEndsAt,
        pricePerParticipant: item.discountPrice ?? item.basePrice,
        currentParticipants: item.currentParticipants,
        availability: resolveAvailability(item.capacityMax, item.currentParticipants),
      })),
    }
  },
}
