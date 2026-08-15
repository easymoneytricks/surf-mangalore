import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createEventController,
  deleteEventController,
  duplicateEventController,
  getEventByIdController,
  getEventBySlugController,
  listEventsController,
  patchEventFeaturedController,
  patchEventStatusController,
  updateEventController,
} from '../../controllers/event.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  eventCreateBodySchema,
  eventFeaturedPatchSchema,
  eventIdParamSchema,
  eventListQuerySchema,
  eventSlugParamSchema,
  eventStatusPatchSchema,
  eventUpdateBodySchema,
} from '../../validators/event.validator'

const eventsRouter = Router()

eventsRouter.get('/', validateRequest({ query: eventListQuerySchema }), asyncHandler(listEventsController))
eventsRouter.get('/slug/:slug', validateRequest({ params: eventSlugParamSchema }), asyncHandler(getEventBySlugController))
eventsRouter.get('/:id', validateRequest({ params: eventIdParamSchema }), asyncHandler(getEventByIdController))
eventsRouter.post('/', ...buildContentPermissionMiddlewares(permissionSlug('events', 'create')), validateRequest({ body: eventCreateBodySchema }), asyncHandler(createEventController))
eventsRouter.put('/:id', ...buildContentPermissionMiddlewares(permissionSlug('events', 'edit')), validateRequest({ params: eventIdParamSchema, body: eventUpdateBodySchema }), asyncHandler(updateEventController))
eventsRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('events', 'delete')), validateRequest({ params: eventIdParamSchema }), asyncHandler(deleteEventController))
eventsRouter.post('/:id/duplicate', ...buildContentPermissionMiddlewares(permissionSlug('events', 'create')), validateRequest({ params: eventIdParamSchema }), asyncHandler(duplicateEventController))
eventsRouter.patch('/status', ...buildContentPermissionMiddlewares(permissionSlug('events', 'publish')), validateRequest({ body: eventStatusPatchSchema }), asyncHandler(patchEventStatusController))
eventsRouter.patch('/featured', ...buildContentPermissionMiddlewares(permissionSlug('events', 'edit')), validateRequest({ body: eventFeaturedPatchSchema }), asyncHandler(patchEventFeaturedController))

export { eventsRouter }
