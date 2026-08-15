import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { bookingService } from '../services/booking.service'
import { type BookingListQuery } from '../types/booking'
import { sendPaginated, sendSuccess } from '../utils/api-response'

export async function listBookingsController(req: Request, res: Response) {
  const query = req.query as unknown as BookingListQuery
  const result = await bookingService.list(query)

  return sendPaginated(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Bookings fetched successfully',
    items: result.items,
    pagination: result.pagination,
  })
}

export async function getBookingByIdController(req: Request, res: Response) {
  const result = await bookingService.getById(Number(req.params.id))

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Booking fetched successfully',
    data: result,
  })
}

export async function createBookingController(req: Request, res: Response) {
  const result = await bookingService.create(req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Booking created successfully',
    data: result,
  })
}

export async function patchBookingStatusController(req: Request, res: Response) {
  const result = await bookingService.patchStatus(Number(req.params.id), req.body, req.authUser!.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Booking status updated successfully',
    data: result,
  })
}

export async function patchBookingController(req: Request, res: Response) {
  const result = await bookingService.patch(Number(req.params.id), req.body, req.authUser!.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Booking updated successfully',
    data: result,
  })
}

export async function listBookableOptionsController(_req: Request, res: Response) {
  const result = await bookingService.listBookableOptions()

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Bookable options fetched successfully',
    data: result,
  })
}
