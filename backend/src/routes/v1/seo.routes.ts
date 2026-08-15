import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createSeoPageController,
  deleteSeoPageController,
  getSeoForPathController,
  getSeoPageByIdController,
  listSeoPagesController,
  updateSeoPageController,
} from '../../controllers/seo.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  seoCreateBodySchema,
  seoIdParamSchema,
  seoListQuerySchema,
  seoPublicQuerySchema,
  seoUpdateBodySchema,
} from '../../validators/seo.validator'

const seoRouter = Router()

seoRouter.get('/public', validateRequest({ query: seoPublicQuerySchema }), asyncHandler(getSeoForPathController))

seoRouter.get('/', ...buildContentPermissionMiddlewares(permissionSlug('seo', 'view')), validateRequest({ query: seoListQuerySchema }), asyncHandler(listSeoPagesController))
seoRouter.get('/:id', ...buildContentPermissionMiddlewares(permissionSlug('seo', 'view')), validateRequest({ params: seoIdParamSchema }), asyncHandler(getSeoPageByIdController))
seoRouter.post('/', ...buildContentPermissionMiddlewares(permissionSlug('seo', 'create')), validateRequest({ body: seoCreateBodySchema }), asyncHandler(createSeoPageController))
seoRouter.put('/:id', ...buildContentPermissionMiddlewares(permissionSlug('seo', 'edit')), validateRequest({ params: seoIdParamSchema, body: seoUpdateBodySchema }), asyncHandler(updateSeoPageController))
seoRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('seo', 'delete')), validateRequest({ params: seoIdParamSchema }), asyncHandler(deleteSeoPageController))

export { seoRouter }
