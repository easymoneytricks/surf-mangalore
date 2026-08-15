type CheckboxInputProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function CheckboxInput({ label, checked, onChange }: CheckboxInputProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-(--color-text)">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  )
}
