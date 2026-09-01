import { type WebsiteSettings } from '../types/settings'
import { aboutMission, aboutValues, aboutStoryParagraphs, aboutTimeline, aboutStatistics, aboutCommunityParagraphs, aboutImagePlaceholders, whyMangalorePoints } from '../data/about'
import { learningSteps, supportPoints, equipmentItems } from '../data/experiences'

const eventHeroStatsFallback = [{ value: 'Weekly', label: 'Community sessions', displayOrder: 1 }, { value: 'Open', label: 'For beginners and beyond', displayOrder: 2 }, { value: 'Local', label: 'Surf lifestyle energy', displayOrder: 3 }]
const pastEventMomentsFallback = [
  { title: 'Sunrise lineup', description: 'A captured moment from the event archive, ready to be replaced with real photography.', imageUrl: '', fallbackImage: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/surfing.svg')]", displayOrder: 1, active: true },
  { title: 'Crew celebration', description: 'A captured moment from the event archive, ready to be replaced with real photography.', imageUrl: '', fallbackImage: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/community.svg')]", displayOrder: 2, active: true },
  { title: 'Coastal flow', description: 'A captured moment from the event archive, ready to be replaced with real photography.', imageUrl: '', fallbackImage: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/beach.svg')]", displayOrder: 3, active: true },
]

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  lessonPage: {
    hero: { eyebrow: 'Surf lessons · Mangalore', title: 'Start your surfing journey.', description: 'Learn in calm, welcoming conditions with expert guidance, thoughtful coaching, and the kind of ocean energy that turns a first lesson into a lasting memory.', primaryCtaLabel: 'Reserve A Lesson', primaryCtaPath: '/booking', secondaryCtaLabel: 'View The Coast', secondaryCtaPath: '/gallery', imageUrl: '', visualLabel: 'Why beginners love this', visualDescription: 'Gentle progression, clear instruction, and a premium studio-to-sea experience.' },
  },
  eventPage: {
    hero: { eyebrow: 'Surf events · community · competition', title: 'Join the rhythm of the coast.', description: 'Our events are designed to feel like more than a calendar entry. They are a social surf experience where adventure, celebration, and coastal community come together in one place.', primaryCtaLabel: 'Join an event', primaryCtaPath: '/contact', secondaryCtaLabel: 'Explore experiences', secondaryCtaPath: '/experiences', imageUrl: '', visualLabel: 'Community wave energy', visualCardLabel: 'What events feel like', visualCardDescription: 'A premium coastal gathering with guided surf, cheering from the shoreline, and the kind of atmosphere people want to post about and return to.' },
    heroStats: eventHeroStatsFallback,
    featured: { badge: 'Featured event', imageLabel: 'Featured experience', imageDescription: 'A community-focused surf event with an unmistakable premium feel and a strong sense of occasion.' },
    pastMemories: { eyebrow: 'Past event memories', title: 'A social proof gallery that shows the atmosphere people return for.', description: 'This section is structured so real event photography can slot in later without changing the layout or content model.', items: pastEventMomentsFallback },
  },
  galleryPage: { hero: { eyebrow: 'Visual storytelling', title: 'See the coast and feel the pull to be there.', description: 'Ocean light, shared energy, and moments that make the surfing lifestyle feel tangible. This gallery is designed to sell the feeling before it sells the session.', primaryCtaLabel: 'Explore experiences', primaryCtaPath: '/experiences', secondaryCtaLabel: 'Book a surf day', secondaryCtaPath: '/contact', imageUrl: '', visualLabel: 'Ocean lifestyle', visualCardLabel: 'What the gallery promises', visualCardDescription: 'A premium visual journey that shows surf sessions, people, training, events, and the atmosphere that surrounds the brand.' } },
  about: {
    hero: { eyebrow: 'About Surf Mangalore', title: 'Surfers at heart, sharing the ocean with care.', description: 'We built Surf Mangalore from real mornings in the water, real friendships on the beach, and a simple belief that surfing should feel welcoming, safe, and unforgettable.', imageUrl: '', imageLabel: 'Ocean lifestyle', promiseLabel: 'Our promise', promiseText: 'Thoughtful coaching, honest hospitality, and a community that makes every guest feel part of the coast.' },
    story: { eyebrow: 'Our story', title: 'Built by people who love mornings in the water.', paragraphs: [...aboutStoryParagraphs], imageUrl: '', imageTitle: aboutImagePlaceholders[0].title, imageDescription: aboutImagePlaceholders[0].description },
    mission: { eyebrow: 'Our mission', title: aboutMission.title, description: aboutMission.description },
    values: aboutValues.map((item, index) => ({ ...item, displayOrder: index + 1, active: true })),
    why: { eyebrow: 'Why surf in Mangalore', title: 'A coastline that feels both adventurous and beginner-friendly.', imageUrl: '', imageTitle: aboutImagePlaceholders[2].title, imageDescription: aboutImagePlaceholders[2].description, points: whyMangalorePoints.map((item, index) => ({ ...item, displayOrder: index + 1, active: true })) },
    safety: { eyebrow: 'Safety commitment', title: 'Every surf experience starts with trust and preparedness.', commitments: ['Coach-led session planning based on ocean conditions', 'Clear pre-water safety briefings for every group', 'Progression pace adapted to each guest comfort level', 'Ongoing in-water supervision and support'] },
    timeline: { eyebrow: 'Timeline', title: 'Milestones from our first session to our future vision.', entries: aboutTimeline.map((item, index) => ({ ...item, displayOrder: index + 1 })) },
    statistics: { eyebrow: 'By the numbers', title: 'Proof of trust built over years on the coast.', items: aboutStatistics.map((item, index) => ({ value: item.value, label: item.label, detail: item.detail, displayOrder: index + 1 })) },
    community: { eyebrow: 'Community', title: 'More than a surf school. A coastal circle of people.', paragraphs: [...aboutCommunityParagraphs], imageUrl: '', imageTitle: aboutImagePlaceholders[4].title, imageDescription: aboutImagePlaceholders[4].description },
  },
  experiencePage: {
    hero: { eyebrow: 'Surf experiences · Mangalore', title: 'Find the surf experience that fits you.', description: 'Whether you are stepping into the ocean for the first time or looking to refine your technique, Surf Mangalore shapes each session around confidence, safety, and the kind of energy that keeps you coming back.', imageUrl: '', imageLabel: 'Ocean-ready guidance', whatToExpectLabel: 'What to expect', whatToExpectText: 'Clear instruction, the right board, a paced introduction, and a team that keeps the experience calm and memorable.' },
    learning: { eyebrow: 'What you will learn', title: 'A clear learning path that builds comfort before intensity.', description: 'The journey is intentionally sequenced so new surfers can settle in, understand the environment, and move into the water with a real sense of control.', items: learningSteps.map((item, index) => ({ ...item, displayOrder: index + 1 })) },
    support: { eyebrow: 'Safety and support', title: 'Confidence begins with clear instruction and a calm, prepared team.', description: 'The experience is structured to feel reassuring from the moment you arrive. Guests should never have to guess what happens next.', items: supportPoints.map((item, index) => ({ ...item, imageUrl: '', displayOrder: index + 1 })) },
    equipment: { eyebrow: 'Included equipment', title: 'The right gear, prepared before you even step into the water.', description: 'Every session includes the essentials needed to keep the experience smooth, comfortable, and focused on learning rather than logistics.', imageUrl: '', items: equipmentItems.map((item, index) => ({ ...item, displayOrder: index + 1 })) },
  },
  general: {
    websiteName: 'Surf Mangalore',
    tagline: 'Premium surf coaching and ocean-first experiences',
    logoUrl: '',
    faviconUrl: '',
    primaryEmail: 'hello@surfmangalore.com',
    primaryPhone: '+91 98765 43210',
    businessWhatsapp: '+91 98765 43210',
    timezone: 'Asia/Kolkata',
    defaultLanguage: 'en',
  },
  homepage: {
    heroTitle: 'Ride the pulse of the coast.',
    heroSubtitle: 'Step into a world of polished surf mornings, expert coaching, and unforgettable ocean energy designed for guests who want more than a lesson.',
    heroCtaButton1Label: 'Book Your Surf Session',
    heroCtaButton1Path: '/booking',
    heroCtaButton2Label: 'Explore The Experience',
    heroCtaButton2Path: '/gallery',
    heroBackgroundImageUrl: '/images/placeholders/sunset.svg',
    heroDroneShotImageUrl: '/images/placeholders/drone.svg',
    announcementBanner: 'Award-winning surf school · Mangalore',
    homepageFeaturedSectionToggle: true,
  },
  contact: {
    businessAddress: 'Malpe, Karnataka',
    googleMapsUrl: '',
    supportEmail: 'hello@surfmangalore.com',
    supportPhone: '+91 98765 43210',
    businessHours: [
      'Monday: 6:30 AM - 6:30 PM',
      'Tuesday: 6:30 AM - 6:30 PM',
      'Wednesday: 6:30 AM - 6:30 PM',
      'Thursday: 6:30 AM - 6:30 PM',
      'Friday: 6:30 AM - 7:00 PM',
      'Saturday: 6:00 AM - 7:00 PM',
      'Sunday: 6:00 AM - 7:00 PM',
    ],
    emergencyContact: '+91 98765 43210',
  },
  socialMedia: {
    instagram: '',
    facebook: '',
    youtube: '',
    linkedIn: '',
    whatsapp: '',
  },
  navigation: {
    menuItems: [
      { id: 'home', label: 'Home', path: '/', enabled: true, order: 1 },
      { id: 'about', label: 'About', path: '/about', enabled: true, order: 2 },
      { id: 'experiences', label: 'Experiences', path: '/experiences', enabled: true, order: 3 },
      { id: 'lessons', label: 'Lessons', path: '/lessons', enabled: true, order: 4 },
      { id: 'events', label: 'Events', path: '/events', enabled: true, order: 5 },
      { id: 'gallery', label: 'Gallery', path: '/gallery', enabled: true, order: 6 },
      { id: 'contact', label: 'Contact', path: '/contact', enabled: true, order: 7 },
    ],
  },
  footer: {
    footerDescription: 'Premium surf instruction, thoughtful adventure planning, and ocean-first experiences shaped around freedom and flow.',
    copyrightText: '© 2026 Surf Mangalore.',
    quickLinks: [
      { label: 'About', path: '/about' },
      { label: 'Experiences', path: '/experiences' },
      { label: 'Booking', path: '/booking' },
      { label: 'Lessons', path: '/lessons' },
      { label: 'Events', path: '/events' },
      { label: 'Gallery', path: '/gallery' },
    ],
    legalLinks: [
      { label: 'Privacy', path: '/contact' },
      { label: 'Terms', path: '/contact' },
    ],
  },
  seo: {
    defaultMetaTitle: 'Surf Mangalore',
    defaultMetaDescription: 'Premium surf school and coastal surf experiences in Mangalore.',
    openGraphImage: '/images/placeholders/ocean.svg',
    twitterImage: '/images/placeholders/ocean.svg',
    robotsTxtPlaceholder: 'index, follow, max-image-preview:large',
    googleVerificationCodePlaceholder: '',
  },
  businessInformation: {
    businessName: 'Surf Mangalore',
    registrationNumber: '',
    gstNumber: '',
    foundedYear: 2018,
  },
}
