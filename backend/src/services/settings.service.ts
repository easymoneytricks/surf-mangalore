import { DEFAULT_WEBSITE_SETTINGS, WEBSITE_SETTINGS_KEY } from '../constants/settings'
import { settingsRepository } from '../repositories/settings.repository'
import { type WebsiteSettings } from '../types/settings'

function mergeSettings(raw: unknown): WebsiteSettings {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_WEBSITE_SETTINGS
  }

  const next = raw as Partial<WebsiteSettings>

  return {
    ...DEFAULT_WEBSITE_SETTINGS,
    ...next,
    about: { ...DEFAULT_WEBSITE_SETTINGS.about, ...(next.about ?? {}) },
    experiencePage: { ...DEFAULT_WEBSITE_SETTINGS.experiencePage, ...(next.experiencePage ?? {}) },
    lessonPage: { ...DEFAULT_WEBSITE_SETTINGS.lessonPage, ...(next.lessonPage ?? {}) },
    eventPage: { ...DEFAULT_WEBSITE_SETTINGS.eventPage, ...(next.eventPage ?? {}) },
    galleryPage: { ...DEFAULT_WEBSITE_SETTINGS.galleryPage, ...(next.galleryPage ?? {}) },
    general: { ...DEFAULT_WEBSITE_SETTINGS.general, ...(next.general ?? {}) },
    homepage: { ...DEFAULT_WEBSITE_SETTINGS.homepage, ...(next.homepage ?? {}) },
    contact: { ...DEFAULT_WEBSITE_SETTINGS.contact, ...(next.contact ?? {}), hero: { ...DEFAULT_WEBSITE_SETTINGS.contact.hero, ...(next.contact?.hero ?? {}) } },
    socialMedia: { ...DEFAULT_WEBSITE_SETTINGS.socialMedia, ...(next.socialMedia ?? {}) },
    navigation: { ...DEFAULT_WEBSITE_SETTINGS.navigation, ...(next.navigation ?? {}) },
    footer: { ...DEFAULT_WEBSITE_SETTINGS.footer, ...(next.footer ?? {}) },
    seo: { ...DEFAULT_WEBSITE_SETTINGS.seo, ...(next.seo ?? {}) },
    businessInformation: {
      ...DEFAULT_WEBSITE_SETTINGS.businessInformation,
      ...(next.businessInformation ?? {}),
    },
  }
}

export const settingsService = {
  async getWebsiteSettings() {
    const record = await settingsRepository.findByKey(WEBSITE_SETTINGS_KEY)
    return mergeSettings(record?.valueJson)
  },

  async updateWebsiteSettings(payload: WebsiteSettings, userId?: number) {
    const settings = mergeSettings(payload)

    await settingsRepository.upsertWebsiteSettings({
      settingKey: WEBSITE_SETTINGS_KEY,
      payload: settings,
      userId,
    })

    return settings
  },
}
