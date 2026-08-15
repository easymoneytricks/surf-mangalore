import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { mediaService } from '../services/media.service'
import { type MediaListQuery, type MediaUpdateInput } from '../types/media'
import { ApiError } from '../utils/api-error'
import { sendPaginated, sendSuccess } from '../utils/api-response'

export async function listMediaController(req: Request, res: Response) {
  const result = await mediaService.list(req.query as unknown as MediaListQuery)

  return sendPaginated(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Media fetched successfully',
    items: result.items,
    pagination: result.pagination,
  })
}

export async function getMediaByIdController(req: Request, res: Response) {
  const media = await mediaService.getById(Number(req.params.id))

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Media fetched successfully',
    data: media,
  })
}

export async function uploadMediaController(req: Request, res: Response) {
  const files = Array.isArray(req.files) ? req.files : []

  const items = await mediaService.upload({
    files,
    folder: req.body.folder,
    tags: req.body.tags,
    altText: req.body.altText,
    caption: req.body.caption,
    description: req.body.description,
  }, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Media uploaded successfully',
    data: items,
  })
}

export async function updateMediaController(req: Request, res: Response) {
  const updateInput: MediaUpdateInput = {
    ...(req.body.title !== undefined ? { title: req.body.title } : {}),
    ...(req.body.folder !== undefined ? { folder: req.body.folder } : {}),
    ...(req.body.tags !== undefined ? { tags: req.body.tags } : {}),
    ...(req.body.altText !== undefined ? { altText: req.body.altText } : {}),
    ...(req.body.caption !== undefined ? { caption: req.body.caption } : {}),
    ...(req.body.description !== undefined ? { description: req.body.description } : {}),
    ...(req.body.status !== undefined ? { status: req.body.status } : {}),
    ...(req.body.visibility !== undefined ? { visibility: req.body.visibility } : {}),
    ...(req.body.publishStatus !== undefined ? { publishStatus: req.body.publishStatus } : {}),
    ...(req.file ? { replacementFile: req.file } : {}),
  }

  if (!updateInput.replacementFile && Object.keys(updateInput).length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'At least one field or replacement file is required for update')
  }

  const updated = await mediaService.update(Number(req.params.id), updateInput, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Media updated successfully',
    data: updated,
  })
}

export async function deleteMediaController(req: Request, res: Response) {
  await mediaService.softDelete(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Media deleted successfully',
    data: null,
  })
}
