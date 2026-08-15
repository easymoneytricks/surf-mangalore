import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { aboutImagePlaceholders, aboutStoryParagraphs } from '../../data/about'

export default function OurStory() {
  const founderVisual = aboutImagePlaceholders.find((item) => item.id === 'founders')

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <Badge tone="accent">Our story</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.9rem,3.2vw,2.6rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Built by people who love mornings in the water.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-[var(--color-text-secondary)]">
            {aboutStoryParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4 }}>
          <Card variant="image" className="overflow-hidden border-white/15 p-0">
            <figure className="relative">
              <div role="img" aria-label={founderVisual?.title ?? 'Founders and early days'} className={`aspect-[4/5] bg-cover bg-center ${founderVisual?.imageClass ?? ''}`} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.08),rgba(4,19,27,0.82))]" />
              <figcaption className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/12 bg-[rgba(4,19,27,0.58)] p-4 backdrop-blur-lg">
                <p className="text-lg font-semibold text-white">{founderVisual?.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{founderVisual?.description}</p>
              </figcaption>
            </figure>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
