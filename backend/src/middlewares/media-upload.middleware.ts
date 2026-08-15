import { type Request } from 'express'
import multer, { type FileFilterCallback } from 'multer'
import path from 'node:path'

import {
  MEDIA_ALLOWED_IMAGE_EXTENSIONS,
  MEDIA_ALLOWED_IMAGE_MIME_TYPES,
  MEDIA_MAX_FILES_PER_UPLOAD,
  MEDIA_MAX_FILE_SIZE_BYTES,
} from '../constants/media'
import { HTTP_STATUS } from '../constants/http'
import { ApiError } from '../utils/api-error'

function normalizeExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase().replace('.', '')
  return extension
}

function imageFileFilter(_req: Request, file: Express.Multer.File, callback: FileFilterCallback) {
  const extension = normalizeExtension(file.originalname)
  const mimeAllowed = MEDIA_ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype as (typeof MEDIA_ALLOWED_IMAGE_MIME_TYPES)[number])
  const extensionAllowed = MEDIA_ALLOWED_IMAGE_EXTENSIONS.includes(extension as (typeof MEDIA_ALLOWED_IMAGE_EXTENSIONS)[number])

  if (!mimeAllowed || !extensionAllowed) {
    callback(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Unsupported file type. Allowed: JPEG, PNG, WEBP, GIF'))
    return
  }

  callback(null, true)
}

const uploader = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MEDIA_MAX_FILE_SIZE_BYTES,
  },
})

export const mediaMultiUploadMiddleware = uploader.array('files', MEDIA_MAX_FILES_PER_UPLOAD)

export const mediaSingleUploadMiddleware = uploader.single('file')
