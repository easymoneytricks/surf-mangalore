import { Prisma } from '@prisma/client'

import {
  BaseContentService,
  buildQuickFilterWhere,
  buildSearchOrClause,
  buildSorting,
  mergeWhereClauses,
  normalizeSeoInput,
  resolvePublishWorkflow,
  withCreateAudit,
  withUpdateAudit,
  generateUniqueSlug,
} from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { lessonRepository } from '../repositories/lesson.repository'
import { ApiError } from '../utils/api-error'
import { type LessonListQuery, type LessonMutationInput } from '../types/lesson'

type LessonListRecord = Awaited<ReturnType<typeof lessonRepository.listRaw>>['items'][number]
type LessonDetailRecord = NonNullable<Awaited<ReturnType<typeof lessonRepository.findById>>>
type LessonRecord = LessonListRecord | LessonDetailRecord

const baseLessonCrudService = new BaseContentService<
  LessonRecord,
  Prisma.LessonWhereInput,
  Prisma.LessonOrderByWithRelationInput,
  Prisma.LessonCreateInput,
  Prisma.LessonUpdateInput,
  Prisma.LessonUpdateManyMutationInput,
  LessonListQuery
>({
  repository: lessonRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['title', 'displayOrder', 'createdAt', 'updatedAt', 'price'] as const,
      defaultField: 'displayOrder',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.LessonWhereInput>(query.search, ['title', 'slug', 'shortDescription', 'instructor'])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.LessonWhereInput>(query.quickFilter, () => {
      if (query.quickFilter === 'featured') {
        return { isFeatured: true }
      }

      if (query.quickFilter === 'draft') {
        return { publishStatus: 'DRAFT' }
      }

      if (query.quickFilter === 'published') {
        return { publishStatus: 'PUBLISHED' }
      }

      return {}
    })

    const where = mergeWhereClauses<Prisma.LessonWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      query.difficulty ? { difficulty: { equals: query.difficulty } } : null,
      query.instructor ? { instructor: { contains: query.instructor, mode: 'insensitive' } } : null,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
      query.visibility ? { visibility: query.visibility } : null,
    )

    return {
      where,
      orderBy: {
        [sorting.field]: sorting.order,
      } as Prisma.LessonOrderByWithRelationInput,
    }
  },
})

function toLessonResponse(lesson: LessonRecord) {
  return {
    id: lesson.id,
    uuid: lesson.uuid,
    title: lesson.title,
    slug: lesson.slug,
    shortDescription: lesson.shortDescription,
    fullDescription: lesson.fullDescription,
    coverImageUrl: lesson.coverImageUrl,
    difficulty: lesson.difficulty,
    duration: lesson.duration,
    price: lesson.price,
    maxParticipants: lesson.maxParticipants,
    instructor: lesson.instructor,
    status: lesson.status,
    publishStatus: lesson.publishStatus,
    visibility: lesson.visibility,
    isFeatured: lesson.isFeatured,
    displayOrder: lesson.displayOrder,
    seoTitle: lesson.seoTitle,
    seoDescription: lesson.seoDescription,
    audit: {
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      createdBy: lesson.createdBy,
      updatedBy: lesson.updatedBy,
    },
    publicCard: {
      title: lesson.title,
      slug: lesson.slug,
      summary: lesson.shortDescription,
      coverImageUrl: lesson.coverImageUrl,
      duration: lesson.duration,
      price: lesson.price,
      featured: lesson.isFeatured,
      visibility: lesson.visibility,
    },
  }
}

function toCreateData(input: LessonMutationInput, userId?: number): Prisma.LessonCreateInput {
  const seo = normalizeSeoInput({
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  })

  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
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
    difficulty: input.difficulty,
    duration: input.duration,
    price: input.price ? new Prisma.Decimal(input.price) : undefined,
    maxParticipants: input.maxParticipants,
    instructor: input.instructor,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    isFeatured: publishWorkflow.isFeatured,
    displayOrder: input.displayOrder,
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    ...withCreateAudit({}, userId),
  }
}

function toUpdateData(input: Partial<LessonMutationInput>, userId?: number): Prisma.LessonUpdateInput {
  const seo = normalizeSeoInput({
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  })

  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    featured: input.isFeatured,
    visibility: input.visibility,
  })

  const data: Prisma.LessonUpdateInput = {
    ...(input.title !== undefined ? { name: input.title, title: input.title } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.shortDescription !== undefined ? { shortDescription: input.shortDescription, description: input.shortDescription } : {}),
    ...(input.fullDescription !== undefined ? { fullDescription: input.fullDescription } : {}),
    ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
    ...(input.difficulty !== undefined ? { difficulty: input.difficulty } : {}),
    ...(input.duration !== undefined ? { duration: input.duration } : {}),
    ...(input.price !== undefined ? { price: input.price ? new Prisma.Decimal(input.price) : null } : {}),
    ...(input.maxParticipants !== undefined ? { maxParticipants: input.maxParticipants } : {}),
    ...(input.instructor !== undefined ? { instructor: input.instructor } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: publishWorkflow.isFeatured } : {}),
    ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
    ...(input.seoTitle !== undefined ? { seoTitle: seo.seoTitle } : {}),
    ...(input.seoDescription !== undefined ? { seoDescription: seo.seoDescription } : {}),
  }

  return withUpdateAudit(data, userId)
}

async function ensureLessonExists(id: number) {
  return baseLessonCrudService.getById(id)
}

async function ensureSlugAvailable(slug: string, excludeId?: number) {
  const existing = await lessonRepository.findBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A lesson with this slug already exists')
  }
}

async function createDuplicateSlug(sourceSlug: string) {
  return generateUniqueSlug(`${sourceSlug}-copy`, async (candidate) => {
    const existing = await lessonRepository.findBySlug(candidate)
    return !existing
  })
}

export const lessonService = {
  async list(query: LessonListQuery) {
    const result = await baseLessonCrudService.list(query)
    return {
      items: result.items.map((item) => toLessonResponse(item)),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const lesson = await baseLessonCrudService.getById(id)
    return toLessonResponse(lesson)
  },

  async getPublicBySlug(slug: string) {
    const lesson = await lessonRepository.findPublicBySlug(slug)
    if (!lesson) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Lesson not found')
    }

    return toLessonResponse(lesson)
  },

  async create(input: LessonMutationInput, userId?: number) {
    await ensureSlugAvailable(input.slug)
    const created = await lessonRepository.create(toCreateData(input, userId))
    return toLessonResponse(created)
  },

  async update(id: number, input: Partial<LessonMutationInput>, userId?: number) {
    await ensureLessonExists(id)
    if (input.slug) {
      await ensureSlugAvailable(input.slug, id)
    }

    const updated = await lessonRepository.update(id, toUpdateData(input, userId))
    return toLessonResponse(updated)
  },

  async softDelete(id: number, userId?: number) {
    await baseLessonCrudService.remove(id, userId)
  },

  async patchStatus(ids: number[], publishStatus: LessonMutationInput['publishStatus'], userId?: number) {
    await lessonRepository.updateMany(ids, { publishStatus, ...(userId ? { updatedBy: { connect: { id: userId } } } : {}) })
  },

  async patchFeatured(ids: number[], isFeatured: boolean, userId?: number) {
    await lessonRepository.updateMany(ids, { isFeatured, ...(userId ? { updatedBy: { connect: { id: userId } } } : {}) })
  },

  async duplicate(id: number, userId?: number) {
    const source = await ensureLessonExists(id)
    const duplicateSlug = await createDuplicateSlug(source.slug)

    const duplicated = await lessonRepository.create({
      name: `${source.title} (Copy)`,
      title: `${source.title} (Copy)`,
      slug: duplicateSlug,
      shortDescription: source.shortDescription,
      fullDescription: source.fullDescription,
      description: source.shortDescription,
      coverImageUrl: source.coverImageUrl,
      difficulty: source.difficulty,
      duration: source.duration,
      price: source.price,
      maxParticipants: source.maxParticipants,
      instructor: source.instructor,
      publishStatus: 'DRAFT',
      visibility: source.visibility,
      isFeatured: false,
      displayOrder: source.displayOrder + 1,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      ...(userId ? {
        createdBy: { connect: { id: userId } },
        updatedBy: { connect: { id: userId } },
      } : {}),
    })

    return toLessonResponse(duplicated)
  },
}
