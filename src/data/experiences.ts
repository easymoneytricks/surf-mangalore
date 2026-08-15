export type ExperienceCategory = {
  title: string
  description: string
  duration: string
  skillLevel: string
  groupSize: string
  cta: string
  imageLabel: string
  imageClassName: string
  bestFor: string
  support: string
  outcome: string
}

export type LearningStep = {
  title: string
  description: string
}

export type SupportPoint = {
  title: string
  description: string
}

export type EquipmentItem = {
  title: string
  description: string
  note: string
}

export type ExperienceFAQItem = {
  question: string
  answer: string
}

export const experienceHeroStats = [
  { value: '6', label: 'Ways to surf with us' },
  { value: '100%', label: 'Guided by instructors' },
  { value: 'Beginner+', label: 'Options for every level' },
] as const

export const experienceCategories: ExperienceCategory[] = [
  {
    title: 'Beginner Surf Experience',
    description: 'A calm, confidence-building introduction with patient coaching, safe conditions, and a clear first win in the water.',
    duration: '90 minutes',
    skillLevel: 'First-time surfers',
    groupSize: '1 to 6 guests',
    cta: 'Start here',
    imageLabel: 'First waves',
    imageClassName: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/surfing.svg')]",
    bestFor: 'New surfers who want a supportive first session',
    support: 'Extra balance coaching and shoreline briefing',
    outcome: 'Stand up, understand the ocean, and leave smiling',
  },
  {
    title: 'Intermediate Surf Training',
    description: 'For surfers ready to refine timing, turns, and wave selection with focused coaching and more energetic ocean reading.',
    duration: '2 hours',
    skillLevel: 'Progressing surfers',
    groupSize: '1 to 4 guests',
    cta: 'Push progression',
    imageLabel: 'Skill building',
    imageClassName: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/ocean.svg')]",
    bestFor: 'Guests who can paddle out and want sharper technique',
    support: 'Video-style coaching cues and wave selection guidance',
    outcome: 'Cleaner turns, better positioning, stronger confidence',
  },
  {
    title: 'Private Surf Coaching',
    description: 'A fully tailored session for individuals, couples, or friends who want focused instruction and rapid progress.',
    duration: '90 to 120 minutes',
    skillLevel: 'All levels',
    groupSize: '1 to 2 guests',
    cta: 'Book private coaching',
    imageLabel: 'One-to-one attention',
    imageClassName: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/instructor.svg')]",
    bestFor: 'Guests who prefer privacy and a highly personalized pace',
    support: 'Custom feedback and a session built around your goals',
    outcome: 'Faster learning with a more refined experience',
  },
  {
    title: 'Group Surf Sessions',
    description: 'A social surf experience that blends energy, encouragement, and shared excitement for friends, families, and travelers.',
    duration: '2 hours',
    skillLevel: 'Beginner to intermediate',
    groupSize: '4 to 8 guests',
    cta: 'Bring your crew',
    imageLabel: 'Shared energy',
    imageClassName: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/community.svg')]",
    bestFor: 'Small groups that want a memorable shared adventure',
    support: 'Group pacing with individual attention where needed',
    outcome: 'A fun, connected session with strong coastal memories',
  },
  {
    title: 'Kids Surf Experience',
    description: 'A playful, safety-led introduction designed to help younger surfers feel comfortable, capable, and proud.',
    duration: '60 minutes',
    skillLevel: 'Children and families',
    groupSize: '1 to 4 guests',
    cta: 'Plan a family session',
    imageLabel: 'Family-friendly',
    imageClassName: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/students.svg')]",
    bestFor: 'Families introducing children to the ocean with care',
    support: 'Gentle instruction, close supervision, and a patient pace',
    outcome: 'A safe first surf memory built around joy',
  },
  {
    title: 'Corporate and Team Experience',
    description: 'An elevated team-building session with shared challenge, coastal atmosphere, and a memorable off-site energy shift.',
    duration: 'Half day',
    skillLevel: 'Teams and groups',
    groupSize: '8 to 20 guests',
    cta: 'Plan a team day',
    imageLabel: 'Team connection',
    imageClassName: "bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/events.svg')]",
    bestFor: 'Companies and groups looking for a distinctive shared outing',
    support: 'Structured coaching, clear logistics, and smooth hosting',
    outcome: 'A premium team experience that feels energizing and different',
  },
]

export const learningSteps: LearningStep[] = [
  {
    title: 'Ocean safety',
    description: 'Understand currents, entry points, and the simple habits that keep every session calm and controlled.',
  },
  {
    title: 'Board handling',
    description: 'Learn how to carry, position, and control your board before you even touch the water.',
  },
  {
    title: 'Balance',
    description: 'Build body awareness on the sand and in the water so the movement feels more natural.',
  },
  {
    title: 'Wave techniques',
    description: 'Practice paddling, pop-up timing, and reading the right moment to catch a wave.',
  },
  {
    title: 'Confidence building',
    description: 'Leave with clear next steps, stronger comfort in the ocean, and momentum to keep going.',
  },
]

export const supportPoints: SupportPoint[] = [
  {
    title: 'Certified instructors',
    description: 'Your session is led by coaches who understand how to teach with calm, clarity, and control.',
  },
  {
    title: 'Clear safety guidance',
    description: 'We explain the ocean, the session plan, and the key safety checks before you paddle out.',
  },
  {
    title: 'Equipment support',
    description: 'Boards, leashes, and surf essentials are matched to your size and the session style.',
  },
  {
    title: 'Beginner-friendly approach',
    description: 'Every experience is paced so first-timers feel welcomed instead of rushed.',
  },
]

export const equipmentItems: EquipmentItem[] = [
  {
    title: 'Surf boards',
    description: 'Soft-top and progression-friendly boards selected to make balance and movement more approachable.',
    note: 'Matched to the session type and your comfort level',
  },
  {
    title: 'Safety gear',
    description: 'Leashes and any required support gear are included and fitted before you head out.',
    note: 'Checked by the coach before every session',
  },
  {
    title: 'Training support',
    description: 'On-sand coaching, wave guidance, and practical feedback are part of the experience from start to finish.',
    note: 'Included in every guided surf experience',
  },
]

export const experienceFaqs: ExperienceFAQItem[] = [
  {
    question: 'I am a beginner. Which experience should I choose?',
    answer: 'Start with the Beginner Surf Experience. It is designed to help first-time surfers feel safe, understand the basics, and enjoy a genuine first win in the water.',
  },
  {
    question: 'I cannot swim. Can I still join?',
    answer: 'Many guests start with limited swimming confidence. Let us know in advance so we can guide you toward the safest format and explain the session clearly before you enter the water.',
  },
  {
    question: 'What should I bring?',
    answer: 'Bring swimwear, a towel, drinking water, and a positive mood. If you want sun protection or a dry change of clothes afterward, that helps too.',
  },
  {
    question: 'Is equipment included?',
    answer: 'Yes. The right board, leash, and key surf support items are provided and matched to the experience you choose.',
  },
]
