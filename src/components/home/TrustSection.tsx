import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'

const trustPoints = [
  {
    title: 'Experienced coaches',
    description: 'Professional instruction in calm, supportive conditions for every skill level.',
  },
  {
    title: 'Beginner friendly',
    description: 'We make first-time surfing feel approachable, safe, and genuinely fun.',
  },
  {
    title: 'Safe ocean experience',
    description: 'Every session is guided with care, local knowledge, and clear safety standards.',
  },
  {
    title: 'Ocean adventure',
    description: 'A premium beach experience that blends coaching, scenery, and memorable energy.',
  },
]

export default function TrustSection() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }} className="rounded-[2.25rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-8 shadow-[0_28px_80px_rgba(4,19,27,0.24)] sm:p-10 lg:p-12">
        <div className="max-w-[44rem]">
          <Badge tone="accent">Trust from the first wave</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Surfing should feel exciting, safe, and beautifully simple.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
            We combine expert local knowledge with a warm, polished experience so guests feel calm, confident, and completely at ease.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {trustPoints.map((point, index) => (
            <motion.div key={point.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
              <Card variant="glass" className="h-full border-white/15 p-6">
                <div className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">0{index + 1}</div>
                <h3 className="mt-3 text-xl font-semibold text-white">{point.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{point.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
