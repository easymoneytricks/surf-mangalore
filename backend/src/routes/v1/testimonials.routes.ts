import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createTestimonialController,
  duplicateTestimonialController,
  deleteTestimonialController,
  getTestimonialByIdController,
  listTestimonialsController,
  updateTestimonialController,
} from '../../controllers/testimonial.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  testimonialCreateBodySchema,
  testimonialIdParamSchema,
  testimonialListQuerySchema,
  testimonialUpdateBodySchema,
} from '../../validators/testimonial.validator'

const testimonialsRouter = Router()

testimonialsRouter.get('/', validateRequest({ query: testimonialListQuerySchema }), asyncHandler(listTestimonialsController))
testimonialsRouter.get('/id/:id', validateRequest({ params: testimonialIdParamSchema }), asyncHandler(getTestimonialByIdController))

testimonialsRouter.post('/', ...buildContentPermissionMiddlewares(permissionSlug('testimonials', 'create')), validateRequest({ body: testimonialCreateBodySchema }), asyncHandler(createTestimonialController))
testimonialsRouter.post('/:id/duplicate', ...buildContentPermissionMiddlewares(permissionSlug('testimonials', 'create')), validateRequest({ params: testimonialIdParamSchema }), asyncHandler(duplicateTestimonialController))
testimonialsRouter.patch('/:id', ...buildContentPermissionMiddlewares(permissionSlug('testimonials', 'edit')), validateRequest({ params: testimonialIdParamSchema, body: testimonialUpdateBodySchema }), asyncHandler(updateTestimonialController))
testimonialsRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('testimonials', 'delete')), validateRequest({ params: testimonialIdParamSchema }), asyncHandler(deleteTestimonialController))

export { testimonialsRouter }
