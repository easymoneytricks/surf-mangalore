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
    return await fetch(input, init)
  } catch {
    throw new Error(fallbackMessage)
  }
}
