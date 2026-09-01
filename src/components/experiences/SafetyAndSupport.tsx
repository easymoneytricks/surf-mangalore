import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'

export default function SafetyAndSupport() {
  const { settings } = useWebsiteSettings()
  const content = settings.experiencePage.support
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Badge tone="accent">{content.eyebrow}</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
            {content.description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {content.items.slice().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((point, index) => (
            <motion.div key={point.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} whileHover={{ y: -5 }}>
              <Card variant="glass" className="h-full border-white/15 p-6">
                <div className="h-11 w-11 rounded-full border border-white/12 bg-[linear-gradient(135deg,rgba(122,214,209,0.22),rgba(255,143,74,0.12))] bg-cover bg-center" style={point.imageUrl ? { backgroundImage: `url('${point.imageUrl}')` } : undefined} />
                <h3 className="mt-4 text-xl font-semibold text-white">{point.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{point.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
