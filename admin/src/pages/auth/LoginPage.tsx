import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PrimaryButton, TextInput } from '../../components/admin'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, bootstrapError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const redirectPath = (location.state as { from?: string } | null)?.from || '/dashboard'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      setError(null)
      await login(email, password)
      navigate(redirectPath, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(122,214,209,0.2),transparent_45%),linear-gradient(180deg,#06131c,#0a1f2d)] px-4 py-8 text-(--color-text) sm:py-12">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/12 bg-[rgba(9,30,42,0.72)] shadow-[var(--admin-shadow-2)] backdrop-blur-xl lg:grid-cols-2">
        <section className="relative overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-(--color-primary)/20 bg-(--color-primary)/8 blur-2xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--color-primary)">Surf Mangalore</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Admin Panel</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-(--color-text-secondary)">Manage bookings, experiences, events, website content, and customer enquiries from one place.</p>
            <div className="relative mt-10 h-36 overflow-hidden rounded-3xl border border-white/10 bg-[#061923]" aria-hidden="true">
              <svg viewBox="0 0 640 220" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="presentation">
                <defs>
                  <linearGradient id="login-horizon" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#0d3c4b" stopOpacity="0.1" />
                    <stop offset="0.5" stopColor="#7ad6d1" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#0d3c4b" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="login-wave" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#2f8992" stopOpacity="0.48" />
                    <stop offset="1" stopColor="#0b2f3c" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="login-wave-deep" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#175a6b" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#04131b" stopOpacity="0.82" />
                  </linearGradient>
                </defs>
                <circle cx="500" cy="54" r="19" fill="#7ad6d1" fillOpacity="0.7" />
                <path d="M0 88C120 66 190 104 292 86S470 56 640 82" fill="none" stroke="url(#login-horizon)" strokeWidth="3" />
                <path d="M0 126C108 86 174 122 270 111C366 100 435 66 640 112V220H0Z" fill="url(#login-wave)" />
                <path d="M0 157C112 125 185 166 294 145C411 122 493 112 640 143V220H0Z" fill="url(#login-wave-deep)" />
                <path d="M0 156C106 126 185 167 294 145C410 122 500 112 640 143" fill="none" stroke="#7ad6d1" strokeOpacity="0.45" strokeWidth="2" />
                <path d="M360 154c18-14 37-14 55 0l-27 4Z" fill="#d9f7f3" fillOpacity="0.62" />
                <path d="M387 157v30" stroke="#d9f7f3" strokeOpacity="0.42" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 p-7 sm:p-8 lg:border-l lg:border-t-0 lg:p-12">
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-(--color-text-secondary)">Sign in to your Surf Mangalore admin account.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <TextInput label="Email address" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
            <div className="relative"><TextInput label="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="pr-12" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-7 flex h-9 w-9 items-center justify-center rounded-lg text-(--color-text-secondary) hover:text-(--color-text)">{showPassword ? '◉' : '◌'}</button></div>

            {bootstrapError ? <p className="rounded-xl border border-amber-300/40 bg-amber-300/12 px-3 py-2 text-sm text-amber-100">{bootstrapError}</p> : null}
            {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/12 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

            <PrimaryButton type="submit" disabled={submitting} className="w-full">{submitting ? 'Signing in...' : 'Sign in'}</PrimaryButton>
          </form>
          <p className="mt-6 text-center text-xs text-(--color-text-secondary)">Authorized access only.</p>
        </section>
      </div>
    </main>
  )
}
