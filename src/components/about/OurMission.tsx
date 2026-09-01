import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'

export default function OurMission() {
  const { settings } = useWebsiteSettings()
  const content = settings.about.mission
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
        <Card variant="feature" className="border-white/12 p-8 shadow-[0_28px_80px_rgba(4,19,27,0.3)] sm:p-10 lg:p-12">
          <Badge tone="accent">{content.eyebrow}</Badge>
          <h2 className="mt-4 max-w-[20ch] font-[var(--font-heading)] text-[clamp(1.9rem,3.2vw,2.6rem)] font-[var(--font-semibold)] leading-[1.06] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            {content.title}
          </h2>
          <p className="mt-5 max-w-[46rem] text-base leading-8 text-[var(--color-text-secondary)]">{content.description}</p>
        </Card>
      </motion.div>
    </section>
  )
}
