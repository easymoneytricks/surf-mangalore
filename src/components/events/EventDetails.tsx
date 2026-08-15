import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { eventHighlights } from '../../data/events'

export default function EventDetails() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Badge tone="accent">What participants get</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            The event experience is built to feel active, social, and well-supported.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
            We want guests to leave with a stronger surf experience and a feeling that they were part of something bigger than a simple session.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {eventHighlights.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} whileHover={{ y: -4 }}>
              <Card variant="glass" className="h-full border-white/15 p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">{item.note}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
