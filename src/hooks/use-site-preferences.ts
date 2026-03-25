import { useContext } from 'react'

import { SitePreferencesContext } from '@/context/site-preferences-context'

export function useSitePreferences() {
  const ctx = useContext(SitePreferencesContext)
  if (!ctx) {
    throw new Error('useSitePreferences must be used within SitePreferencesProvider')
  }
  return ctx
}
