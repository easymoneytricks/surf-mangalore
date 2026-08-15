import { useEffect, useState } from 'react'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import { fetchPublicLessonBySlug, type LessonPublicModel } from '../services/lessons.service'
import { navigateTo } from '../utils/navigation'

type LessonDetailPageProps = {
  slug: string
}

export default function LessonDetailPage({ slug }: LessonDetailPageProps) {
  const [lesson, setLesson] = useState<LessonPublicModel | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const bookingUrl = lesson
    ? `/booking?${new URLSearchParams({ bookingType: 'LESSON', selectedItemId: String(lesson.id) }).toString()}`
    : '/booking'

  useEffect(() => {
    let cancelled = false

    fetchPublicLessonBySlug(slug)
      .then((result) => {
        if (!cancelled) {
          setLesson(result)
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
  }, [slug])

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-[var(--container-md)] px-4 py-12 sm:px-6">
        <p className="text-sm text-[var(--color-text-secondary)]">Loading lesson details...</p>
      </section>
    )
  }

  if (error || !lesson) {
    return (
      <section className="mx-auto w-full max-w-[var(--container-md)] px-4 py-12 sm:px-6">
        <Card variant="glass" className="border-rose-200/30 p-8 text-center">
          <p className="text-lg font-semibold text-white">Lesson not found</p>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{error || 'This lesson may no longer be available.'}</p>
          <Button variant="outline" className="mt-6" onClick={() => navigateTo('/lessons')}>Back to lessons</Button>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-4 py-12 sm:px-6 lg:px-14">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr]">
        <div>
          <div className="mb-6 rounded-[2rem] overflow-hidden bg-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
            {lesson.coverImageUrl ? (
              <img src={lesson.coverImageUrl} alt={lesson.title} className="h-[320px] w-full object-cover" />
            ) : (
              <div className="flex h-[320px] items-center justify-center bg-slate-800 text-sm text-[var(--color-text-secondary)]">Lesson cover unavailable</div>
            )}
          </div>

          <Badge tone="accent">Lesson experience</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{lesson.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">{lesson.fullDescription || lesson.shortDescription || 'A guided surf lesson built for clarity, confidence, and meaningful progress on the water.'}</p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Duration</p>
              <p className="mt-3 text-lg font-semibold text-white">{lesson.duration || 'Flexible'}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Skill level</p>
              <p className="mt-3 text-lg font-semibold text-white">{lesson.difficulty || 'All levels'}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Instructor</p>
              <p className="mt-3 text-lg font-semibold text-white">{lesson.instructor || 'Certified surf coach'}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Group size</p>
              <p className="mt-3 text-lg font-semibold text-white">{lesson.maxParticipants ? `Up to ${lesson.maxParticipants} guests` : 'Flexible group size'}</p>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card variant="feature" className="border-white/12 p-8">
            <div className="text-sm uppercase tracking-[0.32em] text-[var(--color-primary)]">Book a lesson</div>
            <p className="mt-4 text-lg font-semibold text-white">Reserve your spot in the next available session.</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">This lesson is available for public booking. Choose a date, time, and let us know your preferences.</p>
            <div className="mt-8 space-y-3">
              {lesson.price !== undefined ? (
                <div className="rounded-3xl bg-slate-950/80 p-5 text-white">
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-primary)]">Starting price</p>
                  <p className="mt-2 text-3xl font-semibold">₹{lesson.price}</p>
                </div>
              ) : null}
              <Button variant="primary" size="lg" className="w-full" onClick={() => navigateTo(bookingUrl)}>
                Book this lesson
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => navigateTo('/lessons')}>
                Back to lessons
              </Button>
            </div>
          </Card>

          <Card variant="glass" className="border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Why choose this session</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              <li>Detailed coach-led instruction for faster progress.</li>
              <li>Small-group pacing with safety-first ocean coaching.</li>
              <li>Ideal for first-time surfers and returning riders.</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}
