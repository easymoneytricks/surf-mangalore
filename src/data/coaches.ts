export type Coach = {
  name: string
  role: string
  bio: string
  accent: string
}

export const coaches: Coach[] = [
  {
    name: 'Asha Menon',
    role: 'Lead Surf Coach',
    bio: 'Known for calm instruction and a deep connection with beginner confidence.',
    accent: 'Safety first',
  },
  {
    name: 'Nikhil Rao',
    role: 'Ocean Guide',
    bio: 'Blends local knowledge with a warm, encouraging style that guests instantly trust.',
    accent: 'Local expertise',
  },
  {
    name: 'Lina Fernandes',
    role: 'Community Host',
    bio: 'Creates a welcoming atmosphere for families, travelers, and first-time surfers alike.',
    accent: 'Hospitality-led',
  },
]
