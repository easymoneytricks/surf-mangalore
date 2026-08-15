import { type NextFunction, type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { logger } from '../config/logger'
import { ApiError } from '../utils/api-error'
import { sendError } from '../utils/api-response'

function toErrorCode(statusCode: number) {
  if (statusCode === HTTP_STATUS.BAD_REQUEST) {
    return 'VALIDATION_ERROR' as const
  }

  if (statusCode === HTTP_STATUS.UNAUTHORIZED) {
    return 'AUTHENTICATION_ERROR' as const
  }

  if (statusCode === HTTP_STATUS.FORBIDDEN) {
    return 'AUTHORIZATION_ERROR' as const
  }

  if (statusCode === HTTP_STATUS.NOT_FOUND) {
    return 'NOT_FOUND' as const
  }

  if (statusCode === HTTP_STATUS.CONFLICT) {
    return 'CONFLICT' as const
  }

  if (statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return 'SERVER_ERROR' as const
  }

  return 'BAD_REQUEST' as const
}

export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const apiError = err instanceof ApiError
    ? err
    : new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Internal server error')

  logger.error(
    {
      path: req.originalUrl,
      method: req.method,
      statusCode: apiError.statusCode,
      details: apiError.details,
      stack: err instanceof Error ? err.stack : undefined,
    },
    apiError.message,
  )

  return sendError(res, {
    statusCode: apiError.statusCode,
    message: apiError.message,
    errorCode: toErrorCode(apiError.statusCode),
    errors: apiError.details,
  })
}
