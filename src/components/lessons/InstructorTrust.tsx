import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { coaches as staticCoaches } from '../../data/coaches'
import { fetchPublicCoaches, type CoachPublicModel } from '../../services/coaches.service'
import Badge from '../Badge'
import Card from '../Card'

export default function InstructorTrust() {
  const [coaches, setCoaches] = useState<CoachPublicModel[]>(
    staticCoaches.map((coach, index) => ({ id: index + 1, ...coach })),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPublicCoaches().then(setCoaches).catch((fetchError: Error) => setError(fetchError.message))
  }, [])

  const cards = coaches.slice(0, 3)

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <Badge tone="accent">Trusted by first-timers</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Coaches who make the experience feel safe, human, and genuinely exciting.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
            Our team brings together local knowledge, calm communication, and a strong understanding of how beginners build confidence in the water.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {error ? <p className="text-sm text-rose-200">{error}</p> : null}
          {!error && !cards.length ? <p className="text-sm text-[var(--color-text-secondary)]">Coach profiles are not available right now.</p> : null}
          {cards.map((coach, index) => (
            <motion.div key={coach.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
              <Card variant="glass" className="h-full border-white/15 p-6">
                {coach.imageUrl ? (
                  <img src={coach.imageUrl} alt={coach.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))]" />
                )}
                <h3 className="mt-4 text-lg font-semibold text-white">{coach.name}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.24em] text-[var(--color-primary)]">{coach.role}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{coach.bio}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
