import { type Response } from 'express'

type SuccessResponsePayload<T> = {
  statusCode: number
  message: string
  data: T
}

type PaginatedMeta = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

type PaginatedResponsePayload<T> = {
  statusCode: number
  message: string
  items: T[]
  pagination: PaginatedMeta
}

type ErrorResponsePayload = {
  statusCode: number
  message: string
  errorCode: 'VALIDATION_ERROR' | 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'SERVER_ERROR' | 'BAD_REQUEST'
  errors?: unknown
}

export function sendSuccess<T>(res: Response, payload: SuccessResponsePayload<T>) {
  return res.status(payload.statusCode).json({
    success: true,
    message: payload.message,
    data: payload.data,
  })
}

export function sendPaginated<T>(res: Response, payload: PaginatedResponsePayload<T>) {
  return res.status(payload.statusCode).json({
    success: true,
    message: payload.message,
    data: {
      items: payload.items,
      pagination: payload.pagination,
    },
  })
}

export function sendError(res: Response, payload: ErrorResponsePayload) {
  return res.status(payload.statusCode).json({
    success: false,
    message: payload.message,
    error: {
      code: payload.errorCode,
      details: payload.errors,
    },
  })
}

