type SwitchInputProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function SwitchInput({ label, checked, onChange }: SwitchInputProps) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-white/15 bg-white/6 px-3 py-2 text-sm text-(--color-text)">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
    </label>
  )
}
