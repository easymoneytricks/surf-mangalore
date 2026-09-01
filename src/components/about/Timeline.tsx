import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'

export default function Timeline() {
  const { settings } = useWebsiteSettings()
  const content = settings.about.timeline
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="max-w-[42rem]">
          <Badge tone="accent">{content.eyebrow}</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            {content.title}
          </h2>
        </div>

        <ol className="relative mt-10 grid gap-5 pl-6 before:absolute before:bottom-0 before:left-2 before:top-2 before:w-px before:bg-[linear-gradient(180deg,rgba(122,214,209,0.5),transparent)]">
          {content.entries.slice().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((item, index) => (
            <motion.li key={item.year + item.title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }} className="relative">
              <span className="absolute -left-[1.05rem] top-6 h-3 w-3 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)]/40" />
              <Card variant="glass" className="border-white/12 p-5">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">{item.year}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{item.description}</p>
              </Card>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
