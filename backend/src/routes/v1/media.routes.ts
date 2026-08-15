import { Router } from 'express'

import {
  deleteMediaController,
  getMediaByIdController,
  listMediaController,
  updateMediaController,
  uploadMediaController,
} from '../../controllers/media.controller'
import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import { asyncHandler } from '../../middlewares/async-handler'
import { mediaMultiUploadMiddleware, mediaSingleUploadMiddleware } from '../../middlewares/media-upload.middleware'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  mediaIdParamSchema,
  mediaListQuerySchema,
  mediaUpdateBodySchema,
  mediaUploadBodySchema,
} from '../../validators/media.validator'

const mediaRouter = Router()

mediaRouter.get(
  '/',
  ...buildContentPermissionMiddlewares(permissionSlug('media', 'view')),
  validateRequest({ query: mediaListQuerySchema }),
  asyncHandler(listMediaController),
)
mediaRouter.get(
  '/:id',
  ...buildContentPermissionMiddlewares(permissionSlug('media', 'view')),
  validateRequest({ params: mediaIdParamSchema }),
  asyncHandler(getMediaByIdController),
)
mediaRouter.post(
  '/upload',
  ...buildContentPermissionMiddlewares(permissionSlug('media', 'create')),
  mediaMultiUploadMiddleware,
  validateRequest({ body: mediaUploadBodySchema }),
  asyncHandler(uploadMediaController),
)
mediaRouter.patch(
  '/:id',
  ...buildContentPermissionMiddlewares(permissionSlug('media', 'edit')),
  mediaSingleUploadMiddleware,
  validateRequest({ params: mediaIdParamSchema, body: mediaUpdateBodySchema }),
  asyncHandler(updateMediaController),
)
mediaRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('media', 'delete')), validateRequest({ params: mediaIdParamSchema }), asyncHandler(deleteMediaController))

export { mediaRouter }
