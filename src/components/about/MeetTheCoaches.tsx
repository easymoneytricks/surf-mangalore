import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fetchPublicCoaches, type CoachPublicModel } from '../../services/coaches.service'
import Badge from '../Badge'
import Card from '../Card'
import Button from '../Button'
import { navigateTo } from '../../utils/navigation'

export default function MeetTheCoaches() {
  const [coaches, setCoaches] = useState<CoachPublicModel[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPublicCoaches().then(setCoaches).catch((fetchError: Error) => setError(fetchError.message))
  }, [])

  const cards = coaches.slice(0, 3)

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-[42rem]">
        <Badge tone="accent">Meet the coaches</Badge>
        <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
          The people behind every confident first ride.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {error ? <p className="text-sm text-rose-200">{error}</p> : null}
        {!error && !cards.length ? <p className="text-sm text-[var(--color-text-secondary)]">Coach profiles are not available right now.</p> : null}
        {cards.map((coach, index) => {
          const initials = coach.name
            .split(' ')
            .map((part) => part[0])
            .join('')

          return (
            <motion.div key={coach.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }} whileHover={{ y: -5 }}>
              <Card variant="glass" className="h-full border-white/15 p-6">
                {coach.imageUrl ? (
                  <img src={coach.imageUrl} alt={coach.name} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))] text-sm font-semibold text-[var(--color-surface)]">
                    {initials}
                  </div>
                )}
                <h3 className="mt-4 text-xl font-semibold text-white">{coach.name}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.24em] text-[var(--color-primary)]">{coach.role}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{coach.bio}</p>
                <div className="mt-5 text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-accent)]">{coach.accent}</div>
                <Button variant="ghost" size="sm" className="mt-4" onClick={() => navigateTo(coach.slug ? `/coaches/${coach.slug}` : '/about')}>View Profile</Button>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
