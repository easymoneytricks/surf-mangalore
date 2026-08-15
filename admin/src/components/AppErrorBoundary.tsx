import { Component, type ErrorInfo, type ReactNode } from 'react'

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Keep diagnostics in console while preserving a graceful UX.
    console.error('Unhandled runtime error in admin app', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-20 text-center text-(--color-text)">
          <h1 className="text-3xl font-semibold text-white">Admin UI error</h1>
          <p className="mt-4 text-sm leading-7 text-(--color-text-secondary)">
            The page crashed unexpectedly. Please reload and sign in again if needed.
          </p>
          <button
            type="button"
            className="mt-8 rounded-full border border-white/15 px-5 py-2.5 text-sm transition hover:border-(--color-primary) hover:text-(--color-primary)"
            onClick={() => window.location.reload()}
          >
            Reload admin
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
