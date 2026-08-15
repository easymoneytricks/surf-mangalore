import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import { navigateTo } from '../../utils/navigation'

export default function ExperienceCTA() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <Card variant="feature" className="relative isolate overflow-hidden border-white/12 p-8 shadow-[0_36px_110px_rgba(4,19,27,0.38)] sm:p-10 lg:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(122,214,209,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,143,74,0.14),transparent_34%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge tone="accent">Ready when you are</Badge>
            <h2 className="mt-4 max-w-[14ch] font-[var(--font-heading)] text-[clamp(2rem,3.6vw,3rem)] font-[var(--font-semibold)] leading-[1.02] tracking-[var(--letter-tight)] text-[var(--color-text)]">
              Start with the right session and build from there.
            </h2>
            <p className="mt-4 max-w-[34rem] text-base leading-8 text-[var(--color-text-secondary)]">
              Tell us what you are looking for and we will guide you toward the experience that best fits your confidence, pace, and group style.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" size="lg" onClick={() => navigateTo('/booking')}>
                Start booking
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigateTo('/gallery')}>
                See more coastal moments
              </Button>
            </div>
          </div>

          <Card variant="glass" className="border-white/12 p-6 shadow-[0_22px_60px_rgba(4,19,27,0.26)]">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[var(--color-primary)]">How to begin</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              <p>1. Choose the experience that matches your level and preferred pace.</p>
              <p>2. Reach out and share whether you want private coaching, a group session, or a family-friendly format.</p>
              <p>3. Arrive ready to learn, and we will handle the rest with calm, clear instruction.</p>
            </div>
          </Card>
        </div>
      </Card>
    </section>
  )
}
