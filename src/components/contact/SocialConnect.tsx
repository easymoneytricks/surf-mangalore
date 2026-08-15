import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'
import { toSafeExternalUrl } from '../../utils/url'

const socialMeta = [
  {
    label: 'Instagram',
    description: 'See the latest surf mornings and coastal moments.',
    icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  },
  {
    label: 'Facebook',
    description: 'Stay updated with events, community sessions, and notices.',
    icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4H16V5.5c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.3v2.5H9v2.8h2.1v7h2.4Z"/></svg>,
  },
  {
    label: 'YouTube',
    description: 'Watch surf highlights, training snippets, and event energy.',
    icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M21.3 8.2c-.2-.9-.9-1.6-1.8-1.8C17.9 6 12 6 12 6s-5.9 0-7.5.4c-.9.2-1.6.9-1.8 1.8C2.3 9.8 2.3 12 2.3 12s0 2.2.4 3.8c.2.9.9 1.6 1.8 1.8C6.1 18 12 18 12 18s5.9 0 7.5-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-3.8.4-3.8s0-2.2-.4-3.8ZM10 14.8V9.2l4.7 2.8L10 14.8Z"/></svg>,
  },
  {
    label: 'WhatsApp',
    description: 'The quickest route for practical surf-day planning.',
    icon: <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M20.5 3.5A11.7 11.7 0 0 0 3.7 17.9L2 24l6.3-1.6a11.6 11.6 0 0 0 5.6 1.4h.1c6.4 0 11.7-5.2 11.7-11.6 0-3.1-1.2-6-3.4-8.2Zm-6.6 18.3h-.1a9.5 9.5 0 0 1-4.8-1.3l-.3-.2-3.8 1 1-3.7-.2-.4a9.4 9.4 0 0 1-1.4-5A9.6 9.6 0 0 1 14 2.6a9.6 9.6 0 0 1 9.6 9.6 9.6 9.6 0 0 1-9.7 9.6Z"/></svg>,
  },
] as const

export default function SocialConnect() {
  const { settings } = useWebsiteSettings()

  const socials = socialMeta
    .map((item) => {
      const href = toSafeExternalUrl(
        item.label === 'Instagram'
          ? settings.socialMedia.instagram
          : item.label === 'Facebook'
            ? settings.socialMedia.facebook
            : item.label === 'YouTube'
              ? settings.socialMedia.youtube
              : settings.socialMedia.whatsapp,
      )

      return href ? { ...item, href } : null
    })
    .filter((item): item is (typeof socialMeta)[number] & { href: string } => Boolean(item))

  if (!socials.length) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="max-w-[42rem]">
          <Badge tone="accent">Social connect</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Follow the coastal energy beyond the website.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {socials.map((item, index) => (
            <motion.a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} whileHover={{ y: -5, scale: 1.01 }} className="block">
              <Card variant="glass" className="h-full border-white/12 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-[rgba(122,214,209,0.12)] text-[var(--color-primary)]">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.label}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{item.description}</p>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
