import GalleryCard from './GalleryCard'
import { type GalleryPublicItem } from '../../services/gallery.service'

type GalleryGridProps = {
  items: GalleryPublicItem[]
  onOpen: (item: GalleryPublicItem) => void
}

export default function GalleryGrid({ items, onOpen }: GalleryGridProps) {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="columns-1 gap-5 md:columns-2 xl:columns-3 [&>*]:mb-5">
          {!items.length ? <p className="text-sm text-[var(--color-text-secondary)]">No gallery images are available yet.</p> : null}
          {items.map((item, index) => (
            <GalleryCard key={item.id} item={item} onOpen={onOpen} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
