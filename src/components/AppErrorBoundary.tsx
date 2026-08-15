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
    // Keep diagnostics in console while showing a polished fallback UI.
    console.error('Unhandled runtime error in public app', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-[var(--container-md)] flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="text-3xl font-semibold text-white">Something went wrong</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
            We could not render this page right now. Please refresh and try again.
          </p>
          <button
            type="button"
            className="mt-8 rounded-full border border-white/20 px-5 py-2.5 text-sm text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
