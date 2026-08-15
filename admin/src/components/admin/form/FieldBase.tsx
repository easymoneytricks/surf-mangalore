import { type ReactNode } from 'react'

type FieldBaseProps = {
  label: string
  helpText?: string
  validationMessage?: string
  children: ReactNode
}

export default function FieldBase({ label, helpText, validationMessage, children }: FieldBaseProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium tracking-[0.08em] text-(--color-text-secondary) uppercase">{label}</span>
      {children}
      {validationMessage ? <p className="text-xs text-rose-200">{validationMessage}</p> : null}
      {!validationMessage && helpText ? <p className="text-xs text-(--color-text-secondary)">{helpText}</p> : null}
    </label>
  )
}
