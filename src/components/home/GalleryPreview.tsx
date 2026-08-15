import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Badge from '../Badge'
import Card from '../Card'
import { fetchGalleryItems, type GalleryPublicItem } from '../../services/gallery.service'

export default function GalleryPreview() {
  const [featuredItems, setFeaturedItems] = useState<GalleryPublicItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchGalleryItems()
      .then((items) => {
        if (!cancelled) {
          setFeaturedItems(items.filter((item) => item.featured).slice(0, 3))
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[40rem]">
            <Badge tone="accent">Moments worth remembering</Badge>
            <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.4rem)] font-[var(--font-semibold)] leading-[1.1] tracking-[var(--letter-tight)] text-[var(--color-text)]">
              A visual story of the coast, the waves, and the people who love it.
            </h2>
          </div>
          <p className="max-w-[32rem] text-base leading-8 text-[var(--color-text-secondary)]">
            The gallery experience is designed to feel cinematic, atmospheric, and inviting as we replace placeholders with real surf photography.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {loading ? (
            <p className="text-sm text-[var(--color-text-secondary)]">Loading gallery preview...</p>
          ) : error ? (
            <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p>
          ) : featuredItems.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">No featured gallery images are available yet.</p>
          ) : (
            featuredItems.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.08 }} whileHover={{ y: -6, scale: 1.01 }}>
                <Card variant="image" className="overflow-hidden border-white/15 p-0">
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                    <img src={item.imageUrl} alt={item.altText} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">Captured moments from recent coastal sessions and gallery highlights.</p>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
