import { apiRequest } from './http'
import { DEFAULT_WEBSITE_SETTINGS } from '../constants/settings'
import { type WebsiteSettings } from '../types/settings'
import { readStorage, writeStorage } from '../utils/storage'

const SETTINGS_STORAGE_KEY = 'admin_website_settings_v1'

export const settingsService = {
  async get() {
    try {
      const remote = await apiRequest<WebsiteSettings>('/settings/admin')
      writeStorage(SETTINGS_STORAGE_KEY, remote)
      return remote
    } catch {
      const local = readStorage<WebsiteSettings | null>(SETTINGS_STORAGE_KEY, null)
      if (local) {
        return local
      }

      return DEFAULT_WEBSITE_SETTINGS
    }
  },

  async update(payload: WebsiteSettings) {
    const remote = await apiRequest<WebsiteSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })

    writeStorage(SETTINGS_STORAGE_KEY, remote)
    return remote
  },
  async sendTestEmail(to: string) {
    return apiRequest<{ sent: boolean }>('/settings/admin/test-email', { method: 'POST', body: JSON.stringify({ to }) })
  },
}
