import { createContext } from 'react'

type Theme = 'light' | 'dark'

export type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  resolved: Theme
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
