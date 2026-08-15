import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'

const steps = [
  {
    title: 'Introduction',
    body: 'We begin with beach-side guidance, posture, and how to read the water with confidence.',
  },
  {
    title: 'Safety training',
    body: 'We cover the essentials: ocean awareness, etiquette, equipment support, and calm decision-making.',
  },
  {
    title: 'Ocean practice',
    body: 'Students move through a progressive sequence of paddling, pop-up prep, and controlled wave interaction.',
  },
  {
    title: 'Guided surfing',
    body: 'The final phase focuses on fun, flow, and a memorable first ride with clear coaching the entire way.',
  },
]

export default function LearningProcess() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-[44rem]">
        <Badge tone="accent">How the lesson unfolds</Badge>
        <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
          A structured experience that helps every guest feel ready, supported, and excited.
        </h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {steps.map((step, index) => (
          <motion.div key={step.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
            <Card variant="glass" className="h-full border-white/15 p-6">
              <div className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">0{index + 1}</div>
              <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{step.body}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
