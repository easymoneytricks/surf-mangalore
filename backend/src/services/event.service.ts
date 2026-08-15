import { type Prisma } from '@prisma/client'

import {
  BaseContentService,
  buildQuickFilterWhere,
  buildSearchOrClause,
  buildSorting,
  mergeWhereClauses,
  normalizeSeoInput,
  resolvePublishWorkflow,
  withBulkUpdateAudit,
  withCreateAudit,
  withUpdateAudit,
  generateUniqueSlug,
} from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { eventRepository } from '../repositories/event.repository'
import { ApiError } from '../utils/api-error'
import { type EventListQuery, type EventMutationInput } from '../types/event'

type EventListRecord = Awaited<ReturnType<typeof eventRepository.listRaw>>['items'][number]
type EventDetailRecord = NonNullable<Awaited<ReturnType<typeof eventRepository.findById>>>
type EventRecord = EventListRecord | EventDetailRecord

const baseEventCrudService = new BaseContentService<
  EventRecord,
  Prisma.EventWhereInput,
  Prisma.EventOrderByWithRelationInput,
  Prisma.EventCreateInput,
  Prisma.EventUpdateInput,
  Prisma.EventUpdateManyMutationInput,
  EventListQuery
>({
  repository: eventRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['title', 'eventStartsAt', 'createdAt', 'updatedAt', 'basePrice'] as const,
      defaultField: 'eventStartsAt',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.EventWhereInput>(query.search, [
      'title',
      'slug',
      'shortDescription',
      'instructorName',
      'locationName',
    ])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.EventWhereInput>(query.quickFilter, (quickFilter, now) => {
      if (quickFilter === 'upcoming') {
        return { eventStartsAt: { gte: now } }
      }

      if (quickFilter === 'past') {
        return { eventStartsAt: { lt: now } }
      }

      if (quickFilter === 'featured') {
        return { isFeatured: true }
      }

      if (quickFilter === 'draft') {
        return { publishStatus: 'DRAFT' }
      }

      if (quickFilter === 'published') {
        return { publishStatus: 'PUBLISHED' }
      }

      if (quickFilter === 'cancelled') {
        return { eventStatus: 'CANCELLED' }
      }

      return {}
    })

    const where = mergeWhereClauses<Prisma.EventWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      query.category ? { category: { equals: query.category, mode: 'insensitive' } } : null,
      query.instructor ? { instructorName: { contains: query.instructor, mode: 'insensitive' } } : null,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
      query.eventStatus ? { eventStatus: query.eventStatus } : null,
      query.visibility ? { visibility: query.visibility } : null,
    )

    return {
      where,
      orderBy: {
        [sorting.field]: sorting.order,
      } as Prisma.EventOrderByWithRelationInput,
    }
  },
})

function toDecimalInput(value: number | undefined) {
  if (value === undefined) {
    return undefined
  }

  return value.toFixed(2)
}

function toEventResponse(event: EventRecord) {
  return {
    id: event.id,
    uuid: event.uuid,
    title: event.title,
    slug: event.slug,
    shortDescription: event.shortDescription,
    fullDescription: event.fullDescription,
    coverImageUrl: event.coverImageUrl,
    galleryImageUrls: event.galleryImageUrls,
    category: event.category,
    difficulty: event.difficulty,
    eventType: event.eventType,
    location: event.locationName,
    googleMapsUrl: event.googleMapsUrl,
    startDate: event.eventStartsAt,
    endDate: event.eventEndsAt,
    registrationDeadline: event.registrationClosesAt,
    startTime: event.startTimeLabel,
    endTime: event.endTimeLabel,
    maxParticipants: event.capacityMax,
    currentParticipants: event.currentParticipants,
    price: event.basePrice,
    discountPrice: event.discountPrice,
    currency: event.currencyCode,
    instructor: event.instructorName,
    status: event.eventStatus,
    publishStatus: event.publishStatus,
    visibility: event.visibility,
    featuredEvent: event.isFeatured,
    seoTitle: event.seoTitle,
    seoDescription: event.seoDescription,
    metaKeywords: event.metaKeywords,
    audit: {
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      createdBy: event.createdBy,
      updatedBy: event.updatedBy,
    },
    publicCard: {
      title: event.title,
      slug: event.slug,
      summary: event.shortDescription,
      coverImageUrl: event.coverImageUrl,
      location: event.locationName,
      startDate: event.eventStartsAt,
      endDate: event.eventEndsAt,
      price: event.discountPrice ?? event.basePrice,
      currency: event.currencyCode,
      category: event.category,
      eventType: event.eventType,
      featured: event.isFeatured,
      visibility: event.visibility,
    },
  }
}

function toCreateData(input: EventMutationInput, userId?: number): Prisma.EventCreateInput {
  const seo = normalizeSeoInput({
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    metaKeywords: input.metaKeywords,
  })

  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    eventStatus: input.eventStatus,
    featured: input.isFeatured,
    visibility: input.visibility,
  })

  return {
    name: input.title,
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    description: input.shortDescription,
    coverImageUrl: input.coverImageUrl,
    galleryImageUrls: input.galleryImageUrls,
    category: input.category,
    difficulty: input.difficulty,
    eventType: input.eventType,
    locationName: input.locationName,
    googleMapsUrl: input.googleMapsUrl,
    eventStartsAt: new Date(input.startDate),
    eventEndsAt: input.endDate ? new Date(input.endDate) : undefined,
    registrationClosesAt: input.registrationDeadline ? new Date(input.registrationDeadline) : undefined,
    startTimeLabel: input.startTimeLabel,
    endTimeLabel: input.endTimeLabel,
    capacityMax: input.maxParticipants,
    basePrice: toDecimalInput(input.price),
    discountPrice: toDecimalInput(input.discountPrice),
    currencyCode: input.currencyCode,
    instructorName: input.instructorName,
    eventStatus: publishWorkflow.eventStatus,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    isFeatured: publishWorkflow.isFeatured,
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    metaKeywords: seo.metaKeywords,
    ...withCreateAudit({}, userId),
  }
}

function toUpdateData(input: Partial<EventMutationInput>, userId?: number): Prisma.EventUpdateInput {
  const seo = normalizeSeoInput({
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    metaKeywords: input.metaKeywords,
  })

  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    eventStatus: input.eventStatus,
    featured: input.isFeatured,
    visibility: input.visibility,
  })

  const data: Prisma.EventUpdateInput = {
    ...(input.title !== undefined ? { name: input.title, title: input.title } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.shortDescription !== undefined ? { shortDescription: input.shortDescription, description: input.shortDescription } : {}),
    ...(input.fullDescription !== undefined ? { fullDescription: input.fullDescription } : {}),
    ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
    ...(input.galleryImageUrls !== undefined ? { galleryImageUrls: input.galleryImageUrls } : {}),
    ...(input.category !== undefined ? { category: input.category } : {}),
    ...(input.difficulty !== undefined ? { difficulty: input.difficulty } : {}),
    ...(input.eventType !== undefined ? { eventType: input.eventType } : {}),
    ...(input.locationName !== undefined ? { locationName: input.locationName } : {}),
    ...(input.googleMapsUrl !== undefined ? { googleMapsUrl: input.googleMapsUrl } : {}),
    ...(input.startDate !== undefined ? { eventStartsAt: new Date(input.startDate) } : {}),
    ...(input.endDate !== undefined ? { eventEndsAt: input.endDate ? new Date(input.endDate) : null } : {}),
    ...(input.registrationDeadline !== undefined
      ? { registrationClosesAt: input.registrationDeadline ? new Date(input.registrationDeadline) : null }
      : {}),
    ...(input.startTimeLabel !== undefined ? { startTimeLabel: input.startTimeLabel } : {}),
    ...(input.endTimeLabel !== undefined ? { endTimeLabel: input.endTimeLabel } : {}),
    ...(input.maxParticipants !== undefined ? { capacityMax: input.maxParticipants } : {}),
    ...(input.price !== undefined ? { basePrice: toDecimalInput(input.price) } : {}),
    ...(input.discountPrice !== undefined ? { discountPrice: toDecimalInput(input.discountPrice) } : {}),
    ...(input.currencyCode !== undefined ? { currencyCode: input.currencyCode } : {}),
    ...(input.instructorName !== undefined ? { instructorName: input.instructorName } : {}),
    ...(input.eventStatus !== undefined ? { eventStatus: publishWorkflow.eventStatus } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: publishWorkflow.isFeatured } : {}),
    ...(input.seoTitle !== undefined ? { seoTitle: seo.seoTitle } : {}),
    ...(input.seoDescription !== undefined ? { seoDescription: seo.seoDescription } : {}),
    ...(input.metaKeywords !== undefined ? { metaKeywords: seo.metaKeywords } : {}),
  }

  return withUpdateAudit(data, userId)
}

async function ensureEventExists(id: number) {
  return baseEventCrudService.getById(id)
}

async function ensureSlugAvailable(slug: string, excludeId?: number) {
  const existing = await eventRepository.findBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'An event with this slug already exists')
  }
}

async function createDuplicateSlug(sourceSlug: string) {
  return generateUniqueSlug(`${sourceSlug}-copy`, async (candidate) => {
    const existing = await eventRepository.findBySlug(candidate)
    return !existing
  })
}

export const eventService = {
  async list(query: EventListQuery) {
    const result = await baseEventCrudService.list(query)
    return {
      items: result.items.map((item) => toEventResponse(item)),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const event = await baseEventCrudService.getById(id)
    return toEventResponse(event)
  },

  async getPublicBySlug(slug: string) {
    const event = await eventRepository.findPublicBySlug(slug)
    if (!event) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Event not found')
    }

    return toEventResponse(event)
  },

  async create(input: EventMutationInput, userId?: number) {
    await ensureSlugAvailable(input.slug)
    const created = await eventRepository.create(toCreateData(input, userId))
    return toEventResponse(created)
  },

  async update(id: number, input: Partial<EventMutationInput>, userId?: number) {
    await ensureEventExists(id)
    if (input.slug) {
      await ensureSlugAvailable(input.slug, id)
    }

    const updated = await eventRepository.update(id, toUpdateData(input, userId))
    return toEventResponse(updated)
  },

  async softDelete(id: number, userId?: number) {
    await baseEventCrudService.remove(id, userId)
  },

  async duplicate(id: number, userId?: number) {
    const source = await ensureEventExists(id)
    const duplicateSlug = await createDuplicateSlug(source.slug)

    const duplicated = await eventRepository.create({
      name: `${source.title} (Copy)`,
      title: `${source.title} (Copy)`,
      slug: duplicateSlug,
      shortDescription: source.shortDescription,
      fullDescription: source.fullDescription,
      description: source.description,
      coverImageUrl: source.coverImageUrl,
      galleryImageUrls: source.galleryImageUrls,
      category: source.category,
      difficulty: source.difficulty,
      eventType: source.eventType,
      locationName: source.locationName,
      googleMapsUrl: source.googleMapsUrl,
      eventStartsAt: source.eventStartsAt,
      eventEndsAt: source.eventEndsAt,
      registrationOpensAt: source.registrationOpensAt,
      registrationClosesAt: source.registrationClosesAt,
      startTimeLabel: source.startTimeLabel,
      endTimeLabel: source.endTimeLabel,
      capacityMin: source.capacityMin,
      capacityMax: source.capacityMax,
      currentParticipants: 0,
      instructorName: source.instructorName,
      basePrice: source.basePrice,
      discountPrice: source.discountPrice,
      currencyCode: source.currencyCode,
      eventStatus: 'DRAFT',
      publishStatus: 'DRAFT',
      visibility: source.visibility,
      isFeatured: false,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      metaKeywords: source.metaKeywords,
      metadata: source.metadata ?? undefined,
      ...(userId
        ? {
            createdBy: { connect: { id: userId } },
            updatedBy: { connect: { id: userId } },
          }
        : {}),
    })

    return toEventResponse(duplicated)
  },

  async patchStatus(ids: number[], statusPatch: { publishStatus?: EventMutationInput['publishStatus']; eventStatus?: EventMutationInput['eventStatus'] }, userId?: number) {
    await eventRepository.updateMany(ids, withBulkUpdateAudit({
      ...(statusPatch.publishStatus ? { publishStatus: statusPatch.publishStatus } : {}),
      ...(statusPatch.eventStatus ? { eventStatus: statusPatch.eventStatus } : {}),
    }, userId))
  },

  async patchFeatured(ids: number[], isFeatured: boolean, userId?: number) {
    await eventRepository.updateMany(ids, withBulkUpdateAudit({
      isFeatured,
    }, userId))
  },
}
