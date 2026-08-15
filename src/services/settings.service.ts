import { DEFAULT_WEBSITE_SETTINGS } from '../constants/settings'
import { type WebsiteSettings } from '../types/settings'
import { API_BASE_URL, safeFetch } from './http'

function mergeSettings(raw: unknown): WebsiteSettings {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_WEBSITE_SETTINGS
  }

  const partial = raw as Partial<WebsiteSettings>

  return {
    ...DEFAULT_WEBSITE_SETTINGS,
    ...partial,
    general: { ...DEFAULT_WEBSITE_SETTINGS.general, ...(partial.general ?? {}) },
    homepage: { ...DEFAULT_WEBSITE_SETTINGS.homepage, ...(partial.homepage ?? {}) },
    contact: { ...DEFAULT_WEBSITE_SETTINGS.contact, ...(partial.contact ?? {}) },
    socialMedia: { ...DEFAULT_WEBSITE_SETTINGS.socialMedia, ...(partial.socialMedia ?? {}) },
    navigation: { ...DEFAULT_WEBSITE_SETTINGS.navigation, ...(partial.navigation ?? {}) },
    footer: { ...DEFAULT_WEBSITE_SETTINGS.footer, ...(partial.footer ?? {}) },
    seo: { ...DEFAULT_WEBSITE_SETTINGS.seo, ...(partial.seo ?? {}) },
    businessInformation: {
      ...DEFAULT_WEBSITE_SETTINGS.businessInformation,
      ...(partial.businessInformation ?? {}),
    },
  }
}

export const settingsService = {
  async getWebsiteSettings(): Promise<WebsiteSettings> {
    try {
      const response = await safeFetch(`${API_BASE_URL}/settings`, undefined, 'Unable to load website settings.')
      if (!response.ok) {
        return DEFAULT_WEBSITE_SETTINGS
      }

      const json = (await response.json()) as { success?: boolean; data?: unknown }
      if (!json?.success) {
        return DEFAULT_WEBSITE_SETTINGS
      }

      return mergeSettings(json.data)
    } catch {
      return DEFAULT_WEBSITE_SETTINGS
    }
  },
}
