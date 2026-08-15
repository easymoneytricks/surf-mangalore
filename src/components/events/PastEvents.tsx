import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { pastEventMoments } from '../../data/events'

export default function PastEvents() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="max-w-[42rem]">
          <Badge tone="accent">Past event memories</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            A social proof gallery that shows the atmosphere people return for.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
            This section is structured so real event photography can slot in later without changing the layout or content model.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {pastEventMoments.map((moment, index) => (
            <motion.div key={moment.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }} whileHover={{ y: -6, scale: 1.01 }}>
              <Card variant="image" className="overflow-hidden border-white/15 p-0">
                <div className={`relative aspect-[4/5] bg-cover bg-center ${moment.image}`}>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,27,0.08),rgba(4,19,27,0.78))]" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white">{moment.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">A captured moment from the event archive, ready to be replaced with real photography.</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
