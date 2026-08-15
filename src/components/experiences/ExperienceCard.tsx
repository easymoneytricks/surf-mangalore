import { motion } from 'framer-motion'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import { navigateTo } from '../../utils/navigation'

export type ExperienceCardModel = {
  title: string
  description: string
  duration: string
  skillLevel: string
  groupSize: string
  cta: string
  imageLabel: string
  imageClassName: string
  bestFor: string
  support: string
  outcome: string
  slug: string
}

type ExperienceCardProps = {
  experience: ExperienceCardModel
  featured?: boolean
}

export default function ExperienceCard({ experience, featured = false }: ExperienceCardProps) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25 }} className="h-full">
      <Card variant="feature" className={`flex h-full flex-col overflow-hidden border-white/12 p-0 ${featured ? 'ring-1 ring-[var(--color-primary)]/35' : ''}`}>
        <div className={`relative aspect-[4/3] overflow-hidden ${experience.imageClassName}`}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.1),rgba(4,19,27,0.78))]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[rgba(4,19,27,0.42)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.32em] text-white backdrop-blur-lg">
            {experience.imageLabel}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{experience.skillLevel}</Badge>
            <Badge tone="muted">{experience.duration}</Badge>
          </div>
          <h3 className="mt-4 text-[1.55rem] font-semibold leading-[1.1] text-white">{experience.title}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{experience.description}</p>

          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">Group size</p>
              <p className="mt-2">{experience.groupSize}</p>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">Best for</p>
              <p className="mt-2">{experience.bestFor}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-[var(--color-text-secondary)]">
            <p><span className="text-[var(--color-text)]">Support:</span> {experience.support}</p>
            <p><span className="text-[var(--color-text)]">Outcome:</span> {experience.outcome}</p>
          </div>

          <div className="mt-6">
            <Button variant="outline" size="md" onClick={() => navigateTo(`/experiences/${experience.slug}`)} className="w-full">
              {experience.cta}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
