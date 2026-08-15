import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Badge from '../Badge'
import Card from '../Card'
import { fetchExperiences, type ExperiencePublicModel } from '../../services/experiences.service'

export default function ExperienceComparison() {
  const [experiences, setExperiences] = useState<ExperiencePublicModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchExperiences()
      .then((items) => {
        if (!cancelled) {
          setExperiences(items)
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
      <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <Card variant="feature" className="border-white/12 p-7 sm:p-8">
            <Badge tone="accent">Compare the fit</Badge>
            <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.9rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.06] tracking-[var(--letter-tight)] text-[var(--color-text)]">
              A quick way to find the experience that matches your goals.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
              Instead of making guests decode multiple cards, this section frames the key differences in a format that stays readable as they scroll.
            </p>

            <div className="mt-6 grid gap-3">
              {['Choose by confidence level', 'See support style instantly', 'Compare group size and pace'].map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                  {point}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4">
          {loading ? <p className="text-sm text-[var(--color-text-secondary)]">Loading experience comparison...</p> : null}
          {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
          {!loading && !error && !experiences.length ? <p className="text-sm text-[var(--color-text-secondary)]">There are no published experiences to compare yet.</p> : null}
          {!loading && !error && experiences.map((experience, index) => (
            <motion.div key={experience.title} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }}>
              <Card variant="glass" className="border-white/12 p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">{String(index + 1).padStart(2, '0')} · {experience.skillLevel}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{experience.title}</h3>
                    <p className="mt-2 max-w-[42rem] text-sm leading-7 text-[var(--color-text-secondary)]">{experience.bestFor}</p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{experience.outcome}</p>
                  </div>
                  <div className="grid gap-3 text-sm text-[var(--color-text-secondary)] sm:grid-cols-3 lg:min-w-[24rem]">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Duration</p>
                      <p className="mt-2">{experience.duration}</p>
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Group size</p>
                      <p className="mt-2">{experience.groupSize}</p>
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">Support</p>
                      <p className="mt-2">{experience.support}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
