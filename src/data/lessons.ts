export type Lesson = {
  title: string
  description: string
  level: string
  duration: string
  accent: string
}

export const lessons: Lesson[] = [
  {
    title: 'Beginner Flow',
    description: 'A calm first session designed for confidence, balance, and a joyful introduction to the ocean.',
    level: 'First-time surfers',
    duration: '90 min',
    accent: 'Perfect for first-timers',
  },
  {
    title: 'Intermediate Wave Sessions',
    description: 'Build speed, timing, and control with guided coaching in more dynamic conditions.',
    level: 'Rising surfers',
    duration: '2 hrs',
    accent: 'Skill-building focus',
  },
  {
    title: 'Private Coaching',
    description: 'A tailored session for individuals, couples, or small groups who want focused instruction.',
    level: 'Personalized',
    duration: 'Flexible',
    accent: 'Maximum attention',
  },
]
