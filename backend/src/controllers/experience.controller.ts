import { type Request, type Response } from 'express'

import { createBaseContentController } from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { experienceService } from '../services/experience.service'
import { type ExperienceListQuery } from '../types/experience'
import { sendSuccess } from '../utils/api-response'

const baseExperienceController = createBaseContentController({
  resourceName: 'Experience',
  service: experienceService,
  parseListQuery: (req) => req.query as unknown as ExperienceListQuery,
  parseCreateBody: (req) => req.body,
  parseUpdateBody: (req) => req.body,
})

export const listExperiencesController = baseExperienceController.list
export const getExperienceByIdController = baseExperienceController.getById
export const getExperienceBySlugController = async (req: Request, res: Response) => {
  const slug = typeof req.params.slug === 'string' ? req.params.slug : String((req.params.slug as string[] | undefined)?.[0] || '')
  const result = await experienceService.getPublicBySlug(slug)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Experience fetched successfully',
    data: result,
  })
}
export const createExperienceController = baseExperienceController.create
export const updateExperienceController = baseExperienceController.update
export const deleteExperienceController = baseExperienceController.remove

export async function duplicateExperienceController(req: Request, res: Response) {
  const result = await experienceService.duplicate(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Experience duplicated successfully',
    data: result,
  })
}

export async function patchExperienceStatusController(req: Request, res: Response) {
  await experienceService.patchStatus(req.body.ids, req.body.publishStatus, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Experience status updated successfully',
    data: null,
  })
}

export async function patchExperienceFeaturedController(req: Request, res: Response) {
  await experienceService.patchFeatured(req.body.ids, req.body.isFeatured, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Experience featured flag updated successfully',
    data: null,
  })
}
