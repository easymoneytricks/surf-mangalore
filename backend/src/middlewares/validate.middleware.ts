import { type NextFunction, type Request, type Response } from 'express'
import { ZodError, type ZodTypeAny } from 'zod'

import { HTTP_STATUS } from '../constants/http'
import { ApiError } from '../utils/api-error'

type ValidationTargets = {
  body?: ZodTypeAny
  query?: ZodTypeAny
  params?: ZodTypeAny
}

export function validateRequest(targets: ValidationTargets) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (targets.body) {
        req.body = targets.body.parse(req.body)
      }
      if (targets.query) {
        const parsedQuery = targets.query.parse(req.query) as Record<string, unknown>
        const queryRef = req.query as Record<string, unknown>

        for (const key of Object.keys(queryRef)) {
          delete queryRef[key]
        }

        Object.assign(queryRef, parsedQuery)
      }
      if (targets.params) {
        req.params = targets.params.parse(req.params) as Request['params']
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', error.flatten()))
      }

      return next(error)
    }
  }
}
