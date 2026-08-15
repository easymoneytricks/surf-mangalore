import { eventFaqs } from '../data/events'
import { experienceFaqs } from '../data/experiences'
import { faqs } from '../data/faqs'

export const SITE_NAME = 'Surf Mangalore'
const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim()
if (import.meta.env.PROD && !configuredSiteUrl) {
  throw new Error('VITE_SITE_URL must be configured for production SEO')
}

export const SITE_URL = configuredSiteUrl || 'https://surfmangalore.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/placeholders/ocean.svg`

export type BreadcrumbItem = {
  name: string
  path: string
}

export type SEOConfig = {
  title: string
  description: string
  canonicalPath: string
  keywords: string[]
  robots: string
  openGraphImage?: string
  openGraphImageAlt?: string
  schemas: Array<Record<string, unknown>>
}

type PageSEOSeed = {
  path: string
  title: string
  description: string
  keywords: string[]
  imagePath?: string
  includeWebsite?: boolean
  includeOrganization?: boolean
  includeLocalBusiness?: boolean
  includeSportsActivityLocation?: boolean
  breadcrumb?: BreadcrumbItem[]
  faqItems?: Array<{ question: string; answer: string }>
}

export const seoPageEntries: PageSEOSeed[] = [
  {
    path: '/',
    title: 'Premium Surf School in Mangalore | Surf Mangalore',
    description: 'Discover premium surf lessons, ocean-first experiences, and coastal adventure in Mangalore with expert coaching and a polished lifestyle brand feel.',
    keywords: ['surf school mangalore', 'surfing mangalore', 'premium surf lessons', 'beginner surfing india', 'coastal surf experiences'],
    imagePath: '/images/placeholders/sunset.svg',
    includeWebsite: true,
    includeOrganization: true,
    includeLocalBusiness: true,
    includeSportsActivityLocation: true,
    faqItems: faqs,
  },
  {
    path: '/about',
    title: 'About Surf Mangalore | Passionate Surfers Sharing the Ocean',
    description: 'Learn the story, values, coaches, and coastal culture behind Surf Mangalore, a premium surf brand built on safety, community, and ocean passion.',
    keywords: ['about surf mangalore', 'surf mangalore story', 'mangalore surf coaches', 'ocean community karnataka'],
    imagePath: '/images/placeholders/community.svg',
    includeOrganization: true,
    includeLocalBusiness: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
  },
  {
    path: '/experiences',
    title: 'Surf Experiences in Mangalore | Beginner to Private Coaching',
    description: 'Compare beginner surf experiences, private coaching, family sessions, and group surf formats in Mangalore with clear guidance and premium support.',
    keywords: ['surf experiences mangalore', 'private surf coaching', 'beginner surf experience', 'group surf sessions karnataka'],
    imagePath: '/images/placeholders/surfing.svg',
    includeOrganization: true,
    includeSportsActivityLocation: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Experiences', path: '/experiences' },
    ],
    faqItems: experienceFaqs,
  },
  {
    path: '/lessons',
    title: 'Surf Lessons in Mangalore | Beginner-Friendly Professional Coaching',
    description: 'Start your surfing journey in Mangalore with calm, beginner-friendly lessons, supportive instructors, and a premium studio-to-sea experience.',
    keywords: ['surf lessons mangalore', 'beginner surf lessons india', 'learn surfing karnataka', 'surf coaching malpe'],
    imagePath: '/images/placeholders/students.svg',
    includeOrganization: true,
    includeSportsActivityLocation: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Lessons', path: '/lessons' },
    ],
    faqItems: faqs,
  },
  {
    path: '/events',
    title: 'Surf Events in Mangalore | Community Sessions, Competitions and Gatherings',
    description: 'Explore surf events in Mangalore including sunrise sessions, competitions, celebrations, and community-led coastal experiences.',
    keywords: ['surf events mangalore', 'community surf events', 'surf competition karnataka', 'coastal gatherings india'],
    imagePath: '/images/placeholders/events.svg',
    includeOrganization: true,
    includeLocalBusiness: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Events', path: '/events' },
    ],
    faqItems: eventFaqs,
  },
  {
    path: '/gallery',
    title: 'Surf Gallery | Ocean Lifestyle, Surf Sessions and Coastal Moments',
    description: 'Browse the Surf Mangalore gallery featuring surf sessions, beach life, community energy, coaching moments, and premium coastal storytelling.',
    keywords: ['surf gallery mangalore', 'ocean lifestyle photography', 'surf session gallery', 'mangalore beach visuals'],
    imagePath: '/images/placeholders/ocean.svg',
    includeOrganization: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Gallery', path: '/gallery' },
    ],
  },
  {
    path: '/booking',
    title: 'Book Surf Sessions in Mangalore | Surf Mangalore Booking',
    description: 'Book your surf session in Mangalore through a simple, mobile-first booking flow for lessons, experiences, and group surf days.',
    keywords: ['book surf session mangalore', 'surf lesson booking', 'mangalore surf booking', 'private surf booking india'],
    imagePath: '/images/placeholders/surfboard.svg',
    includeOrganization: true,
    includeSportsActivityLocation: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Booking', path: '/booking' },
    ],
  },
  {
    path: '/contact',
    title: 'Contact Surf Mangalore | Bookings, Groups and Surf Planning',
    description: 'Contact Surf Mangalore for bookings, private coaching, group surf experiences, and planning help for your next ocean day.',
    keywords: ['contact surf mangalore', 'surf booking contact', 'mangalore surf phone', 'surf school email india'],
    imagePath: '/images/placeholders/community.svg',
    includeOrganization: true,
    includeLocalBusiness: true,
    breadcrumb: [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ],
  },
]

export function absoluteUrl(path: string) {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/favicon.svg'),
    sameAs: ['https://instagram.com', 'https://facebook.com', 'https://youtube.com', 'https://wa.me'],
  }
}

export function createWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en',
  }
}

export function createLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl('/images/placeholders/beach.svg'),
    telephone: '+91 98765 43210',
    email: 'hello@surfmangalore.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Malpe',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
  }
}

export function createSportsActivityLocationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: `${SITE_NAME} Surf Experiences`,
    url: SITE_URL,
    sport: 'Surfing',
    image: absoluteUrl('/images/placeholders/surfing.svg'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Malpe',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
  }
}

export function createFAQSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function getPageSEO(pathname: string): SEOConfig {
  const page = seoPageEntries.find((entry) => entry.path === pathname)

  if (!page) {
    return {
      title: `Page Not Found | ${SITE_NAME}`,
      description: 'The requested Surf Mangalore page could not be found.',
      canonicalPath: pathname,
      keywords: ['surfmangalore', 'page not found'],
      robots: 'noindex, nofollow',
      openGraphImage: DEFAULT_OG_IMAGE,
      openGraphImageAlt: 'Surf Mangalore ocean placeholder',
      schemas: [createOrganizationSchema()],
    }
  }

  const schemas: Array<Record<string, unknown>> = []
  if (page.includeWebsite) schemas.push(createWebsiteSchema())
  if (page.includeOrganization) schemas.push(createOrganizationSchema())
  if (page.includeLocalBusiness) schemas.push(createLocalBusinessSchema())
  if (page.includeSportsActivityLocation) schemas.push(createSportsActivityLocationSchema())
  if (page.breadcrumb) schemas.push(createBreadcrumbSchema(page.breadcrumb))
  if (page.faqItems) schemas.push(createFAQSchema(page.faqItems))

  return {
    title: page.title,
    description: page.description,
    canonicalPath: page.path,
    keywords: page.keywords,
    robots: 'index, follow, max-image-preview:large',
    openGraphImage: absoluteUrl(page.imagePath || '/images/placeholders/ocean.svg'),
    openGraphImageAlt: `${page.title} preview image`,
    schemas,
  }
}
