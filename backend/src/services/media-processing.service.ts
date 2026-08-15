import sharp, { type Metadata } from 'sharp'

import {
  MEDIA_MAX_HEIGHT,
  MEDIA_MAX_WIDTH,
  MEDIA_MIN_HEIGHT,
  MEDIA_MIN_WIDTH,
  MEDIA_OPTIMIZED_MAX_HEIGHT,
  MEDIA_OPTIMIZED_MAX_WIDTH,
  MEDIA_THUMBNAIL_QUALITY,
  MEDIA_THUMBNAIL_SIZE,
  MEDIA_WEBP_QUALITY,
} from '../constants/media'
import { HTTP_STATUS } from '../constants/http'
import { ApiError } from '../utils/api-error'

type ProcessedImageResult = {
  optimizedBuffer: Buffer
  thumbnailBuffer: Buffer
  width: number
  height: number
}

export const mediaProcessingService = {
  async processImage(file: Express.Multer.File): Promise<ProcessedImageResult> {
    let metadata: Metadata

    try {
      metadata = await sharp(file.buffer).metadata()
    } catch {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Uploaded file is not a valid image')
    }

    const width = metadata.width || 0
    const height = metadata.height || 0

    if (!width || !height) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Image dimensions could not be determined')
    }

    if (width < MEDIA_MIN_WIDTH || height < MEDIA_MIN_HEIGHT) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Image too small. Minimum dimensions: ${MEDIA_MIN_WIDTH}x${MEDIA_MIN_HEIGHT}`)
    }

    if (width > MEDIA_MAX_WIDTH || height > MEDIA_MAX_HEIGHT) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Image too large. Maximum dimensions: ${MEDIA_MAX_WIDTH}x${MEDIA_MAX_HEIGHT}`)
    }

    const optimized = sharp(file.buffer)
      .rotate()
      .resize({
        width: MEDIA_OPTIMIZED_MAX_WIDTH,
        height: MEDIA_OPTIMIZED_MAX_HEIGHT,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: MEDIA_WEBP_QUALITY })

    const optimizedMetadata = await optimized.metadata()

    const optimizedBuffer = await optimized.toBuffer()
    const thumbnailBuffer = await sharp(file.buffer)
      .rotate()
      .resize({
        width: MEDIA_THUMBNAIL_SIZE,
        height: MEDIA_THUMBNAIL_SIZE,
        fit: 'cover',
      })
      .webp({ quality: MEDIA_THUMBNAIL_QUALITY })
      .toBuffer()

    return {
      optimizedBuffer,
      thumbnailBuffer,
      width: optimizedMetadata.width || width,
      height: optimizedMetadata.height || height,
    }
  },
}
