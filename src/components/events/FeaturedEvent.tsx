import { motion } from 'framer-motion'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import type { EventPublicItem } from '../../services/events.service'
import { navigateTo } from '../../utils/navigation'

type FeaturedEventProps = {
  event: EventPublicItem
}

export default function FeaturedEvent({ event }: FeaturedEventProps) {
  const bookingQuery = new URLSearchParams({
    bookingType: 'EVENT',
    selectedItemId: event.id,
    preferredDate: event.startDate.slice(0, 10),
    preferredTime: event.startTimeLabel || '',
  })

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <Badge tone="accent">Featured event</Badge>
            <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.9rem,3.4vw,2.7rem)] font-[var(--font-semibold)] leading-[1.06] tracking-[var(--letter-tight)] text-[var(--color-text)]">
              {event.title}
            </h2>
            <p className="mt-4 max-w-[38rem] text-base leading-8 text-[var(--color-text-secondary)]">
              {event.story}
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <Card variant="glass" className="border-white/12 px-4 py-4">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Date</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{event.date}</p>
              </Card>
              <Card variant="glass" className="border-white/12 px-4 py-4">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Location</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{event.location}</p>
              </Card>
              <Card variant="glass" className="border-white/12 px-4 py-4">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Participants</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{event.participants}</p>
              </Card>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" size="lg" onClick={() => navigateTo(`/booking?${bookingQuery.toString()}`)}>
                Reserve a place
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigateTo(`/events/${event.slug}`)}>
                Find the right event
              </Button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45 }}>
            <Card variant="image" className="overflow-hidden border-white/15 p-0">
              <div className={`relative aspect-[4/5] bg-cover bg-center ${event.image}`}>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.06),rgba(4,19,27,0.8))]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[rgba(4,19,27,0.46)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-white backdrop-blur-lg">
                  {event.category}
                </div>
                <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/12 bg-[rgba(4,19,27,0.6)] p-5 backdrop-blur-xl">
                  <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Featured experience</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                    A community-focused surf event with an unmistakable premium feel and a strong sense of occasion.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
