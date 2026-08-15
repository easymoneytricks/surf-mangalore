import { getAdminApiBaseUrl } from '../config/runtime'

export const API_BASE_URL = getAdminApiBaseUrl()

let accessToken: string | null = null

export class ApiRequestError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.statusCode = statusCode
  }
}

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function clearAccessToken() {
  accessToken = null
}

export function getAuthHeaders() {
  if (!accessToken) {
    return {}
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const isFormData = init?.body instanceof FormData
  if (!isFormData) {
    headers.set('Content-Type', 'application/json')
  }

  for (const [key, value] of Object.entries(getAuthHeaders())) {
    headers.set(key, value)
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    })
  } catch {
    throw new ApiRequestError('Unable to connect to the server. Please try again.', 0)
  }

  let json: (Partial<ApiEnvelope<T>> & { errors?: unknown }) | null = null

  try {
    json = (await response.json()) as Partial<ApiEnvelope<T>> & { errors?: unknown }
  } catch {
    json = null
  }

  if (!response.ok || !json?.success) {
    const message = response.status === 401
      ? 'Your session has expired. Please sign in again.'
      : response.status === 403
        ? 'You do not have permission to perform this action.'
        : response.status >= 500
          ? 'Something went wrong while processing your request.'
          : (json?.message || 'Unable to complete the request. Please try again.')
    throw new ApiRequestError(message, response.status)
  }

  return json.data as T
}
