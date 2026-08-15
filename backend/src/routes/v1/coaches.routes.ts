import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createCoachController,
  deleteCoachController,
  duplicateCoachController,
  getCoachByIdController,
  getCoachBySlugController,
  listCoachesController,
  patchCoachFeaturedController,
  patchCoachStatusController,
  updateCoachController,
} from '../../controllers/coach.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  coachCreateBodySchema,
  coachFeaturedPatchSchema,
  coachIdParamSchema,
  coachListQuerySchema,
  coachStatusPatchSchema,
  coachUpdateBodySchema,
} from '../../validators/coach.validator'

const coachesRouter = Router()

coachesRouter.get('/', validateRequest({ query: coachListQuerySchema }), asyncHandler(listCoachesController))
coachesRouter.get('/id/:id', validateRequest({ params: coachIdParamSchema }), asyncHandler(getCoachByIdController))
coachesRouter.get('/:slug', asyncHandler(getCoachBySlugController))
coachesRouter.post('/', ...buildContentPermissionMiddlewares(permissionSlug('coaches', 'create')), validateRequest({ body: coachCreateBodySchema }), asyncHandler(createCoachController))
coachesRouter.patch('/:id', ...buildContentPermissionMiddlewares(permissionSlug('coaches', 'edit')), validateRequest({ params: coachIdParamSchema, body: coachUpdateBodySchema }), asyncHandler(updateCoachController))
coachesRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('coaches', 'delete')), validateRequest({ params: coachIdParamSchema }), asyncHandler(deleteCoachController))
coachesRouter.post('/:id/duplicate', ...buildContentPermissionMiddlewares(permissionSlug('coaches', 'create')), validateRequest({ params: coachIdParamSchema }), asyncHandler(duplicateCoachController))
coachesRouter.patch('/status', ...buildContentPermissionMiddlewares(permissionSlug('coaches', 'publish')), validateRequest({ body: coachStatusPatchSchema }), asyncHandler(patchCoachStatusController))
coachesRouter.patch('/featured', ...buildContentPermissionMiddlewares(permissionSlug('coaches', 'edit')), validateRequest({ body: coachFeaturedPatchSchema }), asyncHandler(patchCoachFeaturedController))

export { coachesRouter }
