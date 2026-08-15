import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
  }: ButtonProps,
  ref,
) {
  const base = 'inline-flex min-h-11 items-center justify-center rounded-full border font-medium tracking-[0.01em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:pointer-events-none disabled:opacity-60'
  const variants = {
    primary: 'border-transparent bg-[var(--color-primary)] text-[var(--color-surface)] shadow-[0_18px_50px_rgba(122,214,209,0.24)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)] hover:shadow-[0_24px_70px_rgba(122,214,209,0.3)]',
    secondary: 'border-transparent bg-[var(--color-secondary)] text-white hover:-translate-y-0.5 hover:bg-[var(--color-surface-strong)] hover:shadow-[0_20px_60px_rgba(4,19,27,0.28)]',
    ghost: 'border-transparent bg-transparent text-[var(--color-text)] hover:bg-white/10 hover:text-[var(--color-primary)]',
    outline: 'border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-white/6',
  }
  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </button>
  )
})

export default Button
