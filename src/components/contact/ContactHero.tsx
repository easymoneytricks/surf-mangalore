import { motion } from 'framer-motion'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import { navigateTo } from '../../utils/navigation'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'

export default function ContactHero() {
  const { settings } = useWebsiteSettings()
  const content = settings.contact.hero
  return (
    <section className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(5,21,31,0.98),rgba(8,32,46,0.92))] px-5 py-6 shadow-[0_36px_100px_rgba(4,19,27,0.34)] sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,143,74,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,16,23,0.98),rgba(5,22,31,0.82),rgba(10,39,54,0.3))]" />
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge tone="accent">{content.eyebrow}</Badge>
          <h1 className="mt-5 max-w-[12ch] font-[var(--font-heading)] text-[clamp(2.6rem,4.8vw,4.8rem)] font-[var(--font-display)] leading-[0.88] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            {content.title}
          </h1>
          <p className="mt-6 max-w-[36rem] text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
            {content.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" onClick={() => navigateTo(content.primaryCtaPath)}>
              {content.primaryCtaLabel}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigateTo(content.secondaryCtaPath)}>
              {content.secondaryCtaLabel}
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
          <Card variant="image" className="overflow-hidden border-white/15 p-0">
            <div className="relative aspect-[4/5] bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16)),url('/images/placeholders/ocean.svg')] bg-cover bg-center" style={content.imageUrl ? { backgroundImage: `linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16)),url('${content.imageUrl}')` } : undefined}>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.08),rgba(4,19,27,0.82))]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/12 bg-[rgba(4,19,27,0.6)] p-5 backdrop-blur-xl">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">{content.supportLabel}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {content.supportText}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
