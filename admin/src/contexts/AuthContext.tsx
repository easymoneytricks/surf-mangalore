import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService, type AuthUser } from '../services/auth.service'
import { ApiRequestError, clearAccessToken, setAccessToken } from '../services/http'

type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  loading: boolean
  bootstrapError: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [bootstrapError, setBootstrapError] = useState<string | null>(null)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const result = await authService.refresh()
        setAccessToken(result.accessToken)
        setUser(result.user)
        setBootstrapError(null)
      } catch (error) {
        if (error instanceof ApiRequestError && error.statusCode === 401) {
          clearAccessToken()
          setUser(null)
          setBootstrapError(null)
        } else if (error instanceof Error) {
          setBootstrapError(error.message || 'Unable to restore your session. Please sign in again.')
        } else {
          setBootstrapError('Unable to restore your session. Please sign in again.')
        }
      } finally {
        setLoading(false)
      }
    }

    void bootstrap()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      loading,
      bootstrapError,
      login: async (email: string, password: string) => {
        setBootstrapError(null)
        const result = await authService.login(email, password)
        setAccessToken(result.accessToken)
        setUser(result.user)
      },
      logout: async () => {
        try {
          await authService.logout()
        } finally {
          clearAccessToken()
          setUser(null)
          setBootstrapError(null)
        }
      },
    }),
    [user, loading, bootstrapError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
