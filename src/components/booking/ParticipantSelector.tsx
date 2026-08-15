import Button from '../Button'
import type { ParticipantConfig } from '../../data/bookingOptions'

type ParticipantSelectorProps = {
  value: number
  config: ParticipantConfig
  error?: string
  onChange: (value: number) => void
}

export default function ParticipantSelector({ value, config, error, onChange }: ParticipantSelectorProps) {
  const decrement = () => onChange(Math.max(config.min, value - 1))
  const increment = () => onChange(Math.min(config.max, value + 1))

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--color-text)]">Number of participants</h2>
      <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">Tell us how many guests are joining so we can allocate the right coaching setup.</p>
      <div className="mt-6 flex max-w-md items-center justify-between rounded-2xl border border-white/12 bg-white/6 p-4">
        <Button variant="outline" size="sm" onClick={decrement} aria-label="Decrease participants">
          -
        </Button>
        <div className="text-center">
          <p className="text-3xl font-semibold text-[var(--color-text)]">{value}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Guests</p>
        </div>
        <Button variant="outline" size="sm" onClick={increment} aria-label="Increase participants">
          +
        </Button>
      </div>
      <p className="mt-3 text-sm text-[var(--color-text-secondary)]">Supported range: {config.min} to {config.max} guests.</p>
      {error ? <p role="alert" className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </div>
  )
}
