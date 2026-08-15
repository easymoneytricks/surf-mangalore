import { motion } from 'framer-motion'
import Badge from '../Badge'

export default function BookingHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(5,21,31,0.98),rgba(8,32,46,0.92))] px-5 py-6 shadow-[0_34px_90px_rgba(4,19,27,0.34)] sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
      <div className="absolute inset-0 overflow-hidden rounded-[2.4rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,143,74,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,16,23,0.98),rgba(5,22,31,0.82),rgba(10,39,54,0.3))]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative z-10 max-w-[44rem]">
        <Badge tone="accent">Booking experience</Badge>
        <h1 className="mt-4 font-[var(--font-heading)] text-[clamp(2rem,4vw,3.6rem)] font-[var(--font-display)] leading-[0.92] tracking-[var(--letter-tight)] text-[var(--color-text)]">
          Book your surf session in a few simple steps.
        </h1>
        <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
          Choose your experience, preferred time, and guest details. We keep the flow fast and clear so you can get back to planning your ocean day.
        </p>
      </motion.div>
    </section>
  )
}
