import { motion } from 'framer-motion'
import Button from '../Button'
import Badge from '../Badge'
import Card from '../Card'
import { navigateTo } from '../../utils/navigation'
import { useWebsiteSettings } from '../../contexts/WebsiteSettingsContext'

export default function HeroSection() {
  const { settings } = useWebsiteSettings()

  return (
    <section className="relative isolate overflow-hidden rounded-[2.6rem] border border-white/12 bg-[linear-gradient(135deg,rgba(5,21,31,0.98),rgba(8,32,46,0.92))] px-5 py-6 shadow-[0_40px_100px_rgba(4,19,27,0.34)] sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
      <div className="absolute inset-0 overflow-hidden rounded-[2.4rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,143,74,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,16,23,0.98),rgba(5,22,31,0.82),rgba(10,39,54,0.3))]" />
        <div className="absolute left-[-8%] top-[-10%] h-56 w-56 rounded-full bg-[var(--color-primary)]/20 blur-3xl" />
        <div className="absolute bottom-[-12%] right-[-8%] h-72 w-72 rounded-full bg-[var(--color-accent)]/18 blur-3xl" />
      </div>

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col justify-between py-4 sm:py-6 lg:min-h-[36rem] lg:py-8">
          <div>
            <Badge tone="accent" className="mb-5">{settings.homepage.announcementBanner}</Badge>
            <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[var(--color-primary)] sm:text-xs">Ocean · Freedom · Adventure · Luxury</p>
            <h1 className="mt-6 max-w-[10.5ch] font-[var(--font-heading)] text-[clamp(3rem,5.6vw,6rem)] font-[var(--font-display)] leading-[0.82] tracking-[var(--letter-tight)] text-[var(--color-text)] sm:max-w-[11ch]">
              {settings.homepage.heroTitle}
            </h1>
            <p className="mt-6 max-w-[35rem] text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
              {settings.homepage.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="primary" size="lg" onClick={() => navigateTo(settings.homepage.heroCtaButton1Path || '/booking')}>
              {settings.homepage.heroCtaButton1Label}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigateTo(settings.homepage.heroCtaButton2Path || '/gallery')}>
              {settings.homepage.heroCtaButton2Label}
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {['★★★★★', '5000+ Happy Guests', 'Certified Surf Coaches', 'Beginner Friendly'].map((point) => (
              <span key={point} className="rounded-full border border-white/12 bg-white/10 px-3.5 py-2 text-sm text-[var(--color-text-secondary)] backdrop-blur-md">
                {point}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="relative min-h-[24rem] lg:min-h-[36rem]">
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="absolute right-0 top-0 w-[78%]">
            <Card variant="image" className="relative overflow-hidden border-white/15 p-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,214,209,0.24),transparent_30%),linear-gradient(180deg,rgba(4,19,27,0.12),rgba(4,19,27,0.82))]" />
              <div className="relative aspect-[4/5] bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16))] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.16)), url('${settings.homepage.heroBackgroundImageUrl || '/images/placeholders/sunset.svg'}')` }} />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[var(--color-primary)]">Professional surf photography</p>
                <h2 className="mt-2 text-[1.55rem] font-semibold leading-tight text-white">Golden-hour sessions with a cinematic edge.</h2>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="absolute left-0 top-[6%] w-[54%]">
            <Card variant="glass" className="border-white/15 p-4">
              <div className="aspect-[3/4] rounded-[1.15rem] border border-white/10 bg-[linear-gradient(135deg,rgba(122,214,209,0.16),rgba(255,143,74,0.12)),url('/images/placeholders/drone.svg')] bg-cover bg-center" />
              <p className="mt-3 text-[0.72rem] uppercase tracking-[0.32em] text-[var(--color-text-secondary)]">Drone shot</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="absolute bottom-[4%] left-[4%] max-w-[13rem]">
            <Card variant="glass" className="border-white/15 p-4">
              <div className="text-[1.05rem] text-[var(--color-primary)]">★★★★★</div>
              <p className="mt-2 text-base font-semibold text-white">5000+ happy guests</p>
              <p className="mt-1 text-sm leading-7 text-[var(--color-text-secondary)]">Certified surf coaches · beginner friendly · ocean-safe guidance.</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
