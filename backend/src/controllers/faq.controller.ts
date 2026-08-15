import { type Request, type Response } from 'express'

import { createBaseContentController } from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { faqService } from '../services/faq.service'
import { type FaqListQuery } from '../types/faq'
import { sendSuccess } from '../utils/api-response'

const baseFaqController = createBaseContentController({
  resourceName: 'FAQ',
  service: faqService,
  parseListQuery: (req) => req.query as unknown as FaqListQuery,
  parseCreateBody: (req) => req.body,
  parseUpdateBody: (req) => req.body,
})

export const listFaqsController = baseFaqController.list
export const getFaqByIdController = baseFaqController.getById
export const createFaqController = baseFaqController.create
export const updateFaqController = baseFaqController.update
export const deleteFaqController = baseFaqController.remove

export async function duplicateFaqController(req: Request, res: Response) {
  const result = await faqService.duplicate(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'FAQ duplicated successfully',
    data: result,
  })
}

export async function patchFaqStatusController(req: Request, res: Response) {
  await faqService.update(Number(req.params.id), { status: req.body.status }, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'FAQ status updated successfully',
    data: null,
  })
}
