import { useEffect, useState } from 'react'

import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import { fetchPublicCoachBySlug, type CoachPublicModel } from '../services/coaches.service'
import { navigateTo } from '../utils/navigation'

type CoachProfilePageProps = {
  slug: string
}

export default function CoachProfilePage({ slug }: CoachProfilePageProps) {
  const [coach, setCoach] = useState<CoachPublicModel | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchPublicCoachBySlug(slug)
      .then((result) => {
        if (!cancelled) {
          setCoach(result)
        }
      })
      .catch((fetchError: Error) => {
        if (!cancelled) {
          setError(fetchError.message)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (error) {
    return (
      <section className="mx-auto w-full max-w-[var(--container-md)] px-4 py-12 sm:px-6">
        <Card variant="glass" className="border-rose-200/30 p-8 text-center">
          <p className="text-lg font-semibold text-white">Coach profile is unavailable.</p>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{error}</p>
          <Button variant="outline" className="mt-6" onClick={() => navigateTo('/about')}>Back to About</Button>
        </Card>
      </section>
    )
  }

  if (!coach) {
    return (
      <section className="mx-auto w-full max-w-[var(--container-md)] px-4 py-12 sm:px-6">
        <p className="text-sm text-[var(--color-text-secondary)]">Loading coach profile...</p>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-4 py-12 sm:px-6 lg:py-16">
      <Card variant="feature" className="overflow-hidden border-white/15 p-0">
        <div
          className="relative h-64 bg-cover bg-center sm:h-80"
          style={{
            backgroundImage: coach.coverImageUrl
              ? `linear-gradient(180deg, rgba(4,19,27,0.25), rgba(4,19,27,0.78)), url('${coach.coverImageUrl}')`
              : "linear-gradient(135deg, rgba(122,214,209,0.2), rgba(255,143,74,0.18))",
          }}
        />

        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            {coach.imageUrl ? (
              <img src={coach.imageUrl} alt={coach.name} className="h-28 w-28 rounded-full border border-white/20 object-cover" />
            ) : (
              <div className="h-28 w-28 rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))]" />
            )}

            <div>
              <Badge tone="accent">Coach Profile</Badge>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{coach.name}</h1>
              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--color-primary)]">{coach.role}</p>
            </div>

            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">{coach.bio}</p>
          </div>

          <div className="space-y-5">
            <Card variant="glass" className="border-white/12 p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">Experience</p>
              <p className="mt-2 text-xl font-semibold text-white">{coach.yearsOfExperience ? `${coach.yearsOfExperience}+ years` : 'Local expert instructor'}</p>
            </Card>

            <Card variant="glass" className="border-white/12 p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">Specializations</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                {coach.specialization?.length ? coach.specialization.join(', ') : 'Beginner progression, wave confidence, and ocean safety.'}
              </p>
            </Card>

            <Card variant="glass" className="border-white/12 p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">Connect</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {coach.social?.website ? <Button variant="outline" size="sm" onClick={() => window.open(coach.social?.website, '_blank', 'noopener,noreferrer')}>Website</Button> : null}
                {coach.social?.instagram ? <Button variant="outline" size="sm" onClick={() => window.open(coach.social?.instagram, '_blank', 'noopener,noreferrer')}>Instagram</Button> : null}
                {coach.social?.facebook ? <Button variant="outline" size="sm" onClick={() => window.open(coach.social?.facebook, '_blank', 'noopener,noreferrer')}>Facebook</Button> : null}
              </div>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => navigateTo('/booking')}>Book a Session</Button>
              <Button variant="ghost" onClick={() => navigateTo('/about')}>Back to Coaches</Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
