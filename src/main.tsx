import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App.tsx'

/** Avoid native restoration fighting SPA route scroll + anchoring (jitter on some pages). */
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}
import '@/index.css'
import { SitePreferencesProvider } from '@/context/site-preferences-provider'
import { ThemeProvider } from '@/context/theme-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SitePreferencesProvider>
        <App />
      </SitePreferencesProvider>
    </ThemeProvider>
  </StrictMode>,
)
