import { type Request, type Response } from 'express'

import { createBaseContentController } from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { eventService } from '../services/event.service'
import { type EventListQuery } from '../types/event'
import { sendSuccess } from '../utils/api-response'

const baseEventController = createBaseContentController({
  resourceName: 'Event',
  service: eventService,
  parseListQuery: (req) => req.query as unknown as EventListQuery,
  parseCreateBody: (req) => req.body,
  parseUpdateBody: (req) => req.body,
})

export const listEventsController = baseEventController.list

export const getEventByIdController = baseEventController.getById

export async function getEventBySlugController(req: Request, res: Response) {
  const slug = typeof req.params.slug === 'string' ? req.params.slug : String((req.params.slug as string[] | undefined)?.[0] || '')
  const result = await eventService.getPublicBySlug(slug)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Event fetched successfully',
    data: result,
  })
}

export const createEventController = baseEventController.create

export const updateEventController = baseEventController.update

export const deleteEventController = baseEventController.remove

export async function duplicateEventController(req: Request, res: Response) {
  const result = await eventService.duplicate(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Event duplicated successfully',
    data: result,
  })
}

export async function patchEventStatusController(req: Request, res: Response) {
  await eventService.patchStatus(req.body.ids, {
    publishStatus: req.body.publishStatus,
    eventStatus: req.body.eventStatus,
  }, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Event status updated successfully',
    data: null,
  })
}

export async function patchEventFeaturedController(req: Request, res: Response) {
  await eventService.patchFeatured(req.body.ids, req.body.isFeatured, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Event featured flag updated successfully',
    data: null,
  })
}
