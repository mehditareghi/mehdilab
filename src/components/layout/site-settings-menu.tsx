import { Popover } from 'radix-ui'
import { RotateCcw } from 'lucide-react'

import { Settings2 } from '@/components/animate-ui/icons/settings-2'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSitePreferences } from '@/hooks/use-site-preferences'
import {
  ACCENT_IDS,
  FONT_SCALE_IDS,
  RADIUS_IDS,
  type AccentId,
  type FontScaleId,
  type RadiusId,
} from '@/lib/site-preferences'
import { cn } from '@/lib/utils'

const ACCENT_LABEL: Record<AccentId, string> = {
  violet: 'Violet',
  blue: 'Blue',
  grass: 'Grass',
  orange: 'Orange',
  crimson: 'Crimson',
  iris: 'Iris',
}

const RADIUS_LABEL: Record<RadiusId, string> = {
  tight: 'Tight',
  default: 'Default',
  round: 'Round',
}

const FONT_LABEL: Record<FontScaleId, string> = {
  compact: 'Compact',
  default: 'Default',
  comfortable: 'Comfortable',
}

function SegmentedRow<T extends string>({
  label,
  options,
  value,
  onChange,
  getLabel,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  getLabel: (v: T) => string
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[var(--muted-foreground)]">{label}</p>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={cn(
              'rounded-[min(var(--radius-md),10px)] border px-2 py-1.5 text-center text-xs font-medium transition-colors',
              value === opt
                ? 'border-[var(--primary)] bg-[var(--accent)] text-[var(--foreground)]'
                : 'border-[var(--border)] bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
            )}
          >
            {getLabel(opt)}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SiteSettingsMenu() {
  const { preferences, setAccent, setRadius, setFontScale, resetPreferences } =
    useSitePreferences()

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Site appearance settings"
        >
          <Settings2 size={16} animateOnHover="default" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="end"
          className="z-50 w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border border-[var(--border)] bg-[var(--popover)] p-4 text-[var(--popover-foreground)] shadow-lg outline-none"
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold">Appearance</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Accent, corners, and type size apply across the site.
            </p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <p className="text-xs font-medium text-[var(--muted-foreground)]">Accent</p>
            <div className="grid grid-cols-3 gap-2">
              {ACCENT_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAccent(id)}
                  aria-pressed={preferences.accent === id}
                  aria-label={`Accent ${ACCENT_LABEL[id]}`}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-[min(var(--radius-md),10px)] border p-2 transition-colors',
                    preferences.accent === id
                      ? 'border-[var(--primary)] bg-[var(--accent)]'
                      : 'border-[var(--border)] hover:bg-[var(--muted)]',
                  )}
                >
                  <span
                    className="size-7 rounded-full border border-[color-mix(in_oklab,var(--foreground)_12%,transparent)] shadow-inner"
                    style={{ background: `var(--${id}-9)` }}
                  />
                  <span className="text-[0.65rem] font-medium text-[var(--foreground)]">
                    {ACCENT_LABEL[id]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <SegmentedRow
            label="Corner radius"
            options={RADIUS_IDS}
            value={preferences.radius}
            onChange={setRadius}
            getLabel={(r) => RADIUS_LABEL[r]}
          />

          <Separator className="my-4" />

          <SegmentedRow
            label="Text size"
            options={FONT_SCALE_IDS}
            value={preferences.fontScale}
            onChange={setFontScale}
            getLabel={(f) => FONT_LABEL[f]}
          />

          <Separator className="my-4" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-[var(--muted-foreground)]"
            onClick={resetPreferences}
          >
            <RotateCcw className="size-3.5" />
            Reset to defaults
          </Button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
