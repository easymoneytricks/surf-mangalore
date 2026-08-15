import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'

export default function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(5,21,31,0.98),rgba(8,32,46,0.92))] px-5 py-6 shadow-[0_36px_100px_rgba(4,19,27,0.34)] sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,143,74,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,16,23,0.98),rgba(5,22,31,0.82),rgba(10,39,54,0.3))]" />
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge tone="accent">About Surf Mangalore</Badge>
          <h1 className="mt-5 max-w-[12ch] font-[var(--font-heading)] text-[clamp(2.7rem,5vw,5rem)] font-[var(--font-display)] leading-[0.88] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Surfers at heart, sharing the ocean with care.
          </h1>
          <p className="mt-6 max-w-[36rem] text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
            We built Surf Mangalore from real mornings in the water, real friendships on the beach, and a simple belief that surfing should feel welcoming, safe, and unforgettable.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
          <Card variant="image" className="overflow-hidden border-white/15 p-0">
            <div className="relative aspect-[4/5] bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.16)),radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),linear-gradient(180deg,rgba(4,19,27,0.2),rgba(4,19,27,0.84))]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.1),rgba(4,19,27,0.82))]" />
              <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[rgba(4,19,27,0.46)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-white backdrop-blur-lg">
                Ocean lifestyle
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/12 bg-[rgba(4,19,27,0.6)] p-5 backdrop-blur-xl">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Our promise</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                  Thoughtful coaching, honest hospitality, and a community that makes every guest feel part of the coast.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
