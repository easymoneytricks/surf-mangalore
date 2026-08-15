import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'

export default function LocationSection() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Badge tone="accent">Find us</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Easy to reach, easier to settle into.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card variant="glass" className="border-white/12 p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Address</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">Malpe, Karnataka</p>
            </Card>
            <Card variant="glass" className="border-white/12 p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Nearest landmark</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">Main Malpe beachfront access and surf-friendly pickup zone.</p>
            </Card>
            <Card variant="glass" className="border-white/12 p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Parking</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">Space for cars and bikes is typically available near the beach entry area.</p>
            </Card>
            <Card variant="glass" className="border-white/12 p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Travel tips</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">Arrive a little early, carry water, and message us if you need help with local timing or transport guidance.</p>
            </Card>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4 }}>
          <Card variant="image" className="overflow-hidden border-white/15 p-0">
            <div className="relative aspect-[4/5] bg-[linear-gradient(135deg,rgba(122,214,209,0.18),rgba(255,143,74,0.12)),url('/images/placeholders/beach.svg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.06),rgba(4,19,27,0.8))]" />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.35rem] border border-white/12 bg-[rgba(4,19,27,0.58)] p-5 backdrop-blur-xl">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Map integration ready</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">This visual placeholder is prepared for a future embedded Google Maps or custom map experience.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
