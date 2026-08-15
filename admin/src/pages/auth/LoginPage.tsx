import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PrimaryButton, SecondaryButton, TextInput } from '../../components/admin'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, bootstrapError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(122,214,209,0.2),transparent_45%),linear-gradient(180deg,#06131c,#0a1f2d)] px-4 py-10 text-(--color-text)">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="admin-card rounded-3xl border border-white/12 p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-primary)">Surf Mangalore</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Admin CMS Portal</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-(--color-text-secondary)">
            Centralized operations panel for bookings, content modules, media, and publishing controls. Sign in with your admin account to access the live JWT-protected CMS workspace.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Stat title="Modules" value="16" />
            <Stat title="Active Editors" value="8" />
            <Stat title="Pending Reviews" value="24" />
            <Stat title="Published Assets" value="1,274" />
          </div>
        </section>

        <section className="admin-card rounded-3xl border border-white/12 p-7 sm:p-8">
          <h2 className="text-xl font-semibold text-white">Sign in</h2>
          <p className="mt-2 text-sm text-(--color-text-secondary)">Use your admin email and password to continue.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <TextInput label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <TextInput label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />

            {bootstrapError ? <p className="rounded-xl border border-amber-300/40 bg-amber-300/12 px-3 py-2 text-sm text-amber-100">{bootstrapError}</p> : null}
            {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/12 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <PrimaryButton type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</PrimaryButton>
              <SecondaryButton type="button" onClick={() => { setEmail(''); setPassword('') }}>Clear</SecondaryButton>
            </div>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/6 p-4 text-xs leading-6 text-(--color-text-secondary)">
            Access tokens come from the backend API. Refresh tokens stay in secure HTTP-only cookies so protected sessions can be restored without storing passwords in the browser.
          </div>
        </section>
      </div>
    </main>
  )
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/12 bg-white/6 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.12em] text-(--color-text-secondary)">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-white">{value}</p>
    </article>
  )
}
