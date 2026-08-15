import { Link } from 'react-router-dom'

export default function ForbiddenPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.72rem] uppercase tracking-[0.3em] text-(--color-primary)">403 Unauthorized</p>
      <h1 className="mt-4 text-3xl font-semibold text-(--color-text)">You do not have access to this section.</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-(--color-text-secondary)">
        Your current role does not include the required permission for this page or action.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/dashboard" className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm text-(--color-text)">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}