import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { SitePreferencesContext } from '@/context/site-preferences-context'
import {
  DEFAULT_SITE_PREFERENCES,
  SITE_PREFS_STORAGE_KEY,
  applySitePreferencesToRoot,
  loadSitePreferences,
  type SitePreferences,
} from '@/lib/site-preferences'

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<SitePreferences>(() =>
    loadSitePreferences(),
  )

  useLayoutEffect(() => {
    applySitePreferencesToRoot(document.documentElement, preferences)
    try {
      localStorage.setItem(SITE_PREFS_STORAGE_KEY, JSON.stringify(preferences))
    } catch {
      /* ignore quota */
    }
  }, [preferences])

  const setAccent = useCallback((accent: SitePreferences['accent']) => {
    setPreferences((p) => ({ ...p, accent }))
  }, [])

  const setRadius = useCallback((radius: SitePreferences['radius']) => {
    setPreferences((p) => ({ ...p, radius }))
  }, [])

  const setFontScale = useCallback((fontScale: SitePreferences['fontScale']) => {
    setPreferences((p) => ({ ...p, fontScale }))
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_SITE_PREFERENCES)
  }, [])

  const value = useMemo(
    () => ({
      preferences,
      setAccent,
      setRadius,
      setFontScale,
      resetPreferences,
    }),
    [preferences, setAccent, setRadius, setFontScale, resetPreferences],
  )

  return (
    <SitePreferencesContext.Provider value={value}>
      {children}
    </SitePreferencesContext.Provider>
  )
}
