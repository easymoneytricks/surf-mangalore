import { motion } from 'framer-motion'
import Badge from '../Badge'
import EventCard from './EventCard'
import type { EventPublicItem } from '../../services/events.service'

type EventGridProps = {
  events: EventPublicItem[]
}

export default function EventGrid({ events }: EventGridProps) {
  const upcomingEvents = events.filter((event) => event.status === 'upcoming' && !event.featured)

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="max-w-[42rem]">
          <Badge tone="accent">Upcoming events</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Choose the gathering that matches your pace, energy, and ambition.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
            Each event card gives enough context to help people self-select quickly, without making the page feel like a generic listing.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {!upcomingEvents.length ? <p className="text-sm text-[var(--color-text-secondary)]">No upcoming events are available right now. Please check back soon.</p> : null}
          {upcomingEvents.map((event, index) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
