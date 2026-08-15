import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { aboutImagePlaceholders, whyMangalorePoints } from '../../data/about'

export default function WhyMangalore() {
  const beachVisual = aboutImagePlaceholders.find((item) => item.id === 'beach')

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Badge tone="accent">Why surf in Mangalore</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.9rem,3.2vw,2.6rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            A coastline that feels both adventurous and beginner-friendly.
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {whyMangalorePoints.map((point, index) => (
              <motion.div key={point.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }}>
                <Card variant="glass" className="h-full border-white/12 p-5">
                  <h3 className="text-lg font-semibold text-white">{point.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{point.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
          <Card variant="image" className="overflow-hidden border-white/15 p-0">
            <figure className="relative">
              <div role="img" aria-label={beachVisual?.title ?? 'Mangalore coastline'} className={`aspect-[4/5] bg-cover bg-center ${beachVisual?.imageClass ?? ''}`} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.08),rgba(4,19,27,0.8))]" />
              <figcaption className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/12 bg-[rgba(4,19,27,0.58)] p-4 backdrop-blur-lg">
                <p className="text-lg font-semibold text-white">{beachVisual?.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{beachVisual?.description}</p>
              </figcaption>
            </figure>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
