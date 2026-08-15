import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Badge from '../Badge'
import Card from '../Card'
import { fetchPublicFaqs, type PublicFaq } from '../../services/faqs.service'

export default function FAQPreview() {
  const [items, setItems] = useState<PublicFaq[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPublicFaqs()
      .then(setItems)
      .catch((fetchError: Error) => {
        setError(fetchError.message)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (!loading && !items.length) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-2xl">
        <Badge tone="accent">Helpful answers</Badge>
        <h2 className="mt-4 font-semibold text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.08] tracking-tight text-(--color-text)">
          A few things guests usually ask before reaching out.
        </h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {error ? <p className="text-sm text-rose-200">{error}</p> : null}
        {!loading && !error && !items.length ? <p className="text-sm text-(--color-text-secondary)">No published FAQs are available yet.</p> : null}
        {(loading ? Array.from<PublicFaq>({ length: 3 }) : items).map((item, index) => {
          if (!item) {
            return <div key={index} className="h-full rounded-3xl border border-white/12 bg-white/5 p-6" />
          }

          return (
            <motion.div key={item.question} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} whileHover={{ y: -4 }}>
              <Card variant="glass" className="h-full border-white/12 p-6">
                <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-(--color-text-secondary)">{item.answer}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
