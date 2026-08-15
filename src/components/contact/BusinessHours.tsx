import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { businessHours } from '../../data/contact'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'

export default function BusinessHours() {
  const { settings } = useWebsiteSettings()

  const parsedHours = settings.contact.businessHours
    .map((line) => {
      const [day, ...rest] = line.split(':')
      return {
        day: day.trim(),
        hours: rest.join(':').trim(),
      }
    })
    .filter((item) => item.day && item.hours)

  const hoursToRender = parsedHours.length ? parsedHours : businessHours

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
        <Card variant="feature" className="border-white/12 p-8 shadow-[0_28px_80px_rgba(4,19,27,0.3)] sm:p-10 lg:p-12">
          <Badge tone="accent">Business hours</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            Open around the rhythms of the coast in {settings.contact.businessAddress}.
          </h2>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {hoursToRender.map((item) => (
              <div key={item.day} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4">
                <p className="text-sm font-semibold text-white">{item.day}</p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{item.hours}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </section>
  )
}
