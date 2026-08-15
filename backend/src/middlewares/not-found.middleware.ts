import { type NextFunction, type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { ApiError } from '../utils/api-error'

export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.originalUrl}`))
}
