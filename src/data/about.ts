export type AboutValue = {
  title: string
  description: string
}

export type AboutTimelineEntry = {
  year: string
  title: string
  description: string
}

export type AboutStatistic = {
  value: string
  label: string
  detail: string
}

export type AboutImagePlaceholder = {
  id: string
  title: string
  description: string
  imageClass: string
}

export const aboutStoryParagraphs = [
  'Surf Mangalore started with a small group of friends who spent sunrise after sunrise on the coast, learning how the ocean changes mood, pace, and power every single day.',
  'What began as local surf meetups slowly became a place where travelers, families, and first-time surfers felt genuinely welcomed. People did not just come for a lesson. They came for confidence, connection, and that first unforgettable ride.',
  'Today, we run Surf Mangalore with the same spirit we began with: respect for the sea, care for every guest, and a deep love for sharing the ocean lifestyle in a professional and warm way.',
] as const

export const aboutMission = {
  title: 'Our mission is to make surfing feel accessible, safe, and deeply memorable.',
  description:
    'We exist to help more people experience the ocean with confidence. Every session is designed to blend expert coaching, thoughtful hospitality, and real surf culture so guests leave feeling proud of what they achieved.',
}

export const aboutValues: AboutValue[] = [
  {
    title: 'Safety first',
    description: 'Clear guidance, prepared coaches, and ocean-aware decisions shape every session before anything else.',
  },
  {
    title: 'Community',
    description: 'We build a welcoming atmosphere where first-timers, families, and returning surfers feel they belong.',
  },
  {
    title: 'Adventure',
    description: 'We keep the energy alive with experiences that feel exciting without ever feeling reckless.',
  },
  {
    title: 'Respect nature',
    description: 'Our teaching style is built around reading the ocean, protecting the shoreline, and honoring local waters.',
  },
  {
    title: 'Professional coaching',
    description: 'Guests trust us because our team teaches with structure, patience, and real local surf knowledge.',
  },
]

export const whyMangalorePoints = [
  {
    title: 'A unique coastal setting',
    description: 'Mangalore offers a blend of scenic shoreline, relaxed energy, and easy access for travelers.',
  },
  {
    title: 'Beginner-friendly wave windows',
    description: 'At the right times, the coast provides conditions that are ideal for confidence-building starts.',
  },
  {
    title: 'Warm weather and surf lifestyle',
    description: 'The climate and pace of life make sessions feel vibrant, social, and easy to plan around.',
  },
  {
    title: 'Less crowded, more personal',
    description: 'Guests get a more intimate coaching experience compared with packed tourist surf zones.',
  },
] as const

export const aboutTimeline: AboutTimelineEntry[] = [
  {
    year: '2018',
    title: 'Surf Mangalore began',
    description: 'Started with a small local coaching circle focused on safe beginner surf sessions.',
  },
  {
    year: '2020',
    title: '1,000 guests trained',
    description: 'Expanded to structured programs for families, travelers, and weekend surf communities.',
  },
  {
    year: '2023',
    title: 'Events and lifestyle sessions launched',
    description: 'Introduced community events, sunrise gatherings, and premium surf experiences.',
  },
  {
    year: '2026',
    title: 'Future vision in motion',
    description: 'Building a broader ocean community with sustainability, coaching excellence, and culture-first events.',
  },
]

export const aboutStatistics: AboutStatistic[] = [
  {
    value: '5000+',
    label: 'Happy guests',
    detail: 'Guests who experienced coaching, events, and ocean sessions with us.',
  },
  {
    value: '8+',
    label: 'Years experience',
    detail: 'Years of local surf guidance and beginner-first session design.',
  },
  {
    value: '100%',
    label: 'Safety focus',
    detail: 'Every session is planned with conditions, support, and clear instruction in mind.',
  },
  {
    value: '4.9★',
    label: 'Guest rating',
    detail: 'Consistent feedback on warmth, professionalism, and confidence-building coaching.',
  },
]

export const aboutCommunityParagraphs = [
  'Surf Mangalore is not just a class schedule. It is a growing coastal community built on friendship, encouragement, and shared mornings by the water.',
  'From beach cleanups to ocean-awareness sessions, we believe surf culture should care for the same coastline that gives us so much.',
  'Guests often return not only for better surfing, but for the people they met, the confidence they built, and the joy of being part of something meaningful.',
] as const

export const aboutImagePlaceholders: AboutImagePlaceholder[] = [
  {
    id: 'founders',
    title: 'Founders and early days',
    description: 'Reserved for authentic founder portraits and origin-story visuals.',
    imageClass:
      "bg-[linear-gradient(135deg,rgba(122,214,209,0.14),rgba(255,143,74,0.16)),url('/images/placeholders/sunset.svg')]",
  },
  {
    id: 'coaches',
    title: 'Coach portraits',
    description: 'Reserved for professional portraits of the coaching team.',
    imageClass:
      "bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.12)),url('/images/placeholders/instructor.svg')]",
  },
  {
    id: 'beach',
    title: 'Mangalore coastline',
    description: 'Reserved for wide-angle beach and wave environment photography.',
    imageClass:
      "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/beach.svg')]",
  },
  {
    id: 'students',
    title: 'Students in session',
    description: 'Reserved for in-water progression photos and first-wave moments.',
    imageClass:
      "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.16)),url('/images/placeholders/students.svg')]",
  },
  {
    id: 'community',
    title: 'Community culture',
    description: 'Reserved for beach cleanups, social sessions, and ocean-awareness moments.',
    imageClass:
      "bg-[linear-gradient(135deg,rgba(122,214,209,0.14),rgba(255,143,74,0.2)),url('/images/placeholders/community.svg')]",
  },
]
