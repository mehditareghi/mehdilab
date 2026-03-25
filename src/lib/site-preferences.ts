export const SITE_PREFS_STORAGE_KEY = 'mehdi-lab-prefs'

/** Radix palette name (must match @import in index.css) */
export const ACCENT_IDS = [
  'violet',
  'blue',
  'grass',
  'orange',
  'crimson',
  'iris',
] as const

export type AccentId = (typeof ACCENT_IDS)[number]

export const RADIUS_IDS = ['tight', 'default', 'round'] as const
export type RadiusId = (typeof RADIUS_IDS)[number]

export const FONT_SCALE_IDS = ['compact', 'default', 'comfortable'] as const
export type FontScaleId = (typeof FONT_SCALE_IDS)[number]

export type SitePreferences = {
  accent: AccentId
  radius: RadiusId
  fontScale: FontScaleId
}

export const DEFAULT_SITE_PREFERENCES: SitePreferences = {
  accent: 'violet',
  radius: 'default',
  fontScale: 'default',
}

/**
 * Default HSL hues for lab sliders when the user changes site accent (orb / glow demos).
 * Chosen to sit near each Radix palette’s hue range.
 */
export const ACCENT_HUE_DEFAULTS: Record<
  AccentId,
  { orbA: number; orbB: number; spotlight: number }
> = {
  violet: { orbA: 265, orbB: 285, spotlight: 270 },
  blue: { orbA: 215, orbB: 228, spotlight: 220 },
  grass: { orbA: 128, orbB: 142, spotlight: 135 },
  orange: { orbA: 22, orbB: 32, spotlight: 27 },
  crimson: { orbA: 328, orbB: 348, spotlight: 338 },
  iris: { orbA: 248, orbB: 262, spotlight: 255 },
}

/** Applied on <html> when not “default” — matches :root in index.css */
export const RADIUS_REM: Record<Exclude<RadiusId, 'default'>, string> = {
  tight: '0.375rem',
  round: '1rem',
}

/** Multiplier on root font size (browser default × scale) */
export const FONT_SCALE_VALUE: Record<Exclude<FontScaleId, 'default'>, string> = {
  compact: '0.9375',
  comfortable: '1.0625',
}

const ACCENT_CSS_VARS = [
  '--primary',
  '--ring',
  '--accent',
  '--chart-1',
  '--chart-2',
  '--sidebar-primary',
  '--sidebar-ring',
  '--glow-orb-a',
  '--glow-orb-b',
  '--glow-spotlight',
] as const

export function isAccentId(v: unknown): v is AccentId {
  return typeof v === 'string' && ACCENT_IDS.includes(v as AccentId)
}

export function isRadiusId(v: unknown): v is RadiusId {
  return typeof v === 'string' && RADIUS_IDS.includes(v as RadiusId)
}

export function isFontScaleId(v: unknown): v is FontScaleId {
  return typeof v === 'string' && FONT_SCALE_IDS.includes(v as FontScaleId)
}

export function loadSitePreferences(): SitePreferences {
  if (typeof window === 'undefined') return DEFAULT_SITE_PREFERENCES
  try {
    const raw = localStorage.getItem(SITE_PREFS_STORAGE_KEY)
    if (!raw) return DEFAULT_SITE_PREFERENCES
    const parsed = JSON.parse(raw) as Partial<SitePreferences>
    return {
      accent: isAccentId(parsed.accent) ? parsed.accent : DEFAULT_SITE_PREFERENCES.accent,
      radius: isRadiusId(parsed.radius) ? parsed.radius : DEFAULT_SITE_PREFERENCES.radius,
      fontScale: isFontScaleId(parsed.fontScale)
        ? parsed.fontScale
        : DEFAULT_SITE_PREFERENCES.fontScale,
    }
  } catch {
    return DEFAULT_SITE_PREFERENCES
  }
}

/** Map semantic tokens to Radix scale steps for the chosen palette */
export function applyAccentToRoot(root: HTMLElement, accent: AccentId) {
  if (accent === 'violet') {
    for (const name of ACCENT_CSS_VARS) {
      root.style.removeProperty(name)
    }
    return
  }
  const p = accent
  root.style.setProperty('--primary', `var(--${p}-9)`)
  root.style.setProperty('--ring', `var(--${p}-8)`)
  root.style.setProperty('--accent', `var(--${p}-3)`)
  root.style.setProperty('--chart-1', `var(--${p}-9)`)
  root.style.setProperty('--chart-2', `var(--${p}-7)`)
  root.style.setProperty('--sidebar-primary', `var(--${p}-9)`)
  root.style.setProperty('--sidebar-ring', `var(--${p}-8)`)
  root.style.setProperty('--glow-orb-a', `var(--${p}-5)`)
  root.style.setProperty('--glow-orb-b', `var(--${p}-7)`)
  root.style.setProperty('--glow-spotlight', `var(--${p}-4)`)
}

export function applyRadiusToRoot(root: HTMLElement, radius: RadiusId) {
  if (radius === 'default') {
    root.style.removeProperty('--radius')
  } else {
    root.style.setProperty('--radius', RADIUS_REM[radius])
  }
}

export function applyFontScaleToRoot(root: HTMLElement, fontScale: FontScaleId) {
  if (fontScale === 'default') {
    root.style.removeProperty('--font-scale')
  } else {
    root.style.setProperty('--font-scale', FONT_SCALE_VALUE[fontScale])
  }
}

export function applySitePreferencesToRoot(root: HTMLElement, prefs: SitePreferences) {
  applyAccentToRoot(root, prefs.accent)
  applyRadiusToRoot(root, prefs.radius)
  applyFontScaleToRoot(root, prefs.fontScale)
}
