import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { seoService } from '../services/seo.service'
import { type SeoListQuery, type SeoMutationInput, type SeoPublicQuery } from '../types/seo'
import { sendPaginated, sendSuccess } from '../utils/api-response'

export async function listSeoPagesController(req: Request, res: Response) {
  const query = req.query as unknown as SeoListQuery
  const result = await seoService.list(query)

  return sendPaginated(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'SEO pages fetched successfully',
    items: result.items,
    pagination: result.pagination,
  })
}

export async function getSeoPageByIdController(req: Request, res: Response) {
  const result = await seoService.getById(Number(req.params.id))

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'SEO page fetched successfully',
    data: result,
  })
}

export async function createSeoPageController(req: Request, res: Response) {
  const result = await seoService.create(req.body as SeoMutationInput, req.authUser!.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'SEO page created successfully',
    data: result,
  })
}

export async function updateSeoPageController(req: Request, res: Response) {
  const result = await seoService.update(Number(req.params.id), req.body as Partial<SeoMutationInput>, req.authUser!.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'SEO page updated successfully',
    data: result,
  })
}

export async function deleteSeoPageController(req: Request, res: Response) {
  await seoService.softDelete(Number(req.params.id), req.authUser!.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'SEO page deleted successfully',
    data: null,
  })
}

export async function getSeoForPathController(req: Request, res: Response) {
  const query = req.query as unknown as SeoPublicQuery
  const result = await seoService.getPublicByPath(query.path, query.localeCode)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'SEO metadata fetched successfully',
    data: result,
  })
}
