import { type InputHTMLAttributes } from 'react'

import TextInput from './TextInput'

type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  helpText?: string
  validationMessage?: string
}

export default function NumberInput(props: NumberInputProps) {
  return <TextInput type="number" {...props} />
}
