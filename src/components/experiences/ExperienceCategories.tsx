import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Badge from '../Badge'
import ExperienceCard, { type ExperienceCardModel } from './ExperienceCard'
import { fetchExperiences } from '../../services/experiences.service'

export default function ExperienceCategories() {
  const [experiences, setExperiences] = useState<ExperienceCardModel[]>([])
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
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="max-w-[42rem]">
          <Badge tone="accent">Choose your surf path</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Different experiences, one premium coaching standard.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
            Each option is designed to help the right guest find the right pace, level of support, and kind of progression.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {loading ? <p className="text-sm text-[var(--color-text-secondary)]">Loading experiences...</p> : null}
          {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
          {!loading && !error && !experiences.length ? <p className="text-sm text-[var(--color-text-secondary)]">No experiences are available right now. Please check back soon.</p> : null}
          {!loading && !error && experiences.map((experience, index) => (
            <motion.div key={experience.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
              <ExperienceCard experience={experience} featured={index === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
