import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'

const commitments = [
  'Coach-led session planning based on ocean conditions',
  'Clear pre-water safety briefings for every group',
  'Progression pace adapted to each guest comfort level',
  'Ongoing in-water supervision and support',
]

export default function SafetyCommitment() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
        <Card variant="feature" className="border-white/12 p-8 shadow-[0_28px_80px_rgba(4,19,27,0.3)] sm:p-10 lg:p-12">
          <Badge tone="accent">Safety commitment</Badge>
          <h2 className="mt-4 max-w-[22ch] font-[var(--font-heading)] text-[clamp(1.9rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.06] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Every surf experience starts with trust and preparedness.
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {commitments.map((item) => (
              <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </section>
  )
}
