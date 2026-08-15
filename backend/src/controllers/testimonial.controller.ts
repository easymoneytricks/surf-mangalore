import { createBaseContentController } from '../content-engine'
import { testimonialService } from '../services/testimonial.service'
import { type TestimonialListQuery } from '../types/testimonial'
import { HTTP_STATUS } from '../constants/http'
import { sendSuccess } from '../utils/api-response'
import { type Request, type Response } from 'express'

const baseTestimonialController = createBaseContentController({
  resourceName: 'Testimonial',
  service: testimonialService,
  parseListQuery: (req) => req.query as unknown as TestimonialListQuery,
  parseCreateBody: (req) => req.body,
  parseUpdateBody: (req) => req.body,
})

export const listTestimonialsController = baseTestimonialController.list
export const getTestimonialByIdController = baseTestimonialController.getById
export const createTestimonialController = baseTestimonialController.create
export const updateTestimonialController = baseTestimonialController.update
export const deleteTestimonialController = baseTestimonialController.remove

export async function duplicateTestimonialController(req: Request, res: Response) {
  const result = await testimonialService.duplicate(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Testimonial duplicated successfully',
    data: result,
  })
}
