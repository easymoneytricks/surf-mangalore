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
import { coachRepository } from '../repositories/coach.repository'
import { ApiError } from '../utils/api-error'
import { type CoachListQuery, type CoachMutationInput } from '../types/coach'

type CoachListRecord = Awaited<ReturnType<typeof coachRepository.listRaw>>['items'][number]
type CoachDetailRecord = NonNullable<Awaited<ReturnType<typeof coachRepository.findById>>>
type CoachRecord = CoachListRecord | CoachDetailRecord

const baseCoachCrudService = new BaseContentService<
  CoachRecord,
  Prisma.CoachWhereInput,
  Prisma.CoachOrderByWithRelationInput,
  Prisma.CoachCreateInput,
  Prisma.CoachUpdateInput,
  Prisma.CoachUpdateManyMutationInput,
  CoachListQuery
>({
  repository: coachRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['name', 'displayOrder', 'yearsExperience', 'isFeatured', 'createdAt', 'updatedAt'] as const,
      defaultField: 'displayOrder',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.CoachWhereInput>(query.search, ['name', 'slug', 'title', 'shortBio', 'fullBio'])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.CoachWhereInput>(query.quickFilter, () => {
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

    const where = mergeWhereClauses<Prisma.CoachWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      query.status ? { status: query.status } : null,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
      query.visibility ? { visibility: query.visibility } : null,
      query.featured ? { isFeatured: query.featured === 'true' } : null,
    )

    return {
      where,
      orderBy: {
        [sorting.field]: sorting.order,
      } as Prisma.CoachOrderByWithRelationInput,
    }
  },
})

function toCoachResponse(coach: CoachRecord) {
  return {
    id: coach.id,
    uuid: coach.uuid,
    fullName: coach.name,
    slug: coach.slug,
    profilePhotoUrl: coach.profilePhotoUrl,
    coverPhotoUrl: coach.coverPhotoUrl,
    jobTitle: coach.title,
    designation: coach.title,
    shortBio: coach.shortBio,
    fullBio: coach.fullBio,
    description: coach.description,
    specialization: coach.specialization,
    languages: coach.languages,
    certifications: coach.certifications,
    yearsOfExperience: coach.yearsExperience,
    email: coach.email,
    phone: coach.phone,
    socialLinks: {
      instagram: coach.instagramUrl,
      facebook: coach.facebookUrl,
      linkedin: coach.linkedinUrl,
      website: coach.websiteUrl,
    },
    instagram: coach.instagramUrl,
    facebook: coach.facebookUrl,
    website: coach.websiteUrl,
    status: coach.status,
    active: coach.status === 'active',
    publishStatus: coach.publishStatus,
    visibility: coach.visibility,
    isFeatured: coach.isFeatured,
    displayOrder: coach.displayOrder,
    seoTitle: coach.seoTitle,
    seoDescription: coach.seoDescription,
    audit: {
      createdAt: coach.createdAt,
      updatedAt: coach.updatedAt,
      createdBy: coach.createdBy,
      updatedBy: coach.updatedBy,
    },
    publicCard: {
      name: coach.name,
      slug: coach.slug,
      title: coach.title,
      image: coach.profilePhotoUrl,
      coverImage: coach.coverPhotoUrl,
      bio: coach.shortBio ?? coach.description ?? '',
      yearsOfExperience: coach.yearsExperience,
      specialization: coach.specialization,
      featured: coach.isFeatured,
      visibility: coach.visibility,
    },
  }
}

function toCreateData(input: CoachMutationInput, userId?: number): Prisma.CoachCreateInput {
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
    name: input.fullName,
    title: input.jobTitle,
    slug: input.slug,
    profilePhotoUrl: input.profilePhotoUrl,
    coverPhotoUrl: input.coverPhotoUrl,
    shortBio: input.shortBio,
    fullBio: input.fullBio,
    description: input.shortBio,
    yearsExperience: input.yearsOfExperience,
    specialization: input.specialization,
    languages: input.languages,
    certifications: input.certifications,
    phone: input.phone,
    email: input.email,
    instagramUrl: input.instagramUrl,
    facebookUrl: input.facebookUrl,
    linkedinUrl: input.linkedinUrl,
    websiteUrl: input.websiteUrl,
    status: input.status,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    isFeatured: publishWorkflow.isFeatured,
    displayOrder: input.displayOrder,
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    metadata: {
      futureExperienceIds: [],
      futureEventIds: [],
      futureMediaAssetIds: [],
    },
    ...withCreateAudit({}, userId),
  }
}

function toUpdateData(input: Partial<CoachMutationInput>, userId?: number): Prisma.CoachUpdateInput {
  const seo = normalizeSeoInput({
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
  })

  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    featured: input.isFeatured,
    visibility: input.visibility,
  })

  const data: Prisma.CoachUpdateInput = {
    ...(input.fullName !== undefined ? { name: input.fullName } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.profilePhotoUrl !== undefined ? { profilePhotoUrl: input.profilePhotoUrl } : {}),
    ...(input.coverPhotoUrl !== undefined ? { coverPhotoUrl: input.coverPhotoUrl } : {}),
    ...(input.jobTitle !== undefined ? { title: input.jobTitle } : {}),
    ...(input.shortBio !== undefined ? { shortBio: input.shortBio, description: input.shortBio } : {}),
    ...(input.fullBio !== undefined ? { fullBio: input.fullBio } : {}),
    ...(input.yearsOfExperience !== undefined ? { yearsExperience: input.yearsOfExperience } : {}),
    ...(input.specialization !== undefined ? { specialization: input.specialization } : {}),
    ...(input.languages !== undefined ? { languages: input.languages } : {}),
    ...(input.certifications !== undefined ? { certifications: input.certifications } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.email !== undefined ? { email: input.email } : {}),
    ...(input.instagramUrl !== undefined ? { instagramUrl: input.instagramUrl } : {}),
    ...(input.facebookUrl !== undefined ? { facebookUrl: input.facebookUrl } : {}),
    ...(input.linkedinUrl !== undefined ? { linkedinUrl: input.linkedinUrl } : {}),
    ...(input.websiteUrl !== undefined ? { websiteUrl: input.websiteUrl } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: publishWorkflow.isFeatured } : {}),
    ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
    ...(input.seoTitle !== undefined ? { seoTitle: seo.seoTitle } : {}),
    ...(input.seoDescription !== undefined ? { seoDescription: seo.seoDescription } : {}),
  }

  return withUpdateAudit(data, userId)
}

async function ensureSlugAvailable(slug: string, excludeId?: number) {
  const existing = await coachRepository.findBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A coach with this slug already exists')
  }
}

async function createDuplicateSlug(sourceSlug: string) {
  return generateUniqueSlug(`${sourceSlug}-copy`, async (candidate) => {
    const existing = await coachRepository.findBySlug(candidate)
    return !existing
  })
}

export const coachService = {
  async list(query: CoachListQuery) {
    const result = await baseCoachCrudService.list(query)
    return {
      items: result.items.map((item) => toCoachResponse(item)),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const coach = await baseCoachCrudService.getById(id)
    return toCoachResponse(coach)
  },

  async getPublicBySlug(slug: string) {
    const coach = await coachRepository.findPublicBySlug(slug)
    if (!coach) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Coach not found')
    }

    return toCoachResponse(coach)
  },

  async create(input: CoachMutationInput, userId?: number) {
    await ensureSlugAvailable(input.slug)

    const created = await baseCoachCrudService.create(toCreateData(input, userId))
    const refreshed = await baseCoachCrudService.getById(created.id)
    return toCoachResponse(refreshed)
  },

  async update(id: number, input: Partial<CoachMutationInput>, userId?: number) {
    if (input.slug) {
      await ensureSlugAvailable(input.slug, id)
    }

    const updated = await baseCoachCrudService.update(id, toUpdateData(input, userId))
    return toCoachResponse(updated)
  },

  async softDelete(id: number, userId?: number) {
    return baseCoachCrudService.remove(id, userId)
  },

  async duplicate(id: number, userId?: number) {
    const source = await baseCoachCrudService.getById(id)
    const duplicateSlug = await createDuplicateSlug(source.slug)

    const duplicated = await baseCoachCrudService.create({
      name: `${source.name} Copy`,
      title: source.title,
      slug: duplicateSlug,
      profilePhotoUrl: source.profilePhotoUrl,
      coverPhotoUrl: source.coverPhotoUrl,
      shortBio: source.shortBio,
      fullBio: source.fullBio,
      description: source.description,
      specialization: source.specialization,
      languages: source.languages,
      certifications: source.certifications,
      phone: source.phone,
      email: null,
      instagramUrl: source.instagramUrl,
      facebookUrl: source.facebookUrl,
      linkedinUrl: source.linkedinUrl,
      websiteUrl: source.websiteUrl,
      yearsExperience: source.yearsExperience,
      status: source.status,
      publishStatus: 'DRAFT',
      visibility: source.visibility,
      isFeatured: false,
      displayOrder: source.displayOrder + 1,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      metadata: source.metadata ?? Prisma.JsonNull,
      ...withCreateAudit({}, userId),
    })

    const refreshed = await baseCoachCrudService.getById(duplicated.id)
    return toCoachResponse(refreshed)
  },

  async patchStatus(ids: number[], publishStatus: CoachMutationInput['publishStatus'], userId?: number) {
    await coachRepository.updateMany(ids, {
      publishStatus,
      ...withUpdateAudit({}, userId),
    })
  },

  async patchFeatured(ids: number[], isFeatured: boolean, userId?: number) {
    await coachRepository.updateMany(ids, {
      isFeatured,
      ...withUpdateAudit({}, userId),
    })
  },
}
