import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { equipmentItems } from '../../data/experiences'

export default function EquipmentSection() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <Badge tone="accent">Included equipment</Badge>
            <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
              The right gear, prepared before you even step into the water.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
              Every session includes the essentials needed to keep the experience smooth, comfortable, and focused on learning rather than logistics.
            </p>
          </div>

          <div className="grid gap-4">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}>
              <Card variant="image" className="overflow-hidden border-white/15 p-0">
                <div className="aspect-[16/8] bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16)),url('/images/placeholders/surfboard.svg')] bg-cover bg-center" />
              </Card>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              {equipmentItems.map((item, index) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} whileHover={{ y: -4 }}>
                  <Card variant="glass" className="h-full border-white/15 p-5">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{item.description}</p>
                    <p className="mt-4 text-[0.72rem] uppercase tracking-[0.26em] text-[var(--color-primary)]">{item.note}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
