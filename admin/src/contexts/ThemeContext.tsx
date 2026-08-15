import { createContext, useMemo, useState, type ReactNode } from 'react'

type ThemeMode = 'dark' | 'light'

type ThemeContextValue = {
  mode: ThemeMode
  toggleMode: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark')

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={mode}>{children}</div>
    </ThemeContext.Provider>
  )
}
