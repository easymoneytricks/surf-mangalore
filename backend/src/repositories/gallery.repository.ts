import { type Prisma } from '@prisma/client'

import { buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

const imageIncludeConfig = {
  media: {
    select: {
      id: true,
      title: true,
      filePath: true,
      thumbnailPath: true,
      altText: true,
      caption: true,
      tags: true,
      width: true,
      height: true,
    },
  },
  category: {
    select: {
      id: true,
      uuid: true,
      slug: true,
      name: true,
      title: true,
      publishStatus: true,
    },
  },
  createdBy: { select: { id: true, uuid: true, name: true } },
  updatedBy: { select: { id: true, uuid: true, name: true } },
} as const

const albumIncludeConfig = {
  _count: {
    select: {
      images: {
        where: {
          deletedAt: null,
        },
      },
    },
  },
} as const

class GalleryRepository {
  async findImageById(id: number) {
    return prisma.galleryImage.findFirst({
      where: { id, deletedAt: null },
      include: imageIncludeConfig,
    })
  }

  async findImageBySlug(slug: string, excludeId?: number) {
    return prisma.galleryImage.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async listImagesRaw(params: {
    where: Prisma.GalleryImageWhereInput
    orderBy: Prisma.GalleryImageOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.galleryImage.count({ where: params.where }),
      prisma.galleryImage.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: imageIncludeConfig,
      }),
    ])

    return { total, items }
  }

  async createImage(data: Prisma.GalleryImageCreateInput) {
    return prisma.galleryImage.create({
      data,
      include: imageIncludeConfig,
    })
  }

  async updateImage(id: number, data: Prisma.GalleryImageUpdateInput) {
    return prisma.galleryImage.update({
      where: { id },
      data,
      include: imageIncludeConfig,
    })
  }

  async softDeleteImage(id: number, updatedById?: number) {
    return prisma.galleryImage.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }

  async findAlbumById(id: number) {
    return prisma.galleryCategory.findFirst({
      where: { id, deletedAt: null },
      include: albumIncludeConfig,
    })
  }

  async findAlbumBySlug(slug: string, excludeId?: number) {
    return prisma.galleryCategory.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async listAlbumsRaw(params: {
    where: Prisma.GalleryCategoryWhereInput
    orderBy: Prisma.GalleryCategoryOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.galleryCategory.count({ where: params.where }),
      prisma.galleryCategory.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: albumIncludeConfig,
      }),
    ])

    return { total, items }
  }

  async createAlbum(data: Prisma.GalleryCategoryCreateInput) {
    return prisma.galleryCategory.create({
      data,
      include: albumIncludeConfig,
    })
  }

  async updateAlbum(id: number, data: Prisma.GalleryCategoryUpdateInput) {
    return prisma.galleryCategory.update({
      where: { id },
      data,
      include: albumIncludeConfig,
    })
  }

  async softDeleteAlbum(id: number, updatedById?: number) {
    return prisma.galleryCategory.update({
      where: { id },
      data: {
        ...buildSoftDeleteUpdate(updatedById),
      },
    })
  }

  async moveImagesToAlbum(imageIds: number[], albumId: number | null, updatedById?: number) {
    return prisma.galleryImage.updateMany({
      where: {
        id: { in: imageIds },
        deletedAt: null,
      },
      data: {
        categoryId: albumId,
        ...(updatedById ? { updatedById } : {}),
      },
    })
  }
}

export const galleryRepository = new GalleryRepository()
