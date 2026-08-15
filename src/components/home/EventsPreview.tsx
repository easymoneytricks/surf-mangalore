import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Badge from '../Badge'
import Card from '../Card'
import { fetchEvents, type EventPublicItem } from '../../services/events.service'

export default function EventsPreview() {
  const [events, setEvents] = useState<EventPublicItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchEvents()
      .then((items) => {
        if (!cancelled) {
          setEvents(items)
        }
      })
      .catch((fetchError: Error) => {
        if (!cancelled) {
          setError(fetchError.message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const previewItems = events.filter((item) => item.featured).slice(0, 3)

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[40rem]">
            <Badge tone="accent">Upcoming experiences</Badge>
            <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
              Social, scenic, and energy-filled surf moments throughout the week.
            </h2>
          </div>
          <p className="max-w-[32rem] text-base leading-8 text-[var(--color-text-secondary)]">
            The gallery experience is designed to feel cinematic, atmospheric, and inviting as we replace placeholders with real surf photography.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {loading && !error ? (
            <p className="text-sm text-[var(--color-text-secondary)]">Loading events...</p>
          ) : error ? (
            <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p>
          ) : previewItems.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">No featured events are available at the moment.</p>
          ) : (
            previewItems.map((event, index) => (
              <motion.div key={event.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.07 }} whileHover={{ y: -6, scale: 1.01 }}>
                <Card variant="feature" className="h-full border-white/12 p-7">
                  <div className="h-24 rounded-[1.15rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.18),transparent_45%),linear-gradient(135deg,rgba(4,19,27,0.95),rgba(23,52,71,0.82))]" />
                  <div className="mt-5 text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">{event.tag}</div>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{event.title}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">{event.date}</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">{event.description}</p>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
