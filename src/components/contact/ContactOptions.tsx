import { motion } from 'framer-motion'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import { contactOptions } from '../../data/contact'
import { navigateTo } from '../../utils/navigation'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'
import { toSafeExternalUrl } from '../../utils/url'

function ContactIcon({ type }: { type: 'phone' | 'whatsapp' | 'email' | 'instagram' }) {
  if (type === 'phone') {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6.8 3.8h3.1l1.3 4.3-2 1.8a15.8 15.8 0 0 0 4.9 4.9l1.8-2 4.3 1.3v3.1a2 2 0 0 1-2.2 2 17.7 17.7 0 0 1-15.5-15.5 2 2 0 0 1 2-2.2Z"/></svg>
  }
  if (type === 'email') {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m5.5 7.5 6.5 5 6.5-5"/></svg>
  }
  if (type === 'instagram') {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
  }
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20.5 3.5A11.7 11.7 0 0 0 3.7 17.9L2 24l6.3-1.6a11.6 11.6 0 0 0 5.6 1.4h.1c6.4 0 11.7-5.2 11.7-11.6 0-3.1-1.2-6-3.4-8.2Zm-6.6 18.3h-.1a9.5 9.5 0 0 1-4.8-1.3l-.3-.2-3.8 1 1-3.7-.2-.4a9.4 9.4 0 0 1-1.4-5A9.6 9.6 0 0 1 14 2.6a9.6 9.6 0 0 1 9.6 9.6 9.6 9.6 0 0 1-9.7 9.6Z"/></svg>
}

export default function ContactOptions() {
  const { settings } = useWebsiteSettings()
  const whatsappUrl = toSafeExternalUrl(settings.socialMedia.whatsapp)
  const instagramUrl = toSafeExternalUrl(settings.socialMedia.instagram)

  const dynamicOptions = [
    {
      ...contactOptions[0],
      value: settings.general.primaryPhone,
      href: `tel:${settings.general.primaryPhone.replace(/\s+/g, '')}`,
    },
    {
      ...contactOptions[1],
      value: settings.general.businessWhatsapp,
      href: whatsappUrl,
    },
    {
      ...contactOptions[2],
      value: settings.general.primaryEmail,
      href: `mailto:${settings.general.primaryEmail}`,
    },
    {
      ...contactOptions[3],
      href: instagramUrl,
      route: instagramUrl ? undefined : '/contact',
    },
  ]

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-[42rem]">
        <Badge tone="accent">Choose how to connect</Badge>
        <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
          Four easy ways to start the conversation.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dynamicOptions.map((option, index) => (
          <motion.div key={option.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} whileHover={{ y: -5 }}>
            <Card variant="glass" className="flex h-full flex-col border-white/15 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-[rgba(122,214,209,0.12)] text-[var(--color-primary)]">
                <ContactIcon type={option.icon} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{option.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{option.description}</p>
              <p className="mt-5 text-sm font-semibold text-[var(--color-text)]">{option.value}</p>
              <div className="mt-6">
                {option.href ? (
                  <a href={option.href} target={option.href.startsWith('http') ? '_blank' : undefined} rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    <Button variant="outline" size="md" className="w-full">
                      {option.actionLabel}
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" size="md" className="w-full" onClick={() => option.route && navigateTo(option.route)}>
                    {option.actionLabel}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
