import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { DEFAULT_WEBSITE_SETTINGS } from '../constants/settings'
import { settingsService } from '../services/settings.service'
import { type WebsiteSettings } from '../types/settings'

type WebsiteSettingsContextValue = {
  settings: WebsiteSettings
  loading: boolean
}

const WebsiteSettingsContext = createContext<WebsiteSettingsContextValue>({
  settings: DEFAULT_WEBSITE_SETTINGS,
  loading: true,
})

export function WebsiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const next = await settingsService.getWebsiteSettings()
      setSettings(next)
      setLoading(false)
    }

    void load()
  }, [])

  const value = useMemo(
    () => ({ settings, loading }),
    [settings, loading],
  )

  return (
    <WebsiteSettingsContext.Provider value={value}>
      {children}
    </WebsiteSettingsContext.Provider>
  )
}

export function useWebsiteSettings() {
  return useContext(WebsiteSettingsContext)
}
