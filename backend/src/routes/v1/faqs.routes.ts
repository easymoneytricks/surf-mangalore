import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createFaqController,
  duplicateFaqController,
  deleteFaqController,
  getFaqByIdController,
  listFaqsController,
  patchFaqStatusController,
  updateFaqController,
} from '../../controllers/faq.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  faqCreateBodySchema,
  faqIdParamSchema,
  faqListQuerySchema,
  faqStatusUpdateBodySchema,
  faqUpdateBodySchema,
} from '../../validators/faq.validator'

const faqsRouter = Router()

faqsRouter.get('/', validateRequest({ query: faqListQuerySchema }), asyncHandler(listFaqsController))
faqsRouter.get('/id/:id', validateRequest({ params: faqIdParamSchema }), asyncHandler(getFaqByIdController))

faqsRouter.post('/', ...buildContentPermissionMiddlewares(permissionSlug('faqs', 'create')), validateRequest({ body: faqCreateBodySchema }), asyncHandler(createFaqController))
faqsRouter.post('/:id/duplicate', ...buildContentPermissionMiddlewares(permissionSlug('faqs', 'create')), validateRequest({ params: faqIdParamSchema }), asyncHandler(duplicateFaqController))
faqsRouter.patch('/:id', ...buildContentPermissionMiddlewares(permissionSlug('faqs', 'edit')), validateRequest({ params: faqIdParamSchema, body: faqUpdateBodySchema }), asyncHandler(updateFaqController))
faqsRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('faqs', 'delete')), validateRequest({ params: faqIdParamSchema }), asyncHandler(deleteFaqController))
faqsRouter.patch('/:id/status', ...buildContentPermissionMiddlewares(permissionSlug('faqs', 'publish')), validateRequest({ params: faqIdParamSchema, body: faqStatusUpdateBodySchema }), asyncHandler(patchFaqStatusController))

export { faqsRouter }
