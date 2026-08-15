export type GalleryCategory =
  | 'Surf Sessions'
  | 'Events'
  | 'Beach Life'
  | 'Community'
  | 'Instructors'
  | 'Training'

export type GalleryItem = {
  id: string
  title: string
  category: GalleryCategory
  image: string
  description: string
  featured: boolean
  frame: 'portrait' | 'landscape' | 'standard'
}

export const galleryCategories: GalleryCategory[] = ['Surf Sessions', 'Events', 'Beach Life', 'Community', 'Instructors', 'Training']

export const galleryItems: GalleryItem[] = [
  {
    id: 'dawn-lineup',
    title: 'Dawn Lineup',
    category: 'Surf Sessions',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.22),rgba(255,143,74,0.14)),url('/images/placeholders/surfing.svg')]",
    description: 'A calm sunrise surf composition shaped for the early sessions that start the day with movement and focus.',
    featured: true,
    frame: 'portrait',
  },
  {
    id: 'community-cheer',
    title: 'Community Cheer',
    category: 'Community',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.18)),url('/images/placeholders/community.svg')]",
    description: 'A social frame for shoreline moments, shared smiles, and the energy that forms around a good surf day.',
    featured: false,
    frame: 'standard',
  },
  {
    id: 'coastal-event-night',
    title: 'Coastal Event Night',
    category: 'Events',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.12),rgba(255,143,74,0.22)),url('/images/placeholders/events.svg')]",
    description: 'An elevated event moment with cinematic lighting and a stronger sense of occasion.',
    featured: true,
    frame: 'landscape',
  },
  {
    id: 'instructor-guidance',
    title: 'Instructor Guidance',
    category: 'Instructors',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.2),rgba(255,143,74,0.12)),url('/images/placeholders/instructor.svg')]",
    description: 'A calm coaching frame that highlights trust, instruction, and the human side of the experience.',
    featured: false,
    frame: 'portrait',
  },
  {
    id: 'board-prep',
    title: 'Board Prep',
    category: 'Training',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/surfboard.svg')]",
    description: 'A tactile pre-session composition prepared for close-ups, gear, and learning details.',
    featured: false,
    frame: 'standard',
  },
  {
    id: 'beachlife-morning',
    title: 'Beach Life Morning',
    category: 'Beach Life',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.14),rgba(255,143,74,0.16)),url('/images/placeholders/beach.svg')]",
    description: 'A slower frame for coastal atmosphere, horizon lines, and the easy calm of a beach morning.',
    featured: false,
    frame: 'landscape',
  },
  {
    id: 'training-flow',
    title: 'Training Flow',
    category: 'Training',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.2),rgba(255,143,74,0.12)),url('/images/placeholders/students.svg')]",
    description: 'A dynamic frame for body position, movement, and the feel of guided progression.',
    featured: false,
    frame: 'portrait',
  },
  {
    id: 'event-celebration',
    title: 'Event Celebration',
    category: 'Events',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.2)),url('/images/placeholders/sunset.svg')]",
    description: 'A brighter composition ready for post-session celebration, crowd energy, and shared memories.',
    featured: false,
    frame: 'landscape',
  },
  {
    id: 'instructor-briefing',
    title: 'Instructor Briefing',
    category: 'Instructors',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/instructor.svg')]",
    description: 'A structured coaching moment with visible support, ideal for trust-building and human connection.',
    featured: false,
    frame: 'standard',
  },
  {
    id: 'family-session',
    title: 'Family Session',
    category: 'Community',
    image: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.16)),url('/images/placeholders/students.svg')]",
    description: 'A softer, more inclusive visual for families, first-time guests, and easygoing beach moments.',
    featured: false,
    frame: 'portrait',
  },
]
