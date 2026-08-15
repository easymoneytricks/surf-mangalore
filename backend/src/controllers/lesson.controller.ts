import { type Request, type Response } from 'express'

import { createBaseContentController } from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { lessonService } from '../services/lesson.service'
import { type LessonListQuery } from '../types/lesson'
import { sendSuccess } from '../utils/api-response'

const baseLessonController = createBaseContentController({
  resourceName: 'Lesson',
  service: lessonService,
  parseListQuery: (req) => req.query as unknown as LessonListQuery,
  parseCreateBody: (req) => req.body,
  parseUpdateBody: (req) => req.body,
})

export const listLessonsController = baseLessonController.list
export const getLessonByIdController = baseLessonController.getById
export const createLessonController = baseLessonController.create
export const updateLessonController = baseLessonController.update
export const deleteLessonController = baseLessonController.remove

export async function getLessonBySlugController(req: Request, res: Response) {
  const slug = typeof req.params.slug === 'string' ? req.params.slug : String((req.params.slug as string[] | undefined)?.[0] || '')
  const result = await lessonService.getPublicBySlug(slug)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Lesson fetched successfully',
    data: result,
  })
}

export async function patchLessonStatusController(req: Request, res: Response) {
  await lessonService.patchStatus(req.body.ids, req.body.publishStatus, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Lesson status updated successfully',
    data: null,
  })
}

export async function patchLessonFeaturedController(req: Request, res: Response) {
  await lessonService.patchFeatured(req.body.ids, req.body.isFeatured, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Lesson featured flag updated successfully',
    data: null,
  })
}
