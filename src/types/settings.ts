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

export type WebsiteSettings = {
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
    businessAddress: string
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
