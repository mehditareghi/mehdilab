import { createContext } from 'react'

import type { SitePreferences } from '@/lib/site-preferences'

export type SitePreferencesContextValue = {
  preferences: SitePreferences
  setAccent: (accent: SitePreferences['accent']) => void
  setRadius: (radius: SitePreferences['radius']) => void
  setFontScale: (fontScale: SitePreferences['fontScale']) => void
  resetPreferences: () => void
}

export const SitePreferencesContext =
  createContext<SitePreferencesContextValue | null>(null)
