export type GlobalSearchItem = {
  id: string
  title: string
  subtitle: string
  path: string
  keywords: string[]
}

export const GLOBAL_SEARCH_STATIC_ITEMS: GlobalSearchItem[] = [
  { id: 'gs-dashboard', title: 'Dashboard', subtitle: 'Overview and KPIs', path: '/dashboard', keywords: ['overview', 'kpi', 'stats'] },
  { id: 'gs-events', title: 'Events', subtitle: 'Event lifecycle management', path: '/events', keywords: ['schedule', 'publish', 'sunrise'] },
  { id: 'gs-lessons', title: 'Lessons', subtitle: 'Lesson catalog management', path: '/lessons', keywords: ['lesson', 'instructor', 'difficulty'] },
  { id: 'gs-experiences', title: 'Experiences', subtitle: 'Experience package management', path: '/experiences', keywords: ['package', 'experience', 'featured'] },
  { id: 'gs-bookings', title: 'Bookings', subtitle: 'Booking operations and status', path: '/bookings', keywords: ['booking', 'reservation', 'status'] },
  { id: 'gs-gallery', title: 'Gallery', subtitle: 'Image and album operations', path: '/gallery', keywords: ['album', 'photo', 'media'] },
  { id: 'gs-coaches', title: 'Coaches', subtitle: 'Coach profile management', path: '/coaches', keywords: ['coach', 'instructor', 'bio'] },
  { id: 'gs-testimonials', title: 'Testimonials', subtitle: 'Social proof and reviews', path: '/testimonials', keywords: ['reviews', 'rating', 'featured'] },
  { id: 'gs-faqs', title: 'FAQs', subtitle: 'Question and answer library', path: '/faqs', keywords: ['faq', 'questions', 'answers'] },
  { id: 'gs-users', title: 'Users', subtitle: 'User access operations', path: '/users', keywords: ['access', 'invites', 'deactivate'] },
  { id: 'gs-roles', title: 'Roles', subtitle: 'Role definitions and cloning', path: '/roles', keywords: ['permissions', 'members', 'role'] },
  { id: 'gs-permissions', title: 'Permissions', subtitle: 'Permission matrix controls', path: '/permissions', keywords: ['matrix', 'groups', 'toggle'] },
  { id: 'gs-settings', title: 'Settings', subtitle: 'Global website configuration', path: '/settings', keywords: ['general', 'branding', 'seo', 'footer'] },
  { id: 'gs-seo', title: 'SEO Manager', subtitle: 'Metadata and robots directives', path: '/seo', keywords: ['meta', 'og', 'twitter', 'canonical'] },
  { id: 'gs-contact', title: 'Contact Messages', subtitle: 'Inbox workflow', path: '/contact-messages', keywords: ['inbox', 'unread', 'reply'] },
  { id: 'gs-audit', title: 'Audit Logs', subtitle: 'Action trail and severity timeline', path: '/audit-logs', keywords: ['timeline', 'activity', 'ip'] },
]
