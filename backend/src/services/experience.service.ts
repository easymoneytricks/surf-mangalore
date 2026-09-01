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
import { experienceRepository } from '../repositories/experience.repository'
import { ApiError } from '../utils/api-error'
import { type ExperienceListQuery, type ExperienceMutationInput } from '../types/experience'

type ExperienceListRecord = Awaited<ReturnType<typeof experienceRepository.listRaw>>['items'][number]
type ExperienceDetailRecord = NonNullable<Awaited<ReturnType<typeof experienceRepository.findById>>>
type ExperienceRecord = ExperienceListRecord | ExperienceDetailRecord

const baseExperienceCrudService = new BaseContentService<
  ExperienceRecord,
  Prisma.ExperienceWhereInput,
  Prisma.ExperienceOrderByWithRelationInput,
  Prisma.ExperienceCreateInput,
  Prisma.ExperienceUpdateInput,
  Prisma.ExperienceUpdateManyMutationInput,
  ExperienceListQuery
>({
  repository: experienceRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['title', 'displayOrder', 'createdAt', 'updatedAt', 'basePrice'] as const,
      defaultField: 'displayOrder',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.ExperienceWhereInput>(query.search, [
      'title',
      'slug',
      'shortDescription',
      'instructor',
      'category',
    ])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.ExperienceWhereInput>(query.quickFilter, () => {
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

    const where = mergeWhereClauses<Prisma.ExperienceWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      query.category ? { category: { equals: query.category, mode: 'insensitive' } } : null,
      query.difficulty ? { difficulty: { equals: query.difficulty } } : null,
      query.instructor ? { instructor: { contains: query.instructor, mode: 'insensitive' } } : null,
      query.status ? { status: query.status } : null,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
      query.visibility ? { visibility: query.visibility } : null,
    )

    return {
      where,
      orderBy: {
        [sorting.field]: sorting.order,
      } as Prisma.ExperienceOrderByWithRelationInput,
    }
  },
})

function toExperienceResponse(experience: ExperienceRecord) {
  const metadata = experience.metadata && typeof experience.metadata === 'object' && !Array.isArray(experience.metadata) ? experience.metadata as Record<string, unknown> : {}
  return {
    id: experience.id,
    uuid: experience.uuid,
    title: experience.title,
    slug: experience.slug,
    shortDescription: experience.shortDescription,
    fullDescription: experience.fullDescription,
    coverImageUrl: experience.coverImageUrl,
    galleryImageUrls: experience.galleryImageUrls,
    category: experience.category,
    difficulty: experience.difficulty,
    recommendedAge: experience.recommendedAge,
    duration: experience.duration,
    maxParticipants: experience.maxParticipants,
    basePrice: experience.basePrice,
    discountPrice: experience.discountPrice,
    instructor: experience.instructor,
    status: experience.status,
    publishStatus: experience.publishStatus,
    visibility: experience.visibility,
    isFeatured: experience.isFeatured,
    displayOrder: experience.displayOrder,
    linkedLessonsCount: experience.linkedLessonsCount,
    linkedLessonIds: experience.lessons.map((lesson) => lesson.id),
    linkedLessons: experience.lessons.map((lesson) => ({
      id: lesson.id,
      uuid: lesson.uuid,
      title: lesson.title,
      slug: lesson.slug,
      difficulty: lesson.difficulty,
      publishStatus: lesson.publishStatus,
    })),
    seoTitle: experience.seoTitle,
    seoDescription: experience.seoDescription,
    availability: Array.isArray(metadata.availability) ? metadata.availability : [],
    audit: {
      createdAt: experience.createdAt,
      updatedAt: experience.updatedAt,
      createdBy: experience.createdBy,
      updatedBy: experience.updatedBy,
    },
    publicCard: {
      title: experience.title,
      slug: experience.slug,
      summary: experience.shortDescription,
      coverImageUrl: experience.coverImageUrl,
      difficulty: experience.difficulty,
      duration: experience.duration,
      groupSize: experience.maxParticipants,
      featured: experience.isFeatured,
      visibility: experience.visibility,
      price: experience.discountPrice ?? experience.basePrice,
    },
  }
}

function toDecimalInput(value: number | undefined) {
  if (value === undefined) {
    return undefined
  }

  return value.toFixed(2)
}

function toCreateData(input: ExperienceMutationInput, userId?: number): Prisma.ExperienceCreateInput {
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
    galleryImageUrls: input.galleryImageUrls,
    category: input.category,
    difficulty: input.difficulty,
    recommendedAge: input.recommendedAge,
    duration: input.duration,
    maxParticipants: input.maxParticipants,
    capacityMax: input.maxParticipants,
    basePrice: toDecimalInput(input.basePrice),
    discountPrice: toDecimalInput(input.discountPrice),
    instructor: input.instructor,
    status: input.status,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    isFeatured: publishWorkflow.isFeatured,
    displayOrder: input.displayOrder,
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    metadata: { futureInstructorIds: [], futureCategoryIds: [], futureImageAssetIds: [], availability: input.availability || [] },
    ...withCreateAudit({}, userId),
  }
}

function toUpdateData(input: Partial<ExperienceMutationInput>, userId?: number): Prisma.ExperienceUpdateInput {
  const seo = normalizeSeoInput({
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  })

  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    featured: input.isFeatured,
    visibility: input.visibility,
  })

  const data: Prisma.ExperienceUpdateInput = {
    ...(input.title !== undefined ? { name: input.title, title: input.title } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.shortDescription !== undefined ? { shortDescription: input.shortDescription, description: input.shortDescription } : {}),
    ...(input.fullDescription !== undefined ? { fullDescription: input.fullDescription } : {}),
    ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
    ...(input.galleryImageUrls !== undefined ? { galleryImageUrls: input.galleryImageUrls } : {}),
    ...(input.category !== undefined ? { category: input.category } : {}),
    ...(input.difficulty !== undefined ? { difficulty: input.difficulty } : {}),
    ...(input.recommendedAge !== undefined ? { recommendedAge: input.recommendedAge } : {}),
    ...(input.duration !== undefined ? { duration: input.duration } : {}),
    ...(input.maxParticipants !== undefined ? { maxParticipants: input.maxParticipants, capacityMax: input.maxParticipants } : {}),
    ...(input.basePrice !== undefined ? { basePrice: input.basePrice ? new Prisma.Decimal(input.basePrice) : null } : {}),
    ...(input.discountPrice !== undefined ? { discountPrice: input.discountPrice ? new Prisma.Decimal(input.discountPrice) : null } : {}),
    ...(input.instructor !== undefined ? { instructor: input.instructor } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: publishWorkflow.isFeatured } : {}),
    ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
    ...(input.seoTitle !== undefined ? { seoTitle: seo.seoTitle } : {}),
    ...(input.seoDescription !== undefined ? { seoDescription: seo.seoDescription } : {}),
    ...(input.availability !== undefined ? { metadata: { availability: input.availability } } : {}),
  }

  return withUpdateAudit(data, userId)
}

async function ensureSlugAvailable(slug: string, excludeId?: number) {
  const existing = await experienceRepository.findBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'An experience with this slug already exists')
  }
}

async function createDuplicateSlug(sourceSlug: string) {
  return generateUniqueSlug(`${sourceSlug}-copy`, async (candidate) => {
    const existing = await experienceRepository.findBySlug(candidate)
    return !existing
  })
}

export const experienceService = {
  async list(query: ExperienceListQuery) {
    const result = await baseExperienceCrudService.list(query)
    return {
      items: result.items.map((item) => toExperienceResponse(item)),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const experience = await baseExperienceCrudService.getById(id)
    return toExperienceResponse(experience)
  },

  async getPublicBySlug(slug: string) {
    const experience = await experienceRepository.findPublicBySlug(slug)
    if (!experience) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Experience not found')
    }

    return toExperienceResponse(experience)
  },

  async create(input: ExperienceMutationInput, userId?: number) {
    await ensureSlugAvailable(input.slug)

    const created = await baseExperienceCrudService.create(toCreateData(input, userId))
    await experienceRepository.syncLessons(created.id, input.linkedLessonIds)

    const refreshed = await baseExperienceCrudService.getById(created.id)
    return toExperienceResponse(refreshed)
  },

  async update(id: number, input: Partial<ExperienceMutationInput>, userId?: number) {
    if (input.slug) {
      await ensureSlugAvailable(input.slug, id)
    }

    const updated = await baseExperienceCrudService.update(id, toUpdateData(input, userId))

    if (input.linkedLessonIds !== undefined) {
      await experienceRepository.syncLessons(updated.id, input.linkedLessonIds)
    }

    const refreshed = await baseExperienceCrudService.getById(id)
    return toExperienceResponse(refreshed)
  },

  async softDelete(id: number, userId?: number) {
    await experienceRepository.syncLessons(id, [])
    return baseExperienceCrudService.remove(id, userId)
  },

  async duplicate(id: number, userId?: number) {
    const source = await baseExperienceCrudService.getById(id)
    const duplicateSlug = await createDuplicateSlug(source.slug)

    const duplicated = await baseExperienceCrudService.create({
      name: `${source.title} Copy`,
      title: `${source.title} Copy`,
      slug: duplicateSlug,
      shortDescription: source.shortDescription,
      fullDescription: source.fullDescription,
      description: source.shortDescription,
      coverImageUrl: source.coverImageUrl,
      galleryImageUrls: source.galleryImageUrls,
      category: source.category,
      difficulty: source.difficulty,
      recommendedAge: source.recommendedAge,
      duration: source.duration,
      maxParticipants: source.maxParticipants,
      capacityMax: source.maxParticipants,
      basePrice: source.basePrice ? new Prisma.Decimal(source.basePrice) : null,
      discountPrice: source.discountPrice ? new Prisma.Decimal(source.discountPrice) : null,
      instructor: source.instructor,
      status: source.status,
      publishStatus: 'DRAFT',
      visibility: source.visibility,
      isFeatured: false,
      displayOrder: source.displayOrder + 1,
      linkedLessonsCount: 0,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      metadata: source.metadata ?? Prisma.JsonNull,
      ...withCreateAudit({}, userId),
    })

    const refreshed = await baseExperienceCrudService.getById(duplicated.id)
    return toExperienceResponse(refreshed)
  },

  async patchStatus(ids: number[], publishStatus: ExperienceMutationInput['publishStatus'], userId?: number) {
    await experienceRepository.updateMany(ids, {
      publishStatus,
      ...withUpdateAudit({}, userId),
    })
  },

  async patchFeatured(ids: number[], isFeatured: boolean, userId?: number) {
    await experienceRepository.updateMany(ids, {
      isFeatured,
      ...withUpdateAudit({}, userId),
    })
  },
}
