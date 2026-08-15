import { type SidebarNavItem } from '../types/navigation'

export const sidebarNavigation: SidebarNavItem[] = [
  { to: '/dashboard', label: 'Dashboard', permission: 'dashboard.view' },
  { to: '/bookings', label: 'Bookings', permission: 'bookings.view' },
  { to: '/lessons', label: 'Lessons', permission: 'lessons.view' },
  { to: '/experiences', label: 'Experiences', permission: 'experiences.view' },
  { to: '/events', label: 'Events', permission: 'events.view' },
  { to: '/gallery', label: 'Gallery', permission: 'gallery.view' },
  { to: '/coaches', label: 'Coaches', permission: 'coaches.view' },
  { to: '/testimonials', label: 'Testimonials', permission: 'testimonials.view' },
  { to: '/faqs', label: 'FAQs', permission: 'faqs.view' },
  { to: '/media-library', label: 'Media Library', permission: 'media.view' },
  { to: '/contact-messages', label: 'Contact Messages', permission: 'contact-messages.view' },
  { to: '/seo', label: 'SEO', permission: 'seo.view' },
  { to: '/settings', label: 'Settings', permission: 'site-settings.view' },
  { to: '/users', label: 'Users', permission: 'users.view' },
  { to: '/roles', label: 'Roles', permission: 'roles.view' },
  { to: '/permissions', label: 'Permissions', permission: 'permissions.view' },
  { to: '/audit-logs', label: 'Audit Logs', permission: 'audit-logs.view' },
]
