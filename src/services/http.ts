const DEFAULT_API_BASE_URL = '/api/v1'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function requireConfiguredValue(key: string) {
  if (!import.meta.env.DEV) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export function getPublicApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL

  if (!configured || !configured.trim()) {
    if (!import.meta.env.DEV) {
      requireConfiguredValue('VITE_API_BASE_URL')
    }

    return DEFAULT_API_BASE_URL
  }

  return trimTrailingSlash(configured.trim())
}

export const API_BASE_URL = getPublicApiBaseUrl()

export async function safeFetch(input: string, init: RequestInit | undefined, fallbackMessage: string) {
  try {
    const response = await fetch(input, init)
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.toLowerCase().includes('application/json')) {
      return new Response(JSON.stringify({ success: false, message: response.status === 429 ? 'Too many requests. Please try again shortly.' : fallbackMessage }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    try {
      await response.clone().json()
    } catch {
      return new Response(JSON.stringify({ success: false, message: fallbackMessage }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return response
  } catch {
    throw new Error(fallbackMessage)
  }
}
