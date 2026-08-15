import { useEffect, useState } from 'react'
import EventsHero from '../components/events/EventsHero'
import FeaturedEvent from '../components/events/FeaturedEvent'
import EventGrid from '../components/events/EventGrid'
import EventDetails from '../components/events/EventDetails'
import PastEvents from '../components/events/PastEvents'
import EventFAQ from '../components/events/EventFAQ'
import EventsCTA from '../components/events/EventsCTA'
import { fetchEvents, type EventPublicItem } from '../services/events.service'

export default function EventsPage() {
  const [events, setEvents] = useState<EventPublicItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  const featuredEvent = events.find((event) => event.featured) ?? events[0]

  return (
    <main className="w-full">
      <EventsHero />
      {loading ? (
        <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-12 sm:px-8 lg:px-12">
          <p className="text-sm text-[var(--color-text-secondary)]">Loading events...</p>
        </section>
      ) : error ? (
        <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-12 sm:px-8 lg:px-12">
          <div className="rounded-[2rem] border border-rose-200/30 bg-rose-900/20 p-8 text-center">
            <p className="text-lg font-semibold text-white">Unable to load events</p>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{error}</p>
          </div>
        </section>
      ) : (
        <>
          {featuredEvent ? <FeaturedEvent event={featuredEvent} /> : null}
          <EventGrid events={events} />
          <EventDetails />
          <PastEvents />
          <EventFAQ />
        </>
      )}
      <EventsCTA />
    </main>
  )
}
