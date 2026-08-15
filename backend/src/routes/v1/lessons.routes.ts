import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createLessonController,
  deleteLessonController,
  getLessonByIdController,
  getLessonBySlugController,
  listLessonsController,
  patchLessonFeaturedController,
  patchLessonStatusController,
  updateLessonController,
} from '../../controllers/lesson.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  lessonCreateBodySchema,
  lessonFeaturedPatchSchema,
  lessonIdParamSchema,
  lessonListQuerySchema,
  lessonStatusPatchSchema,
  lessonUpdateBodySchema,
} from '../../validators/lesson.validator'

const lessonsRouter = Router()

lessonsRouter.get('/', validateRequest({ query: lessonListQuerySchema }), asyncHandler(listLessonsController))
lessonsRouter.get('/id/:id', validateRequest({ params: lessonIdParamSchema }), asyncHandler(getLessonByIdController))
lessonsRouter.get('/:slug', asyncHandler(getLessonBySlugController))

lessonsRouter.post('/', ...buildContentPermissionMiddlewares(permissionSlug('lessons', 'create')), validateRequest({ body: lessonCreateBodySchema }), asyncHandler(createLessonController))
lessonsRouter.put('/:id', ...buildContentPermissionMiddlewares(permissionSlug('lessons', 'edit')), validateRequest({ params: lessonIdParamSchema, body: lessonUpdateBodySchema }), asyncHandler(updateLessonController))
lessonsRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('lessons', 'delete')), validateRequest({ params: lessonIdParamSchema }), asyncHandler(deleteLessonController))
lessonsRouter.patch('/status', ...buildContentPermissionMiddlewares(permissionSlug('lessons', 'publish')), validateRequest({ body: lessonStatusPatchSchema }), asyncHandler(patchLessonStatusController))
lessonsRouter.patch('/featured', ...buildContentPermissionMiddlewares(permissionSlug('lessons', 'edit')), validateRequest({ body: lessonFeaturedPatchSchema }), asyncHandler(patchLessonFeaturedController))

export { lessonsRouter }
