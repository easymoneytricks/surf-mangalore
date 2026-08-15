import { type InputHTMLAttributes } from 'react'

import FieldBase from './FieldBase'

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  helpText?: string
  validationMessage?: string
}

export default function TextInput({ label, helpText, validationMessage, className = '', ...props }: TextInputProps) {
  return (
    <FieldBase label={label} helpText={helpText} validationMessage={validationMessage}>
      <input className={`h-10 w-full rounded-xl border border-white/15 bg-white/6 px-3 text-sm text-(--color-text) ${className}`} {...props} />
    </FieldBase>
  )
}
