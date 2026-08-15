import { Router } from 'express'
import { z } from 'zod'

import {
  createGalleryAlbumController,
  createGalleryController,
  deleteGalleryAlbumController,
  deleteGalleryController,
  getGalleryByIdController,
  listGalleryAlbumsController,
  listGalleryController,
  moveGalleryImagesController,
  updateGalleryAlbumController,
  updateGalleryController,
} from '../../controllers/gallery.controller'
import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  galleryAlbumCreateBodySchema,
  galleryAlbumListQuerySchema,
  galleryAlbumUpdateBodySchema,
  galleryCreateBodySchema,
  galleryIdParamSchema,
  galleryListQuerySchema,
  galleryUpdateBodySchema,
} from '../../validators/gallery.validator'

const galleryRouter = Router()

galleryRouter.get('/', validateRequest({ query: galleryListQuerySchema }), asyncHandler(listGalleryController))
galleryRouter.get('/albums', validateRequest({ query: galleryAlbumListQuerySchema }), asyncHandler(listGalleryAlbumsController))
galleryRouter.get('/:id', validateRequest({ params: galleryIdParamSchema }), asyncHandler(getGalleryByIdController))

galleryRouter.post('/', ...buildContentPermissionMiddlewares(permissionSlug('gallery', 'create')), validateRequest({ body: galleryCreateBodySchema }), asyncHandler(createGalleryController))
galleryRouter.put('/:id', ...buildContentPermissionMiddlewares(permissionSlug('gallery', 'edit')), validateRequest({ params: galleryIdParamSchema, body: galleryUpdateBodySchema }), asyncHandler(updateGalleryController))
galleryRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('gallery', 'delete')), validateRequest({ params: galleryIdParamSchema }), asyncHandler(deleteGalleryController))
galleryRouter.post('/albums', ...buildContentPermissionMiddlewares(permissionSlug('gallery', 'create')), validateRequest({ body: galleryAlbumCreateBodySchema }), asyncHandler(createGalleryAlbumController))
galleryRouter.put('/albums/:id', ...buildContentPermissionMiddlewares(permissionSlug('gallery', 'edit')), validateRequest({ params: galleryIdParamSchema, body: galleryAlbumUpdateBodySchema }), asyncHandler(updateGalleryAlbumController))
galleryRouter.delete('/albums/:id', ...buildContentPermissionMiddlewares(permissionSlug('gallery', 'delete')), validateRequest({ params: galleryIdParamSchema }), asyncHandler(deleteGalleryAlbumController))
galleryRouter.patch(
  '/move-images',
  ...buildContentPermissionMiddlewares(permissionSlug('gallery', 'edit')),
  validateRequest({
    body: z.object({
      imageIds: z.array(z.coerce.number().int().positive()).min(1).max(200),
      albumId: z.coerce.number().int().positive().optional().nullable(),
    }),
  }),
  asyncHandler(moveGalleryImagesController),
)

export { galleryRouter }
