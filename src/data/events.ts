export type EventStatus = 'upcoming' | 'past'

export type EventItem = {
  id: string
  title: string
  date: string
  location: string
  category: string
  description: string
  image: string
  participants: string
  status: EventStatus
  tag: string
  featured: boolean
  story: string
  cta: string
}

export type EventHighlight = {
  title: string
  description: string
  note: string
}

export type EventFAQ = {
  question: string
  answer: string
}

export const eventHeroStats = [
  { value: 'Weekly', label: 'Community sessions' },
  { value: 'Open', label: 'For beginners and beyond' },
  { value: 'Local', label: 'Surf lifestyle energy' },
] as const

export const eventHighlights: EventHighlight[] = [
  {
    title: 'Surf session',
    description: 'Every event starts with a coached surf experience that matches the pace of the group and the conditions of the day.',
    note: 'Ocean-first, guided from arrival to rinse-off',
  },
  {
    title: 'Community',
    description: 'Guests connect through shared timing, celebration, and the natural energy that comes from surfing together.',
    note: 'Designed to feel social, not transactional',
  },
  {
    title: 'Instructor support',
    description: 'A calm team shapes the session, keeps things safe, and makes sure guests feel supported at every step.',
    note: 'Clear guidance from local surf coaches',
  },
  {
    title: 'Memories',
    description: 'Events are built to feel memorable, with cinematic moments and a premium atmosphere that invites people back.',
    note: 'Photo-ready moments throughout the day',
  },
  {
    title: 'Networking',
    description: 'The event format naturally creates easy conversation and shared momentum between people who love the coast.',
    note: 'A light, welcoming way to meet others',
  },
]

export const pastEventMoments = [
  {
    title: 'Sunrise lineup',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/surfing.svg')]",
  },
  {
    title: 'Crew celebration',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/community.svg')]",
  },
  {
    title: 'Coastal flow',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/beach.svg')]",
  },
]

export const eventFaqs: EventFAQ[] = [
  {
    question: 'How do I join an event?',
    answer: 'Choose an event that matches your interest, then contact us to confirm the session and share any special requirements before the day arrives.',
  },
  {
    question: 'Who can participate?',
    answer: 'Events are open to individuals, friends, families, travelers, and teams. Each session indicates who it is best suited for.',
  },
  {
    question: 'Do beginners join?',
    answer: 'Yes. Several events are intentionally beginner-friendly and include coaching, safety support, and a welcoming pace.',
  },
  {
    question: 'What is included?',
    answer: 'Participation normally includes the guided surf experience, instructor support, and the equipment needed for the chosen session.',
  },
]

export const events: EventItem[] = [
  {
    id: 'sunrise-surf-club',
    title: 'Sunrise Surf Club',
    date: 'Every Friday • 6:30 AM',
    location: 'Malpe Beach, Karnataka',
    category: 'Community',
    description: 'A relaxed early-morning surf gathering with warm light, coaching, and a social atmosphere that starts the day with momentum.',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/surfing.svg')]",
    participants: '8 to 16 surfers',
    status: 'upcoming',
    tag: 'Community event',
    featured: true,
    story: 'Built for people who want an early ocean reset, a friendly crowd, and the kind of shared energy that makes a Friday feel special.',
    cta: 'Reserve a spot',
  },
  {
    id: 'weekend-coastal-escape',
    title: 'Weekend Coastal Escape',
    date: 'Saturdays • 8:00 AM',
    location: 'Surf Mangalore Base',
    category: 'Adventure',
    description: 'A guided morning that blends surf coaching, scenic coastal rhythm, and a premium lifestyle feel.',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/beach.svg')]",
    participants: '6 to 12 guests',
    status: 'upcoming',
    tag: 'Adventure day',
    featured: false,
    story: 'A great fit for guests who want a polished weekend plan that still feels active, scenic, and very alive.',
    cta: 'Join the session',
  },
  {
    id: 'coastal-competition-day',
    title: 'Coastal Competition Day',
    date: 'Monthly • Sunday Morning',
    location: 'Malpe Point',
    category: 'Competition',
    description: 'A friendly surf challenge that brings together progression, cheering, and the excitement of a shared goal.',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/events.svg')]",
    participants: '12 to 24 surfers',
    status: 'upcoming',
    tag: 'Competition',
    featured: false,
    story: 'Created for surfers who enjoy a little pressure, a lot of encouragement, and the buzz of a coastal crowd.',
    cta: 'Register now',
  },
  {
    id: 'family-surf-celebration',
    title: 'Family Surf Celebration',
    date: 'Selected Sundays • 4:30 PM',
    location: 'Surf School Beachfront',
    category: 'Celebration',
    description: 'A joyful sunset gathering for families and friends that balances surf time with celebration and shared memory-making.',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/sunset.svg')]",
    participants: 'Up to 14 guests',
    status: 'upcoming',
    tag: 'Celebration',
    featured: false,
    story: 'A softer, more festive event that feels warm, inclusive, and easy to share across generations.',
    cta: 'Bring the family',
  },
  {
    id: 'corporate-team-session',
    title: 'Corporate Team Session',
    date: 'Flexible booking',
    location: 'Private coastal setup',
    category: 'Groups',
    description: 'A memorable team outing that mixes coaching, confidence, and a fresh coastal environment for strong shared energy.',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/community.svg')]",
    participants: '8 to 20 guests',
    status: 'upcoming',
    tag: 'Groups',
    featured: false,
    story: 'The right choice for teams that want an offsite day with a bit of adrenaline and a lot of positive alignment.',
    cta: 'Plan a team event',
  },
  {
    id: 'members-sunset-session',
    title: 'Members Sunset Session',
    date: 'Past event',
    location: 'Malpe Beach',
    category: 'Community',
    description: 'An evening surf and social session that ended with shared stories, warm light, and a packed shoreline.',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/sunset.svg')]",
    participants: '20 guests',
    status: 'past',
    tag: 'Past event',
    featured: false,
    story: 'A reminder that the most memorable surf days are often the ones that end with laughter on the beach.',
    cta: 'See upcoming events',
  },
]

