import { useEffect, useState } from 'react'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import { fetchExperienceBySlug, type ExperiencePublicDetailModel } from '../services/experiences.service'
import { navigateTo } from '../utils/navigation'

type ExperienceDetailPageProps = {
  slug: string
}

export default function ExperienceDetailPage({ slug }: ExperienceDetailPageProps) {
  const [experience, setExperience] = useState<ExperiencePublicDetailModel | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const bookingUrl = experience
    ? `/booking?${new URLSearchParams({ bookingType: 'EXPERIENCE', selectedItemId: String(experience.id) }).toString()}`
    : '/booking'

  useEffect(() => {
    let cancelled = false

    fetchExperienceBySlug(slug)
      .then((result) => {
        if (!cancelled) {
          setExperience(result)
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
        <p className="text-sm text-[var(--color-text-secondary)]">Loading experience details...</p>
      </section>
    )
  }

  if (error || !experience) {
    return (
      <section className="mx-auto w-full max-w-[var(--container-md)] px-4 py-12 sm:px-6">
        <Card variant="glass" className="border-rose-200/30 p-8 text-center">
          <p className="text-lg font-semibold text-white">Experience not found</p>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{error || 'This experience may no longer be available.'}</p>
          <Button variant="outline" className="mt-6" onClick={() => navigateTo('/experiences')}>Back to experiences</Button>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-4 py-12 sm:px-6 lg:px-14">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_0.75fr]">
        <div>
          <div className="mb-6 rounded-[2rem] overflow-hidden bg-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
            {experience.coverImageUrl ? (
              <img src={experience.coverImageUrl} alt={experience.title} className="h-[320px] w-full object-cover" />
            ) : (
              <div className="flex h-[320px] items-center justify-center bg-slate-800 text-sm text-[var(--color-text-secondary)]">Experience cover unavailable</div>
            )}
          </div>

          <Badge tone="accent">Experience</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{experience.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">{experience.fullDescription || experience.shortDescription || 'A curated surf experience designed for connection, confidence, and coastal adventure.'}</p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Category</p>
              <p className="mt-3 text-lg font-semibold text-white">{experience.category || 'Surf experience'}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Duration</p>
              <p className="mt-3 text-lg font-semibold text-white">{experience.duration || 'Flexible'}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Skill level</p>
              <p className="mt-3 text-lg font-semibold text-white">{experience.difficulty || 'All levels'}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Group size</p>
              <p className="mt-3 text-lg font-semibold text-white">{experience.maxParticipants ? `Up to ${experience.maxParticipants} guests` : 'Flexible group size'}</p>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card variant="feature" className="border-white/12 p-8">
            <div className="text-sm uppercase tracking-[0.32em] text-[var(--color-primary)]">Book this experience</div>
            <p className="mt-4 text-lg font-semibold text-white">Reserve your preferred date and let the coach guide your day.</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">This experience is ready for booking with our public session flow.</p>
            <div className="mt-8 space-y-3">
              {experience.price !== undefined ? (
                <div className="rounded-3xl bg-slate-950/80 p-5 text-white">
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-primary)]">Starting price</p>
                  <p className="mt-2 text-3xl font-semibold">₹{experience.price}</p>
                </div>
              ) : null}
              <Button variant="primary" size="lg" className="w-full" onClick={() => navigateTo(bookingUrl)}>
                Book this experience
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => navigateTo('/experiences')}>
                Back to experiences
              </Button>
            </div>
          </Card>

          <Card variant="glass" className="border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Highlights</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              <li>Premium local guidance with a small-group format.</li>
              <li>Designed for guests who want a memorable surf-day experience.</li>
              <li>Flexible pacing with safety-first ocean coaching.</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}
