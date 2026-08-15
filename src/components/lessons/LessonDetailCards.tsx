import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'

const details = [
  {
    title: 'What you’ll learn',
    body: 'Ocean awareness, balance, paddling posture, wave timing, and the calm confidence that comes from clear coaching.',
  },
  {
    title: 'Who can join',
    body: 'Perfect for first-time surfers, curious travelers, friend groups, and anyone looking for a memorable coastal experience.',
  },
  {
    title: 'What makes it premium',
    body: 'Small-group pacing, thoughtful instruction, and a seamless transition from land-based basics to the first ride.',
  },
]

export default function LessonDetailCards() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-[40rem]">
        <Badge tone="accent">What to expect</Badge>
        <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
          A lesson structure designed to feel clear, encouraging, and rewarding.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {details.map((item, index) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
            <Card variant="glass" className="h-full border-white/15 p-6">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{item.body}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
