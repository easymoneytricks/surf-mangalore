import { z } from 'zod'

const optionalHttpUrl = z.union([
  z.string().url().refine((value) => {
    try {
      const parsed = new URL(value)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }, 'URL must start with http:// or https://'),
  z.literal(''),
]).optional()

const navigationItemSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(80),
  path: z.string().trim().min(1).max(220),
  enabled: z.boolean(),
  order: z.coerce.number().int().min(0).max(1000),
  parentId: z.string().trim().max(80).optional(),
})

const linkSchema = z.object({
  label: z.string().trim().min(1).max(80),
  path: z.string().trim().min(1).max(220),
})

export const websiteSettingsBodySchema = z.object({
  about: z.record(z.string(), z.unknown()).optional(),
  experiencePage: z.record(z.string(), z.unknown()).optional(),
  lessonPage: z.record(z.string(), z.unknown()).optional(),
  eventPage: z.record(z.string(), z.unknown()).optional(),
  galleryPage: z.record(z.string(), z.unknown()).optional(),
  general: z.object({
    websiteName: z.string().trim().min(1).max(120),
    tagline: z.string().trim().max(240).optional(),
    logoUrl: optionalHttpUrl,
    faviconUrl: optionalHttpUrl,
    primaryEmail: z.string().trim().email().max(180),
    primaryPhone: z.string().trim().max(40),
    businessWhatsapp: z.string().trim().max(40),
    timezone: z.string().trim().min(1).max(80),
    defaultLanguage: z.string().trim().min(2).max(12),
  }),
  homepage: z.object({
    heroTitle: z.string().trim().min(1).max(220),
    heroSubtitle: z.string().trim().max(1000),
    heroCtaButton1Label: z.string().trim().min(1).max(80),
    heroCtaButton1Path: z.string().trim().min(1).max(220),
    heroCtaButton2Label: z.string().trim().min(1).max(80),
    heroCtaButton2Path: z.string().trim().min(1).max(220),
    heroBackgroundImageUrl: z.string().trim().min(1).max(260),
    heroDroneShotImageUrl: z.string().trim().min(1).max(260),
    announcementBanner: z.string().trim().max(200),
    homepageFeaturedSectionToggle: z.boolean(),
  }),
  contact: z.object({
    businessAddress: z.string().trim().min(1).max(260),
    googleMapsUrl: optionalHttpUrl,
    supportEmail: z.string().trim().email().max(180),
    supportPhone: z.string().trim().max(40),
    businessHours: z.array(z.string().trim().min(1).max(80)).max(14),
    emergencyContact: z.string().trim().max(40),
  }),
  socialMedia: z.object({
    instagram: optionalHttpUrl,
    facebook: optionalHttpUrl,
    youtube: optionalHttpUrl,
    linkedIn: optionalHttpUrl,
    whatsapp: optionalHttpUrl,
  }),
  navigation: z.object({
    menuItems: z.array(navigationItemSchema).max(40),
  }),
  footer: z.object({
    footerDescription: z.string().trim().max(500),
    copyrightText: z.string().trim().max(160),
    quickLinks: z.array(linkSchema).max(30),
    legalLinks: z.array(linkSchema).max(30),
  }),
  seo: z.object({
    defaultMetaTitle: z.string().trim().min(1).max(160),
    defaultMetaDescription: z.string().trim().max(320),
    openGraphImage: z.string().trim().min(1).max(260),
    twitterImage: z.string().trim().min(1).max(260),
    robotsTxtPlaceholder: z.string().trim().max(200),
    googleVerificationCodePlaceholder: z.string().trim().max(280).optional(),
  }),
  businessInformation: z.object({
    businessName: z.string().trim().min(1).max(120),
    registrationNumber: z.string().trim().max(80).optional(),
    gstNumber: z.string().trim().max(80).optional(),
    foundedYear: z.coerce.number().int().min(1800).max(3000).optional(),
  }),
})
