import { useEffect, useMemo, useState } from 'react'

import { settingsService } from '../../services/settings.service'
import { DEFAULT_WEBSITE_SETTINGS } from '../../constants/settings'
import { type AboutSettings, type EventPageSettings, type ExperiencePageSettings, type GalleryPageSettings, type LessonPageSettings, type WebsiteSettings } from '../../types/settings'
import { AboutSettingsForm, defaultAbout, defaultEventPage, defaultExperiencePage, defaultGalleryPage, defaultLessonPage, EventPageSettingsForm, ExperiencePageSettingsForm, GalleryPageSettingsForm, LessonPageSettingsForm } from './PageSettingsForm'

type SettingsTab =
  | 'general'
  | 'branding'
  | 'homepage'
  | 'contact'
  | 'social'
  | 'navigation'
  | 'footer'
  | 'seo'
  | 'business'
  | 'about'
  | 'experiencePage'
  | 'lessonPage'
  | 'eventPage'
  | 'galleryPage'

const tabConfig: Array<{ key: SettingsTab; label: string }> = [
  { key: 'general', label: 'General' },
  { key: 'branding', label: 'Branding' },
  { key: 'contact', label: 'Contact' },
  { key: 'social', label: 'Social' },
  { key: 'homepage', label: 'Homepage' },
  { key: 'footer', label: 'Footer' },
  { key: 'seo', label: 'SEO' },
  { key: 'business', label: 'Business' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'about', label: 'About' },
  { key: 'experiencePage', label: 'Experience Page' },
  { key: 'lessonPage', label: 'Lesson Page' },
  { key: 'eventPage', label: 'Event Page' },
  { key: 'galleryPage', label: 'Gallery Page' },
]

export default function WebsiteSettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('general')
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await settingsService.get()
        const safeData = data && typeof data === 'object' ? data : DEFAULT_WEBSITE_SETTINGS
        setSettings({ ...DEFAULT_WEBSITE_SETTINGS, ...safeData, about: normalizeAbout(safeData.about), experiencePage: normalizeExperiencePage(safeData.experiencePage), lessonPage: normalizeLessonPage(safeData.lessonPage), eventPage: normalizeEventPage(safeData.eventPage), galleryPage: normalizeGalleryPage(safeData.galleryPage) })
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : 'Failed to load settings'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const businessHoursText = useMemo(() => settings?.contact.businessHours.join('\n') ?? '', [settings])
  const navigationText = useMemo(
    () =>
      settings?.navigation.menuItems
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((item) => `${item.order}|${item.label}|${item.path}|${item.enabled ? 'true' : 'false'}|${item.id}`)
        .join('\n') ?? '',
    [settings],
  )
  const quickLinksText = useMemo(
    () => settings?.footer.quickLinks.map((item) => `${item.label}|${item.path}`).join('\n') ?? '',
    [settings],
  )
  const legalLinksText = useMemo(
    () => settings?.footer.legalLinks.map((item) => `${item.label}|${item.path}`).join('\n') ?? '',
    [settings],
  )

  if (loading) {
    return <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-300">Loading website settings...</div>
  }

  if (!settings) {
    return <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6 text-sm text-red-200">{error || 'Unable to load website settings.'}</div>
  }

  const update = <K extends keyof WebsiteSettings>(section: K, value: WebsiteSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [section]: value } : prev))
  }

  const save = async () => {
    const invalidExternalFields = [
      ['Logo URL', settings.general.logoUrl],
      ['Favicon URL', settings.general.faviconUrl],
      ['Google Maps URL', settings.contact.googleMapsUrl],
      ['Instagram URL', settings.socialMedia.instagram],
      ['Facebook URL', settings.socialMedia.facebook],
      ['YouTube URL', settings.socialMedia.youtube],
      ['LinkedIn URL', settings.socialMedia.linkedIn],
      ['WhatsApp URL', settings.socialMedia.whatsapp],
      ['About hero image URL', settings.about.hero.imageUrl],
      ['About story image URL', settings.about.story.imageUrl],
      ['About why image URL', settings.about.why.imageUrl],
      ['About community image URL', settings.about.community.imageUrl],
      ['Experience hero image URL', settings.experiencePage.hero.imageUrl],
      ['Experience equipment image URL', settings.experiencePage.equipment.imageUrl],
      ...settings.experiencePage.support.items.map((item, index) => [`Experience support image URL ${index + 1}`, item.imageUrl] as [string, string]),
    ].filter(([, value]) => !isValidExternalUrl(value) && !isValidImageUrl(value))

    if (invalidExternalFields.length) {
      setSuccess(null)
      setError(`Please provide valid http:// or https:// URLs: ${invalidExternalFields.map(([field]) => field).join(', ')}`)
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const saved = await settingsService.update(settings)
      const safeSaved = saved && typeof saved === 'object' ? saved : settings
      setSettings({ ...DEFAULT_WEBSITE_SETTINGS, ...safeSaved, about: normalizeAbout(safeSaved.about), experiencePage: normalizeExperiencePage(safeSaved.experiencePage), lessonPage: normalizeLessonPage(safeSaved.lessonPage), eventPage: normalizeEventPage(safeSaved.eventPage), galleryPage: normalizeGalleryPage(safeSaved.galleryPage) })
      setSuccess('Website settings saved successfully.')
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Failed to save settings'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h1 className="text-2xl font-semibold text-white">Website Settings</h1>
        <p className="mt-2 text-sm text-neutral-400">Manage global website content and metadata shown across the public site.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabConfig.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`rounded-full px-4 py-2 text-sm transition ${tab === item.key ? 'bg-cyan-500 text-black' : 'border border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500 hover:text-white'}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:grid-cols-2">
          <Field label="Primary Email" value={settings.general.primaryEmail} onChange={(value) => update('general', { ...settings.general, primaryEmail: value })} />
          <Field label="Primary Phone" value={settings.general.primaryPhone} onChange={(value) => update('general', { ...settings.general, primaryPhone: value })} />
          <Field label="Business Whatsapp" value={settings.general.businessWhatsapp} onChange={(value) => update('general', { ...settings.general, businessWhatsapp: value })} />
          <Field label="Timezone" value={settings.general.timezone} onChange={(value) => update('general', { ...settings.general, timezone: value })} />
          <Field label="Default Language" value={settings.general.defaultLanguage} onChange={(value) => update('general', { ...settings.general, defaultLanguage: value })} />
        </section>
      )}

      {tab === 'branding' && (
        <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:grid-cols-2">
          <Field label="Website Name" value={settings.general.websiteName} onChange={(value) => update('general', { ...settings.general, websiteName: value })} />
          <Field label="Tagline" value={settings.general.tagline || ''} onChange={(value) => update('general', { ...settings.general, tagline: value })} />
          <Field label="Logo URL" value={settings.general.logoUrl || ''} onChange={(value) => update('general', { ...settings.general, logoUrl: value })} />
          <Field label="Favicon URL" value={settings.general.faviconUrl || ''} onChange={(value) => update('general', { ...settings.general, faviconUrl: value })} />
        </section>
      )}

      {tab === 'homepage' && (
        <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:grid-cols-2">
          <Field label="Hero Title" value={settings.homepage.heroTitle} onChange={(value) => update('homepage', { ...settings.homepage, heroTitle: value })} />
          <Field label="Announcement Banner" value={settings.homepage.announcementBanner} onChange={(value) => update('homepage', { ...settings.homepage, announcementBanner: value })} />
          <Field label="Hero CTA 1 Label" value={settings.homepage.heroCtaButton1Label} onChange={(value) => update('homepage', { ...settings.homepage, heroCtaButton1Label: value })} />
          <Field label="Hero CTA 1 Path" value={settings.homepage.heroCtaButton1Path} onChange={(value) => update('homepage', { ...settings.homepage, heroCtaButton1Path: value })} />
          <Field label="Hero CTA 2 Label" value={settings.homepage.heroCtaButton2Label} onChange={(value) => update('homepage', { ...settings.homepage, heroCtaButton2Label: value })} />
          <Field label="Hero CTA 2 Path" value={settings.homepage.heroCtaButton2Path} onChange={(value) => update('homepage', { ...settings.homepage, heroCtaButton2Path: value })} />
          <Field label="Hero Background Image URL" value={settings.homepage.heroBackgroundImageUrl} onChange={(value) => update('homepage', { ...settings.homepage, heroBackgroundImageUrl: value })} />
          <Field label="Hero Drone Shot Image URL" value={settings.homepage.heroDroneShotImageUrl} onChange={(value) => update('homepage', { ...settings.homepage, heroDroneShotImageUrl: value })} />
          <label className="flex items-center gap-3 rounded-xl border border-neutral-800 px-3 py-3 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={settings.homepage.homepageFeaturedSectionToggle}
              onChange={(event) => update('homepage', { ...settings.homepage, homepageFeaturedSectionToggle: event.target.checked })}
            />
            Enable featured section
          </label>
          <label className="md:col-span-2 text-sm text-neutral-300">
            Hero Subtitle
            <textarea
              className="mt-2 min-h-27.5 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              value={settings.homepage.heroSubtitle}
              onChange={(event) => update('homepage', { ...settings.homepage, heroSubtitle: event.target.value })}
            />
          </label>
        </section>
      )}

      {tab === 'about' && <AboutSettingsForm value={settings.about} onChange={(value) => update('about', value)} />}
      {tab === 'experiencePage' && <ExperiencePageSettingsForm value={settings.experiencePage} onChange={(value) => update('experiencePage', value)} />}
      {tab === 'lessonPage' && <LessonPageSettingsForm value={settings.lessonPage} onChange={(value) => update('lessonPage', value)} />}
      {tab === 'eventPage' && <EventPageSettingsForm value={settings.eventPage} onChange={(value) => update('eventPage', value)} />}
      {tab === 'galleryPage' && <GalleryPageSettingsForm value={settings.galleryPage} onChange={(value) => update('galleryPage', value)} />}

      {tab === 'contact' && (
        <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:grid-cols-2">
          <Field label="Business Address" value={settings.contact.businessAddress} onChange={(value) => update('contact', { ...settings.contact, businessAddress: value })} />
          <Field label="Google Maps URL" value={settings.contact.googleMapsUrl || ''} onChange={(value) => update('contact', { ...settings.contact, googleMapsUrl: value })} />
          <Field label="Support Email" value={settings.contact.supportEmail} onChange={(value) => update('contact', { ...settings.contact, supportEmail: value })} />
          <Field label="Support Phone" value={settings.contact.supportPhone} onChange={(value) => update('contact', { ...settings.contact, supportPhone: value })} />
          <Field label="Emergency Contact" value={settings.contact.emergencyContact} onChange={(value) => update('contact', { ...settings.contact, emergencyContact: value })} />
          <label className="md:col-span-2 text-sm text-neutral-300">
            Business Hours (one per line)
            <textarea
              className="mt-2 min-h-32.5 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              value={businessHoursText}
              onChange={(event) =>
                update('contact', {
                  ...settings.contact,
                  businessHours: event.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                })
              }
            />
          </label>
        </section>
      )}

      {tab === 'social' && (
        <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:grid-cols-2">
          <Field label="Instagram URL" value={settings.socialMedia.instagram || ''} onChange={(value) => update('socialMedia', { ...settings.socialMedia, instagram: value })} />
          <Field label="Facebook URL" value={settings.socialMedia.facebook || ''} onChange={(value) => update('socialMedia', { ...settings.socialMedia, facebook: value })} />
          <Field label="YouTube URL" value={settings.socialMedia.youtube || ''} onChange={(value) => update('socialMedia', { ...settings.socialMedia, youtube: value })} />
          <Field label="LinkedIn URL" value={settings.socialMedia.linkedIn || ''} onChange={(value) => update('socialMedia', { ...settings.socialMedia, linkedIn: value })} />
          <Field label="Whatsapp URL" value={settings.socialMedia.whatsapp || ''} onChange={(value) => update('socialMedia', { ...settings.socialMedia, whatsapp: value })} />
        </section>
      )}

      {tab === 'navigation' && (
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <label className="text-sm text-neutral-300">
            Menu Items (order|label|path|enabled|id)
            <textarea
              className="mt-2 min-h-55 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              value={navigationText}
              onChange={(event) => {
                const menuItems = event.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, index) => {
                    const [orderRaw, label = '', path = '', enabledRaw = 'true', idRaw = ''] = line.split('|')
                    const parsedOrder = Number(orderRaw)
                    return {
                      id: idRaw.trim() || `nav-${index + 1}`,
                      label: label.trim(),
                      path: path.trim(),
                      enabled: enabledRaw.trim().toLowerCase() !== 'false',
                      order: Number.isNaN(parsedOrder) ? index + 1 : parsedOrder,
                    }
                  })
                  .filter((item) => item.label && item.path)

                update('navigation', { ...settings.navigation, menuItems })
              }}
            />
          </label>
        </section>
      )}

      {tab === 'footer' && (
        <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:grid-cols-2">
          <label className="md:col-span-2 text-sm text-neutral-300">
            Footer Description
            <textarea
              className="mt-2 min-h-25 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              value={settings.footer.footerDescription}
              onChange={(event) => update('footer', { ...settings.footer, footerDescription: event.target.value })}
            />
          </label>
          <Field label="Copyright Text" value={settings.footer.copyrightText} onChange={(value) => update('footer', { ...settings.footer, copyrightText: value })} />
          <label className="text-sm text-neutral-300">
            Quick Links (label|path)
            <textarea
              className="mt-2 min-h-40 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              value={quickLinksText}
              onChange={(event) => {
                const quickLinks = event.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [label = '', path = ''] = line.split('|')
                    return { label: label.trim(), path: path.trim() }
                  })
                  .filter((item) => item.label && item.path)
                update('footer', { ...settings.footer, quickLinks })
              }}
            />
          </label>
          <label className="text-sm text-neutral-300">
            Legal Links (label|path)
            <textarea
              className="mt-2 min-h-40 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              value={legalLinksText}
              onChange={(event) => {
                const legalLinks = event.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [label = '', path = ''] = line.split('|')
                    return { label: label.trim(), path: path.trim() }
                  })
                  .filter((item) => item.label && item.path)
                update('footer', { ...settings.footer, legalLinks })
              }}
            />
          </label>
        </section>
      )}

      {tab === 'seo' && (
        <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:grid-cols-2">
          <Field label="Default Meta Title" value={settings.seo.defaultMetaTitle} onChange={(value) => update('seo', { ...settings.seo, defaultMetaTitle: value })} />
          <Field label="Open Graph Image" value={settings.seo.openGraphImage} onChange={(value) => update('seo', { ...settings.seo, openGraphImage: value })} />
          <Field label="Twitter Image" value={settings.seo.twitterImage} onChange={(value) => update('seo', { ...settings.seo, twitterImage: value })} />
          <Field label="Robots Placeholder" value={settings.seo.robotsTxtPlaceholder} onChange={(value) => update('seo', { ...settings.seo, robotsTxtPlaceholder: value })} />
          <Field label="Google Verification Code" value={settings.seo.googleVerificationCodePlaceholder || ''} onChange={(value) => update('seo', { ...settings.seo, googleVerificationCodePlaceholder: value })} />
          <label className="md:col-span-2 text-sm text-neutral-300">
            Default Meta Description
            <textarea
              className="mt-2 min-h-25 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
              value={settings.seo.defaultMetaDescription}
              onChange={(event) => update('seo', { ...settings.seo, defaultMetaDescription: event.target.value })}
            />
          </label>
        </section>
      )}

      {tab === 'business' && (
        <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:grid-cols-2">
          <Field label="Business Name" value={settings.businessInformation.businessName} onChange={(value) => update('businessInformation', { ...settings.businessInformation, businessName: value })} />
          <Field label="Registration Number" value={settings.businessInformation.registrationNumber || ''} onChange={(value) => update('businessInformation', { ...settings.businessInformation, registrationNumber: value })} />
          <Field label="GST Number" value={settings.businessInformation.gstNumber || ''} onChange={(value) => update('businessInformation', { ...settings.businessInformation, gstNumber: value })} />
          <Field
            label="Founded Year"
            value={settings.businessInformation.foundedYear ? String(settings.businessInformation.foundedYear) : ''}
            onChange={(value) =>
              update('businessInformation', {
                ...settings.businessInformation,
                foundedYear: value ? Number(value) : undefined,
              })
            }
          />
        </section>
      )}

      {error && <div className="rounded-xl border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-200">{success}</div>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Website Settings'}
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="text-sm text-neutral-300">
      {label}
      <input
        className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function isValidExternalUrl(value?: string) {
  if (!value || !value.trim()) {
    return true
  }

  try {
    const parsed = new URL(value.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function isValidImageUrl(value?: string) {
  if (!value || !value.trim()) return true
  return value.trim().startsWith('/') || value.trim().startsWith('data:image/')
}

function normalizeAbout(value: Partial<AboutSettings> | null | undefined): AboutSettings {
  const raw = value || {}
  return { ...defaultAbout, ...raw, hero: { ...defaultAbout.hero, ...(raw.hero || {}) }, story: { ...defaultAbout.story, ...(raw.story || {}) }, mission: { ...defaultAbout.mission, ...(raw.mission || {}) }, values: Array.isArray(raw.values) ? raw.values : defaultAbout.values, why: { ...defaultAbout.why, ...(raw.why || {}), points: Array.isArray(raw.why?.points) ? raw.why.points : defaultAbout.why.points }, safety: { ...defaultAbout.safety, ...(raw.safety || {}) }, timeline: { ...defaultAbout.timeline, ...(raw.timeline || {}), entries: Array.isArray(raw.timeline?.entries) ? raw.timeline.entries : defaultAbout.timeline.entries }, statistics: { ...defaultAbout.statistics, ...(raw.statistics || {}), items: Array.isArray(raw.statistics?.items) ? raw.statistics.items : defaultAbout.statistics.items }, community: { ...defaultAbout.community, ...(raw.community || {}) } }
}

function normalizeExperiencePage(value: Partial<ExperiencePageSettings> | null | undefined): ExperiencePageSettings {
  const raw = value || {}
  return { ...defaultExperiencePage, ...raw, hero: { ...defaultExperiencePage.hero, ...(raw.hero || {}) }, learning: { ...defaultExperiencePage.learning, ...(raw.learning || {}), items: Array.isArray(raw.learning?.items) ? raw.learning.items : defaultExperiencePage.learning.items }, support: { ...defaultExperiencePage.support, ...(raw.support || {}), items: Array.isArray(raw.support?.items) ? raw.support.items : defaultExperiencePage.support.items }, equipment: { ...defaultExperiencePage.equipment, ...(raw.equipment || {}), items: Array.isArray(raw.equipment?.items) ? raw.equipment.items : defaultExperiencePage.equipment.items } }
}

function normalizeLessonPage(value: Partial<LessonPageSettings> | null | undefined): LessonPageSettings { const raw = value || {}; return { ...defaultLessonPage, ...raw, hero: { ...defaultLessonPage.hero, ...(raw.hero || {}) } } }
function normalizeEventPage(value: Partial<EventPageSettings> | null | undefined): EventPageSettings { const raw = value || {}; return { ...defaultEventPage, ...raw, hero: { ...defaultEventPage.hero, ...(raw.hero || {}) }, heroStats: Array.isArray(raw.heroStats) ? raw.heroStats : defaultEventPage.heroStats, featured: { ...defaultEventPage.featured, ...(raw.featured || {}) }, pastMemories: { ...defaultEventPage.pastMemories, ...(raw.pastMemories || {}), items: Array.isArray(raw.pastMemories?.items) ? raw.pastMemories.items : defaultEventPage.pastMemories.items } } }
function normalizeGalleryPage(value: Partial<GalleryPageSettings> | null | undefined): GalleryPageSettings { const raw = value || {}; return { ...defaultGalleryPage, ...raw, hero: { ...defaultGalleryPage.hero, ...(raw.hero || {}) } } }
