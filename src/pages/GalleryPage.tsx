import { useEffect, useMemo, useState } from 'react'
import GalleryHero from '../components/gallery/GalleryHero'
import GalleryCategories from '../components/gallery/GalleryCategories'
import GalleryGrid from '../components/gallery/GalleryGrid'
import GalleryLightbox from '../components/gallery/GalleryLightbox'
import GalleryCTA from '../components/gallery/GalleryCTA'
import { fetchGalleryCategories, fetchGalleryItems, type GalleryPublicItem } from '../services/gallery.service'

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All')
  const [selectedItem, setSelectedItem] = useState<GalleryPublicItem | null>(null)
  const [items, setItems] = useState<GalleryPublicItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([fetchGalleryItems(), fetchGalleryCategories()])
      .then(([nextItems, albums]) => {
        if (!cancelled) {
          setItems(nextItems)
          setCategories(albums.map((album) => album.name))
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

  const visibleItems = useMemo(() => {
    if (activeCategory === 'All') {
      return items
    }

    return items.filter((item) => item.category === activeCategory)
  }, [activeCategory, items])

  return (
    <main className="w-full">
      <GalleryHero />
      <GalleryCategories categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      {loading ? (
        <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-12 sm:px-8 lg:px-12">
          <p className="text-sm text-[var(--color-text-secondary)]">Loading gallery...</p>
        </section>
      ) : error ? (
        <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-12 sm:px-8 lg:px-12">
          <div className="rounded-[2rem] border border-rose-200/30 bg-rose-900/20 p-8 text-center">
            <p className="text-lg font-semibold text-white">Unable to load gallery</p>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{error}</p>
          </div>
        </section>
      ) : (
        <>
          <GalleryGrid items={visibleItems} onOpen={setSelectedItem} />
          <GalleryCTA />
          <GalleryLightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
        </>
      )}
    </main>
  )
}
