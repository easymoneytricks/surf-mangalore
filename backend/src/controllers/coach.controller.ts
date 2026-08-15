import { type Request, type Response } from 'express'

import { createBaseContentController } from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { coachService } from '../services/coach.service'
import { type CoachListQuery } from '../types/coach'
import { sendSuccess } from '../utils/api-response'

const baseCoachController = createBaseContentController({
  resourceName: 'Coach',
  service: coachService,
  parseListQuery: (req) => req.query as unknown as CoachListQuery,
  parseCreateBody: (req) => req.body,
  parseUpdateBody: (req) => req.body,
})

export const listCoachesController = baseCoachController.list
export const getCoachByIdController = baseCoachController.getById
export const createCoachController = baseCoachController.create
export const updateCoachController = baseCoachController.update
export const deleteCoachController = baseCoachController.remove

export async function getCoachBySlugController(req: Request, res: Response) {
  const slug = typeof req.params.slug === 'string' ? req.params.slug : String((req.params.slug as string[] | undefined)?.[0] || '')
  const result = await coachService.getPublicBySlug(slug)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Coach fetched successfully',
    data: result,
  })
}

export async function duplicateCoachController(req: Request, res: Response) {
  const result = await coachService.duplicate(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Coach duplicated successfully',
    data: result,
  })
}

export async function patchCoachStatusController(req: Request, res: Response) {
  await coachService.patchStatus(req.body.ids, req.body.publishStatus, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Coach status updated successfully',
    data: null,
  })
}

export async function patchCoachFeaturedController(req: Request, res: Response) {
  await coachService.patchFeatured(req.body.ids, req.body.isFeatured, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Coach featured flag updated successfully',
    data: null,
  })
}
