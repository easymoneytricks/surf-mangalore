import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'

const pillars = [
  {
    title: 'Location',
    body: 'A beautiful coastal setting that feels both accessible and adventurous from the first moment.',
  },
  {
    title: 'Experience',
    body: 'Guided sessions that balance challenge, comfort, and confidence for every guest.',
  },
  {
    title: 'Community',
    body: 'A friendly, welcoming atmosphere that turns a lesson into a shared memory.',
  },
]

export default function WhyChooseUsSection() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2.25rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.2)] sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge tone="accent">Why Surf Mangalore</Badge>
            <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
              A premium surf experience built around place, people, and confidence.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
              We combine a stunning coastline, expert guidance, and a warm, polished atmosphere to make every session feel memorable from the first hello.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <motion.div key={pillar.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.36, delay: index * 0.08 }} whileHover={{ y: -6, scale: 1.01 }}>
                <Card variant="glass" className="h-full border-white/15 p-6">
                  <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{pillar.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
