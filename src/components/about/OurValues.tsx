import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { aboutValues } from '../../data/about'

export default function OurValues() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="max-w-[42rem]">
          <Badge tone="accent">Our values</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            The standards that guide every surf day.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {aboutValues.map((value, index) => (
            <motion.div key={value.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.04 }} whileHover={{ y: -4 }}>
              <Card variant="glass" className="h-full border-white/15 p-5">
                <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
