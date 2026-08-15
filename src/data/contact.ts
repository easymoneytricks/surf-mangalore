export type ContactOption = {
  id: string
  title: string
  description: string
  value: string
  actionLabel: string
  href?: string
  route?: string
  icon: 'phone' | 'whatsapp' | 'email' | 'instagram'
}

export type BusinessHoursItem = {
  day: string
  hours: string
}

export const contactOptions: ContactOption[] = [
  {
    id: 'phone',
    title: 'Call the team',
    description: 'Best for quick questions, same-week planning, and private group coordination.',
    value: '+91 98765 43210',
    actionLabel: 'Call now',
    href: 'tel:+919876543210',
    icon: 'phone',
  },
  {
    id: 'whatsapp',
    title: 'Message on WhatsApp',
    description: 'A simple way to confirm availability, ask questions, and share your travel timing.',
    value: '+91 98765 43210',
    actionLabel: 'Open WhatsApp',
    href: 'https://wa.me/919876543210',
    icon: 'whatsapp',
  },
  {
    id: 'email',
    title: 'Send an email',
    description: 'Ideal for detailed enquiries, event discussions, and tailored surf experience planning.',
    value: 'hello@surfmangalore.com',
    actionLabel: 'Write email',
    href: 'mailto:hello@surfmangalore.com',
    icon: 'email',
  },
  {
    id: 'instagram',
    title: 'Follow on Instagram',
    description: 'See the coastal atmosphere, latest moments, and direct updates from the water.',
    value: '@surfmangalore',
    actionLabel: 'View Instagram',
    href: 'https://instagram.com',
    icon: 'instagram',
  },
]

export const businessHours: BusinessHoursItem[] = [
  { day: 'Monday', hours: '6:30 AM - 6:30 PM' },
  { day: 'Tuesday', hours: '6:30 AM - 6:30 PM' },
  { day: 'Wednesday', hours: '6:30 AM - 6:30 PM' },
  { day: 'Thursday', hours: '6:30 AM - 6:30 PM' },
  { day: 'Friday', hours: '6:30 AM - 7:00 PM' },
  { day: 'Saturday', hours: '6:00 AM - 7:00 PM' },
  { day: 'Sunday', hours: '6:00 AM - 7:00 PM' },
] as const

export const contactFaqPreview = [
  {
    question: 'When should I arrive?',
    answer: 'Arrive 15 to 20 minutes early so the team can help with check-in, equipment, and a calm start to your session.',
  },
  {
    question: 'Can beginners join?',
    answer: 'Yes. Most of our sessions are designed to feel supportive and confidence-building for first-time surfers.',
  },
  {
    question: 'What should I bring?',
    answer: 'Bring swimwear, a towel, and drinking water. We will guide you on the rest depending on your session type.',
  },
] as const
