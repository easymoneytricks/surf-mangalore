import { HTTP_STATUS } from '../constants/http'
import { ApiError } from './api-error'

export function invalidCredentialsError() {
  return new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials')
}

export function unauthorizedError(message = 'Unauthorized') {
  return new ApiError(HTTP_STATUS.UNAUTHORIZED, message)
}

export function forbiddenError(message = 'Forbidden') {
  return new ApiError(HTTP_STATUS.FORBIDDEN, message)
}

export function expiredTokenError() {
  return new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Expired token')
}

export function inactiveAccountError() {
  return new ApiError(HTTP_STATUS.FORBIDDEN, 'Inactive account')
}
