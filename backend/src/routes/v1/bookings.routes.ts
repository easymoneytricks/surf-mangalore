import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createBookingController,
  getBookingByIdController,
  listBookingsController,
  listBookableOptionsController,
  patchBookingController,
  patchBookingStatusController,
} from '../../controllers/booking.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  bookingCreateBodySchema,
  bookingIdParamSchema,
  bookingListQuerySchema,
  bookingStatusPatchBodySchema,
  bookingUpdateBodySchema,
} from '../../validators/booking.validator'

const bookingsRouter = Router()

bookingsRouter.get('/options', asyncHandler(listBookableOptionsController))
bookingsRouter.post('/', validateRequest({ body: bookingCreateBodySchema }), asyncHandler(createBookingController))

bookingsRouter.get('/', ...buildContentPermissionMiddlewares(permissionSlug('bookings', 'view')), validateRequest({ query: bookingListQuerySchema }), asyncHandler(listBookingsController))
bookingsRouter.get('/:id', ...buildContentPermissionMiddlewares(permissionSlug('bookings', 'view')), validateRequest({ params: bookingIdParamSchema }), asyncHandler(getBookingByIdController))
bookingsRouter.patch('/:id/status', ...buildContentPermissionMiddlewares(permissionSlug('bookings', 'edit')), validateRequest({ params: bookingIdParamSchema, body: bookingStatusPatchBodySchema }), asyncHandler(patchBookingStatusController))
bookingsRouter.patch('/:id', ...buildContentPermissionMiddlewares(permissionSlug('bookings', 'edit')), validateRequest({ params: bookingIdParamSchema, body: bookingUpdateBodySchema }), asyncHandler(patchBookingController))

export { bookingsRouter }
