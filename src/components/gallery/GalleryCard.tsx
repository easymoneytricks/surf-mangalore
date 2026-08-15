import { motion } from 'framer-motion'
import { type GalleryPublicItem } from '../../services/gallery.service'

type GalleryCardProps = {
  item: GalleryPublicItem
  onOpen: (item: GalleryPublicItem) => void
  index: number
}

export default function GalleryCard({ item, onOpen, index }: GalleryCardProps) {
  const frameClass = item.frame === 'landscape'
    ? 'aspect-[5/3]'
    : item.frame === 'portrait'
      ? 'aspect-[4/5]'
      : 'aspect-[4/4.4]'

  return (
    <motion.button
      type="button"
      aria-label={`Open image: ${item.title}`}
      onClick={() => onOpen(item)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group block w-full break-inside-avoid text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
    >
      <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-[var(--color-surface-soft)] shadow-[0_24px_70px_rgba(4,19,27,0.28)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--color-primary)]/30 group-hover:shadow-[0_32px_90px_rgba(4,19,27,0.38)]">
        <div className={`relative ${item.featured ? 'md:aspect-[4/5]' : frameClass}`}>
          <img
            src={item.imageUrl}
            alt={item.altText}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16))]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.02),rgba(4,19,27,0.84))]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[rgba(4,19,27,0.46)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-white backdrop-blur-lg">
            {item.category}
          </div>
          <div className="absolute bottom-5 left-5 right-5 translate-y-1 opacity-95 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="rounded-[1.25rem] border border-white/12 bg-[rgba(4,19,27,0.58)] p-4 shadow-[0_16px_48px_rgba(4,19,27,0.28)] backdrop-blur-xl">
              <p className="text-xl font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
