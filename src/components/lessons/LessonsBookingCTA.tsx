import { motion } from 'framer-motion'
import Button from '../Button'
import Card from '../Card'
import { navigateTo } from '../../utils/navigation'

export default function LessonsBookingCTA() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 pb-20 pt-8 sm:px-8 lg:px-12 lg:pb-24">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
        <Card variant="feature" className="relative isolate overflow-hidden border-white/12 p-8 shadow-[0_36px_110px_rgba(4,19,27,0.38)] sm:p-10 lg:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(122,214,209,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,143,74,0.14),transparent_34%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[var(--color-primary)]">Ready to begin</p>
              <h2 className="mt-3 font-[var(--font-heading)] text-[clamp(1.9rem,3.2vw,2.7rem)] font-[var(--font-semibold)] leading-[1.05] tracking-[var(--letter-tight)] text-[var(--color-text)]">
                Make your first lesson feel effortless, joyful, and memorable.
              </h2>
              <p className="mt-4 max-w-[34rem] text-base leading-8 text-[var(--color-text-secondary)]">
                Choose your session, meet your coach, and step into the ocean with confidence and support from day one.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(4,19,27,0.34)] p-6 shadow-[0_22px_60px_rgba(4,19,27,0.28)] backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--color-primary)]">Book your lesson</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button variant="primary" size="lg" onClick={() => navigateTo('/booking')}>
                  Reserve A Session
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigateTo('/events')}>
                  Explore Events
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  )
}
