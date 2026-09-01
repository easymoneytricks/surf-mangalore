import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Badge from '../Badge'
import Card from '../Card'
import { fetchPublicTestimonials, type PublicTestimonial } from '../../services/testimonials.service'

export default function TestimonialsPreview() {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const displayItems = (loading ? Array.from({ length: 3 }) : testimonials.slice(0, 6)) as Array<PublicTestimonial | undefined>

  useEffect(() => {
    fetchPublicTestimonials()
      .then(setTestimonials)
      .catch((fetchError: Error) => {
        setError(fetchError.message)
        setTestimonials([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-4xl border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="max-w-160">
          <Badge tone="accent">Guest stories</Badge>
          <h2 className="mt-4 font-semibold text-[clamp(1.8rem,3.2vw,2.4rem)] leading-[1.1] tracking-tight text-(--color-text)">
            The best proof is how people feel after their session.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {error ? <p className="text-sm text-rose-200">{error}</p> : null}
          {!loading && !error && !testimonials.length ? <p className="text-sm text-[var(--color-text-secondary)]">Guest stories are not available yet.</p> : null}
          {displayItems.map((testimonial, index) => {
            if (!testimonial) {
              return <div key={index} className="h-full rounded-4xl border border-white/15 bg-white/5 p-7" />
            }

            return (
              <motion.div key={testimonial.authorName} className={index >= 3 ? 'hidden sm:block' : undefined} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.07 }} whileHover={{ y: -6, scale: 1.01 }}>
                <Card variant="testimonial" className="h-full border-white/15 p-7">
                  <p className="text-[1.05rem] text-(--color-primary)">★★★★★</p>
                  <p className="mt-4 text-base leading-8 text-(--color-text-secondary)">“{testimonial.quote}”</p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="font-semibold text-white">{testimonial.authorName}</p>
                    <p className="mt-1 text-sm text-(--color-text-secondary)">{testimonial.authorLocation || testimonial.authorEmail || 'Guest'}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
