import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'

export default function StatisticsSection() {
  const { settings } = useWebsiteSettings()
  const content = settings.about.statistics
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-[42rem]">
        <Badge tone="accent">{content.eyebrow}</Badge>
        <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
          {content.title}
        </h2>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.slice().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} whileHover={{ y: -4 }}>
            <Card variant="feature" className="h-full border-white/12 p-5">
              <p className="text-[2rem] font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--color-primary)]">{stat.label}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{stat.detail}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
