import { type ButtonHTMLAttributes } from 'react'

type DangerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function DangerButton({ className = '', type = 'button', ...props }: DangerButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full border border-rose-300/40 bg-rose-300/15 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-300/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${className}`}
      {...props}
    />
  )
}
