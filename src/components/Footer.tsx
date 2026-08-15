import Logo from './Logo'
import { experienceCategories } from '../data/experiences'
import { useWebsiteSettings } from '../contexts/WebsiteSettingsContext'
import { toSafeExternalUrl } from '../utils/url'

type FooterProps = {
  currentPath: string
  navigate: (path: string) => void
}

const quickLinks = [
  { label: 'About', path: '/about' },
  { label: 'Experiences', path: '/experiences' },
  { label: 'Booking', path: '/booking' },
  { label: 'Lessons', path: '/lessons' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
]

const experienceLinks = experienceCategories.slice(0, 4).map((item) => ({
  label: item.title,
  path: '/experiences',
}))

function SocialIcon({ label }: { label: string }) {
  if (label === 'Instagram') {
    return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
  }
  if (label === 'Facebook') {
    return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4H16V5.5c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3v2.5H9v2.8h2.1v7h2.4Z"/></svg>
  }
  if (label === 'YouTube') {
    return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21.3 8.2c-.2-.9-.9-1.6-1.8-1.8C17.9 6 12 6 12 6s-5.9 0-7.5.4c-.9.2-1.6.9-1.8 1.8C2.3 9.8 2.3 12 2.3 12s0 2.2.4 3.8c.2.9.9 1.6 1.8 1.8C6.1 18 12 18 12 18s5.9 0 7.5-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-3.8.4-3.8s0-2.2-.4-3.8ZM10 14.8V9.2l4.7 2.8L10 14.8Z"/></svg>
  }
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20.5 3.5A11.7 11.7 0 0 0 3.7 17.9L2 24l6.3-1.6a11.6 11.6 0 0 0 5.6 1.4h.1c6.4 0 11.7-5.2 11.7-11.6 0-3.1-1.2-6-3.4-8.2Zm-6.6 18.3h-.1a9.5 9.5 0 0 1-4.8-1.3l-.3-.2-3.8 1 1-3.7-.2-.4a9.4 9.4 0 0 1-1.4-5A9.6 9.6 0 0 1 14 2.6a9.6 9.6 0 0 1 9.6 9.6 9.6 9.6 0 0 1-9.7 9.6Zm5.3-7.1c-.3-.2-1.8-.9-2-.9-.3-.1-.4-.2-.6.2-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.5 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.8-.8 2-1.5.3-.7.3-1.4.2-1.5 0-.2-.2-.2-.5-.4Z"/></svg>
}

export default function Footer({ currentPath, navigate }: FooterProps) {
  const { settings } = useWebsiteSettings()

  const footerQuickLinks = settings.footer.quickLinks.length ? settings.footer.quickLinks : quickLinks
  const footerSocialLinks = [
    { label: 'Instagram', href: toSafeExternalUrl(settings.socialMedia.instagram) },
    { label: 'Facebook', href: toSafeExternalUrl(settings.socialMedia.facebook) },
    { label: 'YouTube', href: toSafeExternalUrl(settings.socialMedia.youtube) },
    { label: 'WhatsApp', href: toSafeExternalUrl(settings.socialMedia.whatsapp) },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href))

  return (
    <footer className="border-t border-white/12 bg-[linear-gradient(180deg,rgba(4,19,27,0.95),rgba(7,27,38,0.98))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[80rem] flex-col gap-10 px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.95fr_0.95fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-md text-sm leading-7 text-(--color-text-secondary)">
              {settings.footer.footerDescription}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-(--color-text)">Quick links</h3>
            <div className="flex flex-col gap-3 text-sm text-(--color-text-secondary)">
              {footerQuickLinks.map((link) => (
                <button key={link.path} type="button" onClick={() => navigate(link.path)} className={`w-fit transition duration-300 ${currentPath === link.path ? 'text-(--color-primary)' : 'hover:text-(--color-text)'}`} aria-current={currentPath === link.path ? 'page' : undefined}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-(--color-text)">Experiences</h3>
            <div className="flex flex-col gap-3 text-sm text-(--color-text-secondary)">
              {experienceLinks.map((link) => (
                <button key={link.label} type="button" onClick={() => navigate(link.path)} className="w-fit transition duration-300 hover:text-(--color-text)">
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-(--color-text)">Contact</h3>
            <div className="space-y-3 text-sm text-(--color-text-secondary)">
              <p>{settings.general.primaryEmail}</p>
              <p>{settings.general.primaryPhone}</p>
              <p>{settings.contact.businessAddress}</p>
              <button type="button" onClick={() => navigate('/booking')} className="rounded-full border border-white/12 px-4 py-2 text-left text-(--color-text) transition duration-300 hover:border-(--color-primary) hover:text-(--color-primary)">
                Reserve your session
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm text-(--color-text-secondary)">
            <p>{settings.footer.copyrightText}</p>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 md:block" />
            <span>{settings.footer.legalLinks[0]?.label || 'Privacy'}</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/25 md:block" />
            <span>{settings.footer.legalLinks[1]?.label || 'Terms'}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {footerSocialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-(--color-text-secondary) transition duration-300 hover:-translate-y-0.5 hover:border-(--color-primary) hover:text-(--color-primary)">
                <SocialIcon label={social.label} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
