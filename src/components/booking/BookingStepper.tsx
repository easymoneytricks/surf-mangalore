import type { BookingStep, BookingStepConfig } from '../../types/booking'

type BookingStepperProps = {
  steps: BookingStepConfig[]
  currentStep: Exclude<BookingStep, 'success'>
}

export default function BookingStepper({ steps, currentStep }: BookingStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <nav aria-label="Booking progress" className="rounded-[1.5rem] border border-white/12 bg-white/6 p-4 backdrop-blur-xl sm:p-5">
      <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex

          return (
            <li key={step.id} className={`rounded-xl border px-3 py-3 transition ${isCurrent ? 'border-[var(--color-primary)]/45 bg-[var(--color-primary)]/10' : isComplete ? 'border-emerald-400/25 bg-emerald-400/10' : 'border-white/10 bg-white/5'}`} aria-current={isCurrent ? 'step' : undefined}>
              <p className={`text-[0.68rem] uppercase tracking-[0.24em] ${isCurrent ? 'text-[var(--color-primary)]' : isComplete ? 'text-emerald-300' : 'text-[var(--color-text-secondary)]'}`}>
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{step.label}</p>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
