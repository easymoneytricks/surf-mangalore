import { motion } from 'framer-motion'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import { navigateTo } from '../../utils/navigation'

export default function LessonsHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(5,21,31,0.98),rgba(8,32,46,0.92))] px-5 py-6 shadow-[var(--shadow-large)] sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
      <div className="absolute inset-0 overflow-hidden rounded-[2.4rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,143,74,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,16,23,0.98),rgba(5,22,31,0.82),rgba(10,39,54,0.3))]" />
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge tone="accent">Surf lessons · Mangalore</Badge>
          <h1 className="mt-5 max-w-[10ch] font-[var(--font-heading)] text-[clamp(2.6rem,5vw,4.4rem)] font-[var(--font-display)] leading-[0.9] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Start your surfing journey.
          </h1>
          <p className="mt-6 max-w-[34rem] text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
            Learn in calm, welcoming conditions with expert guidance, thoughtful coaching, and the kind of ocean energy that turns a first lesson into a lasting memory.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" onClick={() => navigateTo('/booking')}>
              Reserve A Lesson
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigateTo('/gallery')}>
              View The Coast
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
          <Card variant="image" className="overflow-hidden border-white/15 p-0">
            <div className="relative aspect-[4/5] bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16)),url('/images/placeholders/students.svg')] bg-cover bg-center" />
            <div className="p-6">
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[var(--color-primary)]">Why beginners love this</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">Gentle progression, clear instruction, and a premium studio-to-sea experience.</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
