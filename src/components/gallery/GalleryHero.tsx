import { motion } from 'framer-motion'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import { navigateTo } from '../../utils/navigation'

export default function GalleryHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(5,21,31,0.98),rgba(8,32,46,0.92))] px-5 py-6 shadow-[0_40px_100px_rgba(4,19,27,0.34)] sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
      <div className="absolute inset-0 overflow-hidden rounded-[2.4rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,143,74,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,16,23,0.98),rgba(5,22,31,0.82),rgba(10,39,54,0.3))]" />
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge tone="accent">Visual storytelling</Badge>
          <h1 className="mt-5 max-w-[11ch] font-[var(--font-heading)] text-[clamp(2.7rem,5vw,5rem)] font-[var(--font-display)] leading-[0.88] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            See the coast and feel the pull to be there.
          </h1>
          <p className="mt-6 max-w-[36rem] text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
            Ocean light, shared energy, and moments that make the surfing lifestyle feel tangible. This gallery is designed to sell the feeling before it sells the session.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" onClick={() => navigateTo('/experiences')}>
              Explore experiences
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigateTo('/contact')}>
              Book a surf day
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
          <Card variant="image" className="overflow-hidden border-white/15 p-0">
            <div className="relative aspect-[4/5] bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16)),url('/images/placeholders/ocean.svg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.08),rgba(4,19,27,0.8))]" />
              <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[rgba(4,19,27,0.46)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-white backdrop-blur-lg">
                Ocean lifestyle
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/12 bg-[rgba(4,19,27,0.6)] p-5 backdrop-blur-xl">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">What the gallery promises</p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                  A premium visual journey that shows surf sessions, people, training, events, and the atmosphere that surrounds the brand.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
