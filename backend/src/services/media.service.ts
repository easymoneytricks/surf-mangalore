import { MediaType, type Prisma } from '@prisma/client'
import path from 'node:path'

import {
  buildSearchOrClause,
  buildSorting,
  mergeWhereClauses,
  withCreateAudit,
  withUpdateAudit,
  generateUniqueSlug,
  BaseContentService,
} from '../content-engine'
import { env } from '../config/env'
import { getCloudinaryFolderPrefix, uploadBufferToCloudinary, deleteCloudinaryAsset } from '../lib/cloudinary'
import { mediaRepository } from '../repositories/media.repository'
import { type MediaListQuery, type MediaUpdateInput, type MediaUploadInput } from '../types/media'
import { mediaProcessingService } from './media-processing.service'
import { mediaSecurityService } from './media-security.service'
import { HTTP_STATUS } from '../constants/http'
import { ApiError } from '../utils/api-error'

type MediaListRecord = Awaited<ReturnType<typeof mediaRepository.listRaw>>['items'][number]
type MediaDetailRecord = NonNullable<Awaited<ReturnType<typeof mediaRepository.findById>>>
type MediaRecord = MediaListRecord | MediaDetailRecord

type MediaMetadata = {
  processing?: {
    outputFormat?: string
    supportsFutureAvif?: boolean
  }
  security?: {
    avScanEnabled?: boolean
    scanStatus?: 'not_configured' | 'passed'
  }
  original?: {
    fileName?: string
    mimeType?: string
    fileSizeBytes?: number
  }
}

const baseMediaCrudService = new BaseContentService<
  MediaRecord,
  Prisma.MediaWhereInput,
  Prisma.MediaOrderByWithRelationInput,
  Prisma.MediaCreateInput,
  Prisma.MediaUpdateInput,
  Prisma.MediaUpdateManyMutationInput,
  MediaListQuery
>({
  repository: mediaRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['createdAt', 'updatedAt', 'title', 'fileSizeBytes', 'width', 'height'] as const,
      defaultField: 'createdAt',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.MediaWhereInput>(query.search, [
      'title',
      'name',
      'slug',
      'fileName',
      'description',
      'altText',
    ])

    const folderWhere = query.folder
      ? { folderPath: { equals: sanitizeFolder(query.folder) } } as Prisma.MediaWhereInput
      : null

    const tagWhere = query.tag
      ? { tags: { has: query.tag } } as Prisma.MediaWhereInput
      : null

    const where = mergeWhereClauses<Prisma.MediaWhereInput>(
      { deletedAt: null, mediaType: MediaType.IMAGE },
      searchWhere,
      folderWhere,
      tagWhere,
      query.status ? { status: query.status } : null,
      query.visibility ? { visibility: query.visibility } : null,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
    )

    return {
      where,
      orderBy: {
        [sorting.field]: sorting.order,
      } as Prisma.MediaOrderByWithRelationInput,
    }
  },
})

function slugifyFileName(value: string) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base || 'image'
}

function sanitizeFolder(value?: string) {
  if (!value) {
    return 'library/general'
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/\-_]/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^-+|-+$/g, '')

  return normalized || 'library/general'
}

function getMetadata(record: MediaRecord): MediaMetadata {
  if (!record.metadata || typeof record.metadata !== 'object' || Array.isArray(record.metadata)) {
    return {}
  }

  return record.metadata as unknown as MediaMetadata
}

function toMediaResponse(record: MediaRecord) {
  const usageCount = Math.max(record.usageCount || 0, record._count.galleryImages)

  return {
    id: record.id,
    uuid: record.uuid,
    slug: record.slug,
    title: record.title,
    description: record.description,
    status: record.status,
    publishStatus: record.publishStatus,
    visibility: record.visibility,
    mediaType: record.mediaType,
    mimeType: record.mimeType,
    fileName: record.fileName,
    filePath: record.filePath,
    fileSizeBytes: record.fileSizeBytes || 0,
    width: record.width || 0,
    height: record.height || 0,
    altText: record.altText,
    caption: record.caption || '',
    tags: record.tags || [],
    folder: record.folderPath,
    thumbnailUrl: record.thumbnailPath || record.filePath,
    usageCount,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdBy: record.createdBy,
    updatedBy: record.updatedBy,
  }
}

function parseCloudinaryIds(record: MediaRecord) {
  return {
    publicId: record.cloudinaryPublicId || undefined,
    thumbnailPublicId: record.cloudinaryThumbId || undefined,
  }
}

function getCloudinaryFolder(logicalFolder: string) {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')

  return `${getCloudinaryFolderPrefix()}/${logicalFolder}/${year}/${month}`
}

async function createUniqueMediaSlug(originalFileName: string) {
  const base = slugifyFileName(path.parse(originalFileName).name)

  return generateUniqueSlug(`${base}-${Date.now()}`, async (candidate) => {
    const existing = await mediaRepository.findBySlug(candidate)
    return !existing
  })
}

async function uploadOneImage(input: {
  file: Express.Multer.File
  folder?: string
  tags?: string[]
  altText?: string
  caption?: string
  description?: string
  userId?: number
  existingRecord?: MediaRecord
  replaceOld?: boolean
}) {
  await mediaSecurityService.validateUploadedFile(input.file)

  const processed = await mediaProcessingService.processImage(input.file)
  const slug = input.existingRecord?.slug || await createUniqueMediaSlug(input.file.originalname)

  const logicalFolder = sanitizeFolder(input.folder)
  const cloudinaryFolder = getCloudinaryFolder(logicalFolder)
  const imagePublicId = `${slug}`
  const thumbnailPublicId = `${slug}__thumb`

  let imageUpload
  let thumbnailUpload

  try {
    ;[imageUpload, thumbnailUpload] = await Promise.all([
      uploadBufferToCloudinary({
        buffer: processed.optimizedBuffer,
        folder: cloudinaryFolder,
        publicId: imagePublicId,
        overwrite: Boolean(input.existingRecord),
      }),
      uploadBufferToCloudinary({
        buffer: processed.thumbnailBuffer,
        folder: cloudinaryFolder,
        publicId: thumbnailPublicId,
        overwrite: Boolean(input.existingRecord),
      }),
    ])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cloudinary upload failed'
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message)
  }

  if (input.replaceOld && input.existingRecord) {
    const oldIds = parseCloudinaryIds(input.existingRecord)
    const oldPublicIds = [oldIds.publicId, oldIds.thumbnailPublicId].filter(
      (value): value is string => Boolean(value) && value !== imageUpload.public_id && value !== thumbnailUpload.public_id,
    )

    await Promise.all(oldPublicIds.map((publicId) => deleteCloudinaryAsset(publicId).catch(() => undefined)))
  }

  const metadata: MediaMetadata = {
    processing: {
      outputFormat: 'webp',
      supportsFutureAvif: true,
    },
    security: {
      avScanEnabled: env.MEDIA_ENABLE_AV_SCANNING,
      scanStatus: 'passed',
    },
    original: {
      fileName: input.file.originalname,
      mimeType: input.file.mimetype,
      fileSizeBytes: input.file.size,
    },
  }

  const title = path.parse(input.file.originalname).name.replace(/[-_]+/g, ' ').trim()

  return {
    slug,
    name: title || slug,
    title: input.existingRecord?.title || title || slug,
    description: input.description ?? input.existingRecord?.description ?? null,
    altText: input.altText ?? input.existingRecord?.altText ?? null,
    fileName: `${slug}.webp`,
    filePath: imageUpload.secure_url,
    thumbnailPath: thumbnailUpload.secure_url,
    cloudinaryPublicId: imageUpload.public_id,
    cloudinaryThumbId: thumbnailUpload.public_id,
    folderPath: logicalFolder,
    tags: input.tags || [],
    caption: input.caption ?? input.existingRecord?.caption ?? null,
    usageCount: input.existingRecord?.usageCount || 0,
    fileSizeBytes: processed.optimizedBuffer.byteLength,
    width: processed.width,
    height: processed.height,
    mimeType: 'image/webp',
    mediaType: MediaType.IMAGE,
    metadata,
  }
}

export const mediaService = {
  async list(query: MediaListQuery) {
    const result = await baseMediaCrudService.list(query)
    return {
      items: result.items.map((item) => toMediaResponse(item)),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const media = await baseMediaCrudService.getById(id)
    return toMediaResponse(media)
  },

  async upload(input: MediaUploadInput, userId?: number) {
    if (!input.files.length) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'At least one file is required')
    }

    const createdItems = []

    for (const file of input.files) {
      const uploaded = await uploadOneImage({
        file,
        folder: input.folder,
        tags: input.tags,
        altText: input.altText,
        caption: input.caption,
        description: input.description,
      })

      const record = await mediaRepository.create({
        slug: uploaded.slug,
        name: uploaded.name,
        title: uploaded.title,
        description: uploaded.description,
        status: 'active',
        mediaType: uploaded.mediaType,
        mimeType: uploaded.mimeType,
        fileName: uploaded.fileName,
        filePath: uploaded.filePath,
        thumbnailPath: uploaded.thumbnailPath,
        cloudinaryPublicId: uploaded.cloudinaryPublicId,
        cloudinaryThumbId: uploaded.cloudinaryThumbId,
        folderPath: uploaded.folderPath,
        tags: uploaded.tags,
        caption: uploaded.caption,
        usageCount: uploaded.usageCount,
        fileSizeBytes: uploaded.fileSizeBytes,
        width: uploaded.width,
        height: uploaded.height,
        altText: uploaded.altText,
        metadata: uploaded.metadata as Prisma.InputJsonValue,
        ...withCreateAudit({}, userId),
      })

      createdItems.push(toMediaResponse(record))
    }

    return createdItems
  },

  async update(id: number, input: MediaUpdateInput, userId?: number) {
    const existing = await baseMediaCrudService.getById(id)

    const existingMetadata = getMetadata(existing)

    let replacementData: Awaited<ReturnType<typeof uploadOneImage>> | null = null
    if (input.replacementFile) {
      replacementData = await uploadOneImage({
        file: input.replacementFile,
        folder: input.folder || existing.folderPath,
        tags: input.tags || existing.tags,
        altText: input.altText,
        caption: input.caption || existing.caption || undefined,
        description: input.description,
        existingRecord: existing,
        replaceOld: true,
      })
    }

    const nextMetadata: MediaMetadata = {
      ...existingMetadata,
      ...(replacementData?.metadata || {}),
    }

    const updateData: Prisma.MediaUpdateInput = {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.altText !== undefined ? { altText: input.altText } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
      ...(input.publishStatus !== undefined ? { publishStatus: input.publishStatus } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.caption !== undefined ? { caption: input.caption } : {}),
      ...(input.folder !== undefined ? { folderPath: sanitizeFolder(input.folder) } : {}),
      ...(replacementData
        ? {
            fileName: replacementData.fileName,
            filePath: replacementData.filePath,
        thumbnailPath: replacementData.thumbnailPath,
        cloudinaryPublicId: replacementData.cloudinaryPublicId,
        cloudinaryThumbId: replacementData.cloudinaryThumbId,
        folderPath: replacementData.folderPath,
        tags: replacementData.tags,
        caption: replacementData.caption,
            fileSizeBytes: replacementData.fileSizeBytes,
            width: replacementData.width,
            height: replacementData.height,
            mimeType: replacementData.mimeType,
          }
        : {}),
      metadata: nextMetadata as Prisma.InputJsonValue,
    }

    const updated = await mediaRepository.update(id, withUpdateAudit(updateData, userId))

    return toMediaResponse(updated)
  },

  async softDelete(id: number, userId?: number) {
    const media = await baseMediaCrudService.getById(id)
    const usageCount = Math.max(media.usageCount || 0, media._count.galleryImages)

    if (usageCount > 0) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        'Media cannot be deleted while it is referenced by existing content. Remove its references first.',
      )
    }

    await baseMediaCrudService.remove(id, userId)
  },
}
