import Badge from '../Badge'
import Card from '../Card'

type GalleryCategoriesProps = {
  categories: string[]
  activeCategory: string | 'All'
  onSelect: (category: string | 'All') => void
}

export default function GalleryCategories({ categories, activeCategory, onSelect }: GalleryCategoriesProps) {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[42rem]">
            <Badge tone="accent">Gallery filters</Badge>
            <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
              Move through the story by mood, not just by image count.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
              The filters are compact, touch-friendly, and structured so a CMS can add or remove categories later.
            </p>
          </div>

          <Card variant="glass" className="border-white/12 p-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onSelect('All')} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === 'All' ? 'bg-[var(--color-primary)] text-[var(--color-surface)]' : 'text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text)]'}`}>
                All
              </button>
              {categories.map((category) => (
                <button key={category} type="button" onClick={() => onSelect(category)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === category ? 'bg-[var(--color-primary)] text-[var(--color-surface)]' : 'text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text)]'}`}>
                  {category}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
