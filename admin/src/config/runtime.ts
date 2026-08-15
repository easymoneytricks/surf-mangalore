const DEFAULT_API_BASE_URL = '/api/v1'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function requireConfiguredValue(key: string) {
  if (!import.meta.env.DEV) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export function getAdminApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL

  if (!configured || !configured.trim()) {
    if (!import.meta.env.DEV) {
      requireConfiguredValue('VITE_API_BASE_URL')
    }

    return DEFAULT_API_BASE_URL
  }

  return trimTrailingSlash(configured.trim())
}

export function getPublicSiteBaseUrl() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_BASE_URL

  if (!configured || !configured.trim()) {
    if (!import.meta.env.DEV) {
      requireConfiguredValue('VITE_PUBLIC_SITE_BASE_URL')
    }

    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.hostname}:5173`
    }

    return '/'
  }

  return trimTrailingSlash(configured.trim())
}
