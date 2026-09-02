export type NavigationMenuItem = {
  id: string
  label: string
  path: string
  enabled: boolean
  order: number
  parentId?: string
}

export type SettingsLink = {
  label: string
  path: string
}

export type AboutSettings = {
  hero: { eyebrow: string; title: string; description: string; imageUrl: string; imageLabel: string; promiseLabel: string; promiseText: string }
  story: { eyebrow: string; title: string; paragraphs: string[]; imageUrl: string; imageTitle: string; imageDescription: string }
  mission: { eyebrow: string; title: string; description: string }
  values: Array<{ title: string; description: string; displayOrder?: number; active?: boolean }>
  why: { eyebrow: string; title: string; imageUrl: string; imageTitle: string; imageDescription: string; points: Array<{ title: string; description: string; displayOrder?: number; active?: boolean }> }
  safety: { eyebrow: string; title: string; commitments: string[] }
  timeline: { eyebrow: string; title: string; entries: Array<{ year: string; title: string; description: string; displayOrder?: number }> }
  statistics: { eyebrow: string; title: string; items: Array<{ value: string; label: string; detail: string; displayOrder?: number }> }
  community: { eyebrow: string; title: string; paragraphs: string[]; imageUrl: string; imageTitle: string; imageDescription: string }
}

export type ExperiencePageSettings = {
  hero: { eyebrow: string; title: string; description: string; imageUrl: string; imageLabel: string; whatToExpectLabel: string; whatToExpectText: string }
  learning: { eyebrow: string; title: string; description: string; items: Array<{ title: string; description: string; displayOrder?: number }> }
  support: { eyebrow: string; title: string; description: string; items: Array<{ title: string; description: string; imageUrl: string; displayOrder?: number }> }
  equipment: { eyebrow: string; title: string; description: string; imageUrl: string; items: Array<{ title: string; description: string; note: string; displayOrder?: number }> }
}

export type LessonPageSettings = { hero: { eyebrow: string; title: string; description: string; primaryCtaLabel: string; primaryCtaPath: string; secondaryCtaLabel: string; secondaryCtaPath: string; imageUrl: string; visualLabel: string; visualDescription: string } }
export type EventPageSettings = {
  hero: { eyebrow: string; title: string; description: string; primaryCtaLabel: string; primaryCtaPath: string; secondaryCtaLabel: string; secondaryCtaPath: string; imageUrl: string; visualLabel: string; visualCardLabel: string; visualCardDescription: string }
  heroStats: Array<{ value: string; label: string; displayOrder?: number }>
  featured: { badge: string; imageLabel: string; imageDescription: string }
  pastMemories: { eyebrow: string; title: string; description: string; items: Array<{ title: string; description: string; imageUrl: string; fallbackImage?: string; eventName?: string; dateText?: string; displayOrder?: number; active?: boolean }> }
}
export type GalleryPageSettings = { hero: { eyebrow: string; title: string; description: string; primaryCtaLabel: string; primaryCtaPath: string; secondaryCtaLabel: string; secondaryCtaPath: string; imageUrl: string; visualLabel: string; visualCardLabel: string; visualCardDescription: string } }

export type WebsiteSettings = {
  security: { recaptchaEnabled: boolean; recaptchaSiteKey: string; recaptchaSecretKey?: string; hasRecaptchaSecretKey?: boolean }
  email: { enabled: boolean; smtpHost: string; smtpPort: number; smtpSecurity: 'none' | 'starttls' | 'ssl'; smtpUsername: string; smtpPassword?: string; hasSmtpPassword?: boolean; fromName: string; fromEmail: string; adminNotificationEmail: string; replyToEmail: string }
  about: AboutSettings
  experiencePage: ExperiencePageSettings
  lessonPage: LessonPageSettings
  eventPage: EventPageSettings
  galleryPage: GalleryPageSettings
  general: {
    websiteName: string
    tagline?: string
    logoUrl?: string
    faviconUrl?: string
    primaryEmail: string
    primaryPhone: string
    businessWhatsapp: string
    timezone: string
    defaultLanguage: string
  }
  homepage: {
    heroTitle: string
    heroSubtitle: string
    heroCtaButton1Label: string
    heroCtaButton1Path: string
    heroCtaButton2Label: string
    heroCtaButton2Path: string
    heroBackgroundImageUrl: string
    heroDroneShotImageUrl: string
    announcementBanner: string
    homepageFeaturedSectionToggle: boolean
  }
  contact: {
    hero: { eyebrow: string; title: string; description: string; primaryCtaLabel: string; primaryCtaPath: string; secondaryCtaLabel: string; secondaryCtaPath: string; imageUrl: string; supportLabel: string; supportText: string }
    businessAddress: string
    nearestLandmark: string
    parking: string
    travelTips: string
    googleMapsUrl?: string
    supportEmail: string
    supportPhone: string
    businessHours: string[]
    emergencyContact: string
  }
  socialMedia: {
    instagram?: string
    facebook?: string
    youtube?: string
    linkedIn?: string
    whatsapp?: string
  }
  navigation: {
    menuItems: NavigationMenuItem[]
  }
  footer: {
    footerDescription: string
    copyrightText: string
    quickLinks: SettingsLink[]
    legalLinks: SettingsLink[]
  }
  seo: {
    defaultMetaTitle: string
    defaultMetaDescription: string
    openGraphImage: string
    twitterImage: string
    robotsTxtPlaceholder: string
    googleVerificationCodePlaceholder?: string
  }
  businessInformation: {
    businessName: string
    registrationNumber?: string
    gstNumber?: string
    foundedYear?: number
  }
}
