import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createExperienceController,
  deleteExperienceController,
  duplicateExperienceController,
  getExperienceByIdController,
  getExperienceBySlugController,
  listExperiencesController,
  patchExperienceFeaturedController,
  patchExperienceStatusController,
  updateExperienceController,
} from '../../controllers/experience.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  experienceCreateBodySchema,
  experienceFeaturedPatchSchema,
  experienceIdParamSchema,
  experienceListQuerySchema,
  experienceStatusPatchSchema,
  experienceUpdateBodySchema,
} from '../../validators/experience.validator'

const experiencesRouter = Router()

experiencesRouter.get('/', validateRequest({ query: experienceListQuerySchema }), asyncHandler(listExperiencesController))
experiencesRouter.get('/id/:id', validateRequest({ params: experienceIdParamSchema }), asyncHandler(getExperienceByIdController))
experiencesRouter.get('/:slug', asyncHandler(getExperienceBySlugController))
experiencesRouter.post('/', ...buildContentPermissionMiddlewares(permissionSlug('experiences', 'create')), validateRequest({ body: experienceCreateBodySchema }), asyncHandler(createExperienceController))
experiencesRouter.put('/:id', ...buildContentPermissionMiddlewares(permissionSlug('experiences', 'edit')), validateRequest({ params: experienceIdParamSchema, body: experienceUpdateBodySchema }), asyncHandler(updateExperienceController))
experiencesRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('experiences', 'delete')), validateRequest({ params: experienceIdParamSchema }), asyncHandler(deleteExperienceController))
experiencesRouter.post('/:id/duplicate', ...buildContentPermissionMiddlewares(permissionSlug('experiences', 'create')), validateRequest({ params: experienceIdParamSchema }), asyncHandler(duplicateExperienceController))
experiencesRouter.patch('/status', ...buildContentPermissionMiddlewares(permissionSlug('experiences', 'publish')), validateRequest({ body: experienceStatusPatchSchema }), asyncHandler(patchExperienceStatusController))
experiencesRouter.patch('/featured', ...buildContentPermissionMiddlewares(permissionSlug('experiences', 'edit')), validateRequest({ body: experienceFeaturedPatchSchema }), asyncHandler(patchExperienceFeaturedController))

export { experiencesRouter }
