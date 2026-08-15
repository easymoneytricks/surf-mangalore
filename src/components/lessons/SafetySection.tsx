import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'

const safetyPoints = [
  {
    title: 'Beginner friendly',
    body: 'Every lesson is paced to help new surfers feel comfortable, supported, and confident.',
  },
  {
    title: 'Equipment support',
    body: 'We provide surfboards, rash vests, and the essential gear needed for a smooth first session.',
  },
  {
    title: 'Professional guidance',
    body: 'Our team watches the conditions closely and helps each guest make the most of the experience.',
  },
]

export default function SafetySection() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-8 shadow-[var(--shadow-medium)] sm:p-10 lg:p-12">
        <div className="max-w-[44rem]">
          <Badge tone="accent">Safety-first design</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Confidence begins with care, clarity, and a respectful approach to the ocean.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {safetyPoints.map((point, index) => (
            <motion.div key={point.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
              <Card variant="glass" className="h-full border-white/15 p-6">
                <h3 className="text-xl font-semibold text-white">{point.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{point.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
