import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { faqs } from '../../data/faqs'

export default function LessonFAQ() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-[40rem]">
        <Badge tone="accent">Common questions</Badge>
        <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
          Helpful answers that make booking feel simple and low pressure.
        </h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {faqs.map((item, index) => (
          <motion.div key={item.question} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
            <Card variant="glass" className="h-full border-white/15 p-6">
              <h3 className="text-lg font-semibold text-white">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{item.answer}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
