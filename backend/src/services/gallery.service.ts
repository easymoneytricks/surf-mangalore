import { Prisma } from '@prisma/client'

import {
  buildPaginationMeta,
  buildQuickFilterWhere,
  buildSearchOrClause,
  buildSorting,
  mergeWhereClauses,
  normalizePagination,
  normalizeSeoInput,
  resolvePublishWorkflow,
  withCreateAudit,
  withUpdateAudit,
  generateUniqueSlug,
} from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { galleryRepository } from '../repositories/gallery.repository'
import {
  type GalleryAlbumListQuery,
  type GalleryAlbumMutationInput,
  type GalleryImageMutationInput,
  type GalleryListQuery,
} from '../types/gallery'
import { ApiError } from '../utils/api-error'

type GalleryImageRecord = NonNullable<Awaited<ReturnType<typeof galleryRepository.findImageById>>>
type GalleryAlbumRecord = NonNullable<Awaited<ReturnType<typeof galleryRepository.findAlbumById>>>

function toImageResponse(image: GalleryImageRecord) {
  return {
    id: image.id,
    uuid: image.uuid,
    title: image.title,
    slug: image.slug,
    altText: image.altText ?? image.media.altText,
    caption: image.caption ?? image.media.caption,
    description: image.description,
    album: image.category
      ? {
          id: image.category.id,
          uuid: image.category.uuid,
          slug: image.category.slug,
          name: image.category.title,
          publishStatus: image.category.publishStatus,
        }
      : null,
    photographer: image.photographer,
    tags: image.tags.length ? image.tags : image.media.tags,
    isFeatured: image.isFeatured,
    displayOrder: image.sortOrder,
    status: image.status,
    publishStatus: image.publishStatus,
    visibility: image.visibility,
    media: {
      id: image.media.id,
      title: image.media.title,
      imageUrl: image.media.filePath,
      thumbnailUrl: image.media.thumbnailPath || image.media.filePath,
      width: image.media.width,
      height: image.media.height,
    },
    audit: {
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
      createdBy: image.createdBy,
      updatedBy: image.updatedBy,
    },
    publicCard: {
      title: image.title,
      description: image.description || image.caption || '',
      category: image.category?.title || 'Gallery',
      imageUrl: image.media.filePath,
      featured: image.isFeatured,
      altText: image.altText || image.media.altText || image.title,
    },
  }
}

function toAlbumResponse(album: GalleryAlbumRecord) {
  return {
    id: album.id,
    uuid: album.uuid,
    name: album.title,
    slug: album.slug,
    shortDescription: album.shortDescription,
    description: album.description,
    coverImageUrl: album.coverImageUrl,
    displayOrder: album.sortOrder,
    status: album.status,
    publishStatus: album.publishStatus,
    visibility: album.visibility,
    isFeatured: album.isFeatured,
    seoTitle: album.seoTitle,
    seoDescription: album.seoDescription,
    imagesCount: album._count.images,
    audit: {
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
    },
  }
}

function toImageCreateData(input: GalleryImageMutationInput, userId?: number): Prisma.GalleryImageCreateInput {
  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    featured: input.isFeatured,
    visibility: input.visibility,
  })

  return {
    name: input.title,
    title: input.title,
    slug: input.slug,
    altText: input.altText,
    caption: input.caption,
    description: input.description,
    photographer: input.photographer,
    tags: input.tags,
    isFeatured: publishWorkflow.isFeatured,
    status: input.status,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    sortOrder: input.displayOrder,
    ...(input.albumId ? { category: { connect: { id: input.albumId } } } : {}),
    media: { connect: { id: input.mediaId as number } },
    ...withCreateAudit({}, userId),
  }
}

function toImageUpdateData(input: Partial<GalleryImageMutationInput>, userId?: number): Prisma.GalleryImageUpdateInput {
  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    featured: input.isFeatured,
    visibility: input.visibility,
  })

  const data: Prisma.GalleryImageUpdateInput = {
    ...(input.title !== undefined ? { name: input.title, title: input.title } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.altText !== undefined ? { altText: input.altText } : {}),
    ...(input.caption !== undefined ? { caption: input.caption } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.photographer !== undefined ? { photographer: input.photographer } : {}),
    ...(input.tags !== undefined ? { tags: input.tags } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: publishWorkflow.isFeatured } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.displayOrder !== undefined ? { sortOrder: input.displayOrder } : {}),
    ...(input.albumId !== undefined ? { category: input.albumId ? { connect: { id: input.albumId } } : { disconnect: true } } : {}),
    ...(input.mediaId !== undefined ? { media: { connect: { id: input.mediaId } } } : {}),
  }

  return withUpdateAudit(data, userId)
}

function toAlbumCreateData(input: GalleryAlbumMutationInput): Prisma.GalleryCategoryCreateInput {
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
    name: input.name,
    title: input.name,
    slug: input.slug,
    shortDescription: input.shortDescription,
    description: input.shortDescription,
    coverImageUrl: input.coverImageUrl,
    sortOrder: input.displayOrder,
    status: input.status,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    isFeatured: publishWorkflow.isFeatured,
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
  }
}

function toAlbumUpdateData(input: Partial<GalleryAlbumMutationInput>): Prisma.GalleryCategoryUpdateInput {
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
    ...(input.name !== undefined ? { name: input.name, title: input.name } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.shortDescription !== undefined ? { shortDescription: input.shortDescription, description: input.shortDescription } : {}),
    ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
    ...(input.displayOrder !== undefined ? { sortOrder: input.displayOrder } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: publishWorkflow.isFeatured } : {}),
    ...(input.seoTitle !== undefined ? { seoTitle: seo.seoTitle } : {}),
    ...(input.seoDescription !== undefined ? { seoDescription: seo.seoDescription } : {}),
  }
}

async function ensureImageSlugAvailable(slug: string, excludeId?: number) {
  const existing = await galleryRepository.findImageBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A gallery image with this slug already exists')
  }
}

async function ensureAlbumSlugAvailable(slug: string, excludeId?: number) {
  const existing = await galleryRepository.findAlbumBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A gallery album with this slug already exists')
  }
}

async function createDuplicateImageSlug(sourceSlug: string) {
  return generateUniqueSlug(`${sourceSlug}-${Date.now()}`, async (candidate) => {
    const existing = await galleryRepository.findImageBySlug(candidate)
    return !existing
  })
}

export const galleryService = {
  async list(query: GalleryListQuery) {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['title', 'displayOrder', 'createdAt', 'updatedAt'] as const,
      defaultField: 'displayOrder',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.GalleryImageWhereInput>(query.search, [
      'title',
      'slug',
      'description',
      'caption',
      'altText',
      'photographer',
    ])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.GalleryImageWhereInput>(query.quickFilter, () => {
      if (query.quickFilter === 'featured') {
        return { isFeatured: true }
      }
      if (query.quickFilter === 'draft') {
        return { publishStatus: 'DRAFT' }
      }
      if (query.quickFilter === 'published') {
        return { publishStatus: 'PUBLISHED' }
      }
      if (query.quickFilter === 'recent') {
        const since = new Date()
        since.setDate(since.getDate() - 14)
        return { createdAt: { gte: since } }
      }

      return {}
    })

    const where = mergeWhereClauses<Prisma.GalleryImageWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      query.albumId ? { categoryId: query.albumId } : null,
      query.status ? { status: query.status } : null,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
      query.visibility ? { visibility: query.visibility } : null,
      query.featured ? { isFeatured: query.featured === 'true' } : null,
    )

    const pagination = normalizePagination(query.page, query.pageSize)
    const result = await galleryRepository.listImagesRaw({
      where,
      orderBy: { [sorting.field === 'displayOrder' ? 'sortOrder' : sorting.field]: sorting.order } as Prisma.GalleryImageOrderByWithRelationInput,
      skip: pagination.skip,
      take: pagination.take,
    })

    return {
      items: result.items.map((item) => toImageResponse(item)),
      pagination: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: result.total,
      }),
    }
  },

  async getById(id: number) {
    const image = await galleryRepository.findImageById(id)
    if (!image) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Gallery image not found')
    }

    return toImageResponse(image)
  },

  async create(input: GalleryImageMutationInput, userId?: number) {
    const mediaIds = input.mediaIds?.length ? input.mediaIds : input.mediaId ? [input.mediaId] : []
    if (!mediaIds.length) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'At least one media id is required')
    }

    const created: GalleryImageRecord[] = []

    for (const mediaId of mediaIds) {
      const sourceSlug = mediaIds.length === 1 ? input.slug : `${input.slug}-${mediaId}`
      const slug = mediaIds.length === 1 ? input.slug : await createDuplicateImageSlug(sourceSlug)
      await ensureImageSlugAvailable(slug)

      const record = await galleryRepository.createImage(
        toImageCreateData(
          {
            ...input,
            slug,
            mediaId,
          },
          userId,
        ),
      )
      created.push(record)
    }

    if (created.length === 1) {
      return toImageResponse(created[0] as GalleryImageRecord)
    }

    return created.map((item) => toImageResponse(item as GalleryImageRecord))
  },

  async update(id: number, input: Partial<GalleryImageMutationInput>, userId?: number) {
    const existing = await galleryRepository.findImageById(id)
    if (!existing) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Gallery image not found')
    }

    if (input.slug) {
      await ensureImageSlugAvailable(input.slug, id)
    }

    const updated = await galleryRepository.updateImage(id, toImageUpdateData(input, userId))
    return toImageResponse(updated as GalleryImageRecord)
  },

  async softDelete(id: number, userId?: number) {
    const existing = await galleryRepository.findImageById(id)
    if (!existing) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Gallery image not found')
    }

    await galleryRepository.softDeleteImage(id, userId)
  },

  async listAlbums(query: GalleryAlbumListQuery) {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['name', 'displayOrder', 'createdAt', 'updatedAt'] as const,
      defaultField: 'displayOrder',
      defaultOrder: 'asc',
    })

    const searchWhere = buildSearchOrClause<Prisma.GalleryCategoryWhereInput>(query.search, [
      'name',
      'title',
      'slug',
      'description',
      'shortDescription',
    ])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.GalleryCategoryWhereInput>(query.quickFilter, () => {
      if (query.quickFilter === 'featured') {
        return { isFeatured: true }
      }
      if (query.quickFilter === 'draft') {
        return { publishStatus: 'DRAFT' }
      }
      if (query.quickFilter === 'published') {
        return { publishStatus: 'PUBLISHED' }
      }
      if (query.quickFilter === 'recent') {
        const since = new Date()
        since.setDate(since.getDate() - 14)
        return { createdAt: { gte: since } }
      }

      return {}
    })

    const where = mergeWhereClauses<Prisma.GalleryCategoryWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      query.status ? { status: query.status } : null,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
      query.visibility ? { visibility: query.visibility } : null,
      query.featured ? { isFeatured: query.featured === 'true' } : null,
    )

    const pagination = normalizePagination(query.page, query.pageSize)
    const result = await galleryRepository.listAlbumsRaw({
      where,
      orderBy: { [sorting.field === 'displayOrder' ? 'sortOrder' : sorting.field]: sorting.order } as Prisma.GalleryCategoryOrderByWithRelationInput,
      skip: pagination.skip,
      take: pagination.take,
    })

    return {
      items: result.items.map((item) => toAlbumResponse(item)),
      pagination: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: result.total,
      }),
    }
  },

  async createAlbum(input: GalleryAlbumMutationInput) {
    await ensureAlbumSlugAvailable(input.slug)
    const created = await galleryRepository.createAlbum(toAlbumCreateData(input))
    return toAlbumResponse(created as GalleryAlbumRecord)
  },

  async updateAlbum(id: number, input: Partial<GalleryAlbumMutationInput>) {
    const existing = await galleryRepository.findAlbumById(id)
    if (!existing) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Gallery album not found')
    }

    if (input.slug) {
      await ensureAlbumSlugAvailable(input.slug, id)
    }

    const updated = await galleryRepository.updateAlbum(id, toAlbumUpdateData(input))
    return toAlbumResponse(updated as GalleryAlbumRecord)
  },

  async deleteAlbum(id: number, userId?: number) {
    const existing = await galleryRepository.findAlbumById(id)
    if (!existing) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Gallery album not found')
    }

    await galleryRepository.softDeleteAlbum(id, userId)
  },

  async moveImages(imageIds: number[], albumId: number | null, userId?: number) {
    await galleryRepository.moveImagesToAlbum(imageIds, albumId, userId)
  },
}
