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
    about: {
      ...DEFAULT_WEBSITE_SETTINGS.about, ...(partial.about ?? {}),
      hero: { ...DEFAULT_WEBSITE_SETTINGS.about.hero, ...(partial.about?.hero ?? {}) },
      story: { ...DEFAULT_WEBSITE_SETTINGS.about.story, ...(partial.about?.story ?? {}) },
      mission: { ...DEFAULT_WEBSITE_SETTINGS.about.mission, ...(partial.about?.mission ?? {}) },
      values: partial.about?.values ?? DEFAULT_WEBSITE_SETTINGS.about.values,
      why: { ...DEFAULT_WEBSITE_SETTINGS.about.why, ...(partial.about?.why ?? {}), points: partial.about?.why?.points ?? DEFAULT_WEBSITE_SETTINGS.about.why.points },
      safety: { ...DEFAULT_WEBSITE_SETTINGS.about.safety, ...(partial.about?.safety ?? {}) },
      timeline: { ...DEFAULT_WEBSITE_SETTINGS.about.timeline, ...(partial.about?.timeline ?? {}), entries: partial.about?.timeline?.entries ?? DEFAULT_WEBSITE_SETTINGS.about.timeline.entries },
      statistics: { ...DEFAULT_WEBSITE_SETTINGS.about.statistics, ...(partial.about?.statistics ?? {}), items: partial.about?.statistics?.items ?? DEFAULT_WEBSITE_SETTINGS.about.statistics.items },
      community: { ...DEFAULT_WEBSITE_SETTINGS.about.community, ...(partial.about?.community ?? {}) },
    },
    experiencePage: {
      ...DEFAULT_WEBSITE_SETTINGS.experiencePage, ...(partial.experiencePage ?? {}),
      hero: { ...DEFAULT_WEBSITE_SETTINGS.experiencePage.hero, ...(partial.experiencePage?.hero ?? {}) },
      learning: { ...DEFAULT_WEBSITE_SETTINGS.experiencePage.learning, ...(partial.experiencePage?.learning ?? {}), items: partial.experiencePage?.learning?.items ?? DEFAULT_WEBSITE_SETTINGS.experiencePage.learning.items },
      support: { ...DEFAULT_WEBSITE_SETTINGS.experiencePage.support, ...(partial.experiencePage?.support ?? {}), items: partial.experiencePage?.support?.items ?? DEFAULT_WEBSITE_SETTINGS.experiencePage.support.items },
      equipment: { ...DEFAULT_WEBSITE_SETTINGS.experiencePage.equipment, ...(partial.experiencePage?.equipment ?? {}), items: partial.experiencePage?.equipment?.items ?? DEFAULT_WEBSITE_SETTINGS.experiencePage.equipment.items },
    },
    lessonPage: { ...DEFAULT_WEBSITE_SETTINGS.lessonPage, ...(partial.lessonPage ?? {}), hero: { ...DEFAULT_WEBSITE_SETTINGS.lessonPage.hero, ...(partial.lessonPage?.hero ?? {}) } },
    eventPage: {
      ...DEFAULT_WEBSITE_SETTINGS.eventPage, ...(partial.eventPage ?? {}),
      hero: { ...DEFAULT_WEBSITE_SETTINGS.eventPage.hero, ...(partial.eventPage?.hero ?? {}) },
      heroStats: partial.eventPage?.heroStats ?? DEFAULT_WEBSITE_SETTINGS.eventPage.heroStats,
      featured: { ...DEFAULT_WEBSITE_SETTINGS.eventPage.featured, ...(partial.eventPage?.featured ?? {}) },
      pastMemories: { ...DEFAULT_WEBSITE_SETTINGS.eventPage.pastMemories, ...(partial.eventPage?.pastMemories ?? {}), items: partial.eventPage?.pastMemories?.items ?? DEFAULT_WEBSITE_SETTINGS.eventPage.pastMemories.items },
    },
    galleryPage: { ...DEFAULT_WEBSITE_SETTINGS.galleryPage, ...(partial.galleryPage ?? {}), hero: { ...DEFAULT_WEBSITE_SETTINGS.galleryPage.hero, ...(partial.galleryPage?.hero ?? {}) } },
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
