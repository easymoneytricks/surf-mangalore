import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { galleryService } from '../services/gallery.service'
import { type GalleryAlbumListQuery, type GalleryListQuery } from '../types/gallery'
import { sendPaginated, sendSuccess } from '../utils/api-response'

export async function listGalleryController(req: Request, res: Response) {
  const result = await galleryService.list(req.query as unknown as GalleryListQuery)

  return sendPaginated(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Gallery images fetched successfully',
    items: result.items,
    pagination: result.pagination,
  })
}

export async function listGalleryAlbumsController(req: Request, res: Response) {
  const result = await galleryService.listAlbums(req.query as unknown as GalleryAlbumListQuery)

  return sendPaginated(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Gallery albums fetched successfully',
    items: result.items,
    pagination: result.pagination,
  })
}

export async function getGalleryByIdController(req: Request, res: Response) {
  const item = await galleryService.getById(Number(req.params.id))

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Gallery image fetched successfully',
    data: item,
  })
}

export async function createGalleryController(req: Request, res: Response) {
  const data = await galleryService.create(req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Gallery image created successfully',
    data,
  })
}

export async function updateGalleryController(req: Request, res: Response) {
  const item = await galleryService.update(Number(req.params.id), req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Gallery image updated successfully',
    data: item,
  })
}

export async function deleteGalleryController(req: Request, res: Response) {
  await galleryService.softDelete(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Gallery image deleted successfully',
    data: null,
  })
}

export async function createGalleryAlbumController(req: Request, res: Response) {
  const data = await galleryService.createAlbum(req.body)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Gallery album created successfully',
    data,
  })
}

export async function updateGalleryAlbumController(req: Request, res: Response) {
  const data = await galleryService.updateAlbum(Number(req.params.id), req.body)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Gallery album updated successfully',
    data,
  })
}

export async function deleteGalleryAlbumController(req: Request, res: Response) {
  await galleryService.deleteAlbum(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Gallery album deleted successfully',
    data: null,
  })
}

export async function moveGalleryImagesController(req: Request, res: Response) {
  await galleryService.moveImages(req.body.imageIds, req.body.albumId ?? null, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Gallery images moved successfully',
    data: null,
  })
}
