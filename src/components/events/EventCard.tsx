import { motion } from 'framer-motion'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import type { EventPublicItem } from '../../services/events.service'
import { navigateTo } from '../../utils/navigation'

type EventCardProps = {
  event: EventPublicItem
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25 }} className="h-full">
      <Card variant="feature" className="flex h-full flex-col overflow-hidden border-white/12 p-0">
        <div className={`relative aspect-[4/3] overflow-hidden ${event.image}`}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.08),rgba(4,19,27,0.78))]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[rgba(4,19,27,0.42)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-white backdrop-blur-lg">
            {event.category}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{event.tag}</Badge>
            <Badge tone="muted">{event.status === 'past' ? 'Past moment' : 'Upcoming'}</Badge>
          </div>

          <h3 className="mt-4 text-[1.45rem] font-semibold leading-[1.12] text-white">{event.title}</h3>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">{event.date}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">{event.location}</p>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">{event.description}</p>

          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">Participants</p>
              <p className="mt-2">{event.participants}</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">Location</p>
              <p className="mt-2">{event.location}</p>
            </div>
          </div>

          <div className="mt-5 text-sm leading-7 text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-text)]">Story: </span>
            {event.story}
          </div>

          <div className="mt-6">
            <Button variant="outline" size="md" onClick={() => navigateTo(`/events/${event.slug}`)} className="w-full">
              {event.cta}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
