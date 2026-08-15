import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ToastTone = 'success' | 'info' | 'warning' | 'danger'

type ToastItem = {
  id: string
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  pushToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function toneClasses(tone: ToastTone) {
  if (tone === 'success') return 'border-emerald-300/45 bg-emerald-500/20 text-emerald-100'
  if (tone === 'warning') return 'border-amber-300/45 bg-amber-500/20 text-amber-100'
  if (tone === 'danger') return 'border-rose-300/45 bg-rose-500/20 text-rose-100'
  return 'border-cyan-300/45 bg-cyan-500/20 text-cyan-100'
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const pushToast = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, message, tone }])

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 2500)
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur-md ${toneClasses(toast.tone)}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
