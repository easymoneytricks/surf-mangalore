import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import { fetchLessons } from '../../services/lessons.service'
import { navigateTo } from '../../utils/navigation'

type LessonCardModel = {
  title: string
  description: string
  level: string
  duration: string
  accent: string
  coverImageUrl?: string | null
  slug: string
  price?: number | null
}

export default function LessonCategories() {
  const [lessons, setLessons] = useState<LessonCardModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchLessons()
      .then((items) => {
        if (!cancelled) {
          setLessons(items)
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

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-[40rem]">
        <Badge tone="accent">Choose the right lesson</Badge>
        <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
          A lesson style for every level of confidence and curiosity.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {loading ? <p className="text-sm text-[var(--color-text-secondary)]">Loading lessons...</p> : null}
        {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
        {!loading && !error && !lessons.length ? <p className="text-sm text-[var(--color-text-secondary)]">No lessons are available right now. Please check back soon.</p> : null}
        {!loading && !error && lessons.map((lesson, index) => (
          <motion.div key={lesson.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
            <Card variant="feature" className="h-full border-white/12 p-7">
              <div className="h-32 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.18),transparent_40%),linear-gradient(135deg,rgba(4,19,27,0.95),rgba(23,52,71,0.78))]">
                {lesson.coverImageUrl ? <img src={lesson.coverImageUrl} alt={lesson.title} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="mt-5 text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">{lesson.level}</div>
              <h3 className="mt-3 text-2xl font-semibold text-white">{lesson.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{lesson.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-[var(--color-text-secondary)]">
                <span>{lesson.duration}</span>
                <span className="text-[var(--color-accent)]">{lesson.accent}</span>
              </div>
              {lesson.price !== undefined && lesson.price !== null ? (
                <div className="mt-3 text-sm text-[var(--color-primary)]">From ₹{lesson.price}</div>
              ) : null}
              <div className="mt-5">
                <Button variant="outline" size="sm" onClick={() => navigateTo(`/lessons/${lesson.slug}`)} className="w-full">
                  View details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
