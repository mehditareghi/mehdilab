import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'

import { CodeBlock } from '@/components/lab/code-block'
import { ExperimentPanel } from '@/components/lab/experiment-panel'
import { LabSlider } from '@/components/lab/lab-slider'
import { useCodeRangeFlash } from '@/hooks/use-code-range-flash'
import { useSitePreferences } from '@/hooks/use-site-preferences'
import type { CodeHighlightRange } from '@/lib/code-block-range-highlight'
import { ACCENT_HUE_DEFAULTS } from '@/lib/site-preferences'
import { cn } from '@/lib/utils'

function gsGlowLine(
  radiusPx: number,
  falloff: number,
  glowOpacity: number,
  hue: number,
) {
  return `const glow = \`radial-gradient(${radiusPx}px circle at \${posRef.current.x}% \${posRef.current.y}%, hsl(${hue} 70% 72% / ${(glowOpacity / 100).toFixed(2)}) 0%, transparent ${falloff}%)\``
}

function gsRadiusRange(
  radiusPx: number,
  falloff: number,
  glowOpacity: number,
  hue: number,
): CodeHighlightRange[] {
  const line = gsGlowLine(radiusPx, falloff, glowOpacity, hue)
  const needle = `${radiusPx}px`
  const i = line.indexOf(needle)
  return [{ line: 5, start: i, end: i + needle.length }]
}

function gsFalloffRange(
  radiusPx: number,
  falloff: number,
  glowOpacity: number,
  hue: number,
): CodeHighlightRange[] {
  const line = gsGlowLine(radiusPx, falloff, glowOpacity, hue)
  const needle = `transparent ${falloff}%`
  const i = line.indexOf(needle)
  const start = i + 'transparent '.length
  return [{ line: 5, start, end: start + String(falloff).length }]
}

function gsHueRange(
  radiusPx: number,
  falloff: number,
  glowOpacity: number,
  hue: number,
): CodeHighlightRange[] {
  const line = gsGlowLine(radiusPx, falloff, glowOpacity, hue)
  const h = String(hue)
  const i = line.indexOf(`hsl(${hue}`)
  const start = i + 4
  return [{ line: 5, start, end: start + h.length }]
}

function gsOpacityRanges(
  radiusPx: number,
  falloff: number,
  glowOpacity: number,
  hue: number,
): CodeHighlightRange[] {
  const op = (glowOpacity / 100).toFixed(2)
  const line5 = gsGlowLine(radiusPx, falloff, glowOpacity, hue)
  const needle5 = `72% / ${op}`
  const i5 = line5.indexOf(needle5)
  const line18 = `  <div ref={glowRef} className="pointer-events-none absolute inset-0" style={{ opacity: ${op} }} />`
  const needle18 = `opacity: ${op}`
  const i18 = line18.indexOf(needle18)
  const ranges: CodeHighlightRange[] = []
  if (i5 >= 0) {
    const start = i5 + '72% / '.length
    ranges.push({ line: 5, start, end: start + op.length })
  }
  if (i18 >= 0) {
    const start = i18 + 'opacity: '.length
    ranges.push({ line: 18, start, end: start + op.length })
  }
  return ranges
}

function gsBlurRange(blurPx: number): CodeHighlightRange[] {
  const line = `  <div style={{ backdropFilter: 'blur(${blurPx}px)' }} className="... rounded-2xl ...">`
  const bx = String(blurPx)
  const needle = `blur(${bx}px)`
  const i = line.indexOf(needle)
  const start = i + 'blur('.length
  return [{ line: 20, start, end: start + bx.length }]
}

export function GlassSpotlightLab() {
  const { preferences } = useSitePreferences()
  const { highlightRanges, flashRanges } = useCodeRangeFlash()
  const [radiusPx, setRadiusPx] = useState(520)
  const [falloff, setFalloff] = useState(55)
  const [glowOpacity, setGlowOpacity] = useState(80)
  const [blurPx, setBlurPx] = useState(20)
  const [hue, setHue] = useState(
    () => ACCENT_HUE_DEFAULTS[preferences.accent].spotlight,
  )

  useEffect(() => {
    const h = ACCENT_HUE_DEFAULTS[preferences.accent].spotlight
    const id = requestAnimationFrame(() => setHue(h))
    return () => cancelAnimationFrame(id)
  }, [preferences.accent])

  const glowRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 50, y: 50 })
  const rafRef = useRef(0)

  const applyGlow = useCallback(() => {
    const el = glowRef.current
    if (!el) return
    const { x, y } = posRef.current
    el.style.opacity = String(glowOpacity / 100)
    el.style.background = `radial-gradient(${radiusPx}px circle at ${x}% ${y}%, hsl(${hue} 70% 72% / ${glowOpacity / 100}), transparent ${falloff}%)`
  }, [radiusPx, falloff, glowOpacity, hue])

  useEffect(() => {
    applyGlow()
  }, [applyGlow])

  const scheduleGlow = useCallback(() => {
    if (rafRef.current !== 0) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      applyGlow()
    })
  }, [applyGlow])

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    posRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
    scheduleGlow()
  }

  function handlePointerLeave() {
    posRef.current = { x: 50, y: 50 }
    scheduleGlow()
  }

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  const code = useMemo(() => {
    const lines = [
      '// Performant: update glow in requestAnimationFrame; avoid setState on pointer move',
      'const posRef = useRef({ x: 50, y: 50 })',
      'const glowRef = useRef<HTMLDivElement>(null)',
      '',
      `const glow = \`radial-gradient(${radiusPx}px circle at \${posRef.current.x}% \${posRef.current.y}%, hsl(${hue} 70% 72% / ${(glowOpacity / 100).toFixed(2)}) 0%, transparent ${falloff}%)\``,
      '',
      'function applyGlow() {',
      '  const el = glowRef.current',
      '  if (!el) return',
      '  const { x, y } = posRef.current',
      '  el.style.background = `radial-gradient(... at ${x}% ${y}%, ...)`',
      '}',
      '',
      'onPointerMove={(e) => {',
      '  ...posRef.current = { x, y }; requestAnimationFrame(applyGlow)',
      '}}',
      '',
      `  <div ref={glowRef} className="pointer-events-none absolute inset-0" style={{ opacity: ${(glowOpacity / 100).toFixed(2)} }} />`,
      '  <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,var(--slate-2),transparent_55%)] dark:bg-[linear-gradient(145deg,var(--slate-3),transparent_60%)]" />',
      `  <div style={{ backdropFilter: 'blur(${blurPx}px)' }} className="... rounded-2xl ...">`,
      '    ...',
      '  </div>',
    ]
    return lines.join('\n')
  }, [radiusPx, falloff, glowOpacity, blurPx, hue])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <div
          className={cn(
            'relative isolate flex min-h-[min(55vh,480px)] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-border',
            '[contain:paint]',
          )}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div
            ref={glowRef}
            aria-hidden
            className="pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,var(--slate-2),transparent_55%)] dark:bg-[linear-gradient(145deg,var(--slate-3),transparent_60%)]"
          />
          <div
            className="relative z-10 w-[min(100%,400px)] transform-gpu rounded-2xl border border-white/40 bg-white/25 p-6 shadow-[var(--shadow-soft)] dark:border-white/10 dark:bg-[color-mix(in_oklab,var(--slate-3)_75%,transparent)] sm:p-8"
            style={{
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`,
            }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Glass panel
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Light follows pointer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Glow position updates on{' '}
              <code className="rounded bg-muted px-1 font-mono text-xs">requestAnimationFrame</code>{' '}
              so moving the pointer does not re-render the whole page. Backdrop blur is still
              GPU-heavy — lower the blur slider if this device struggles.
            </p>
          </div>
        </div>

        <ExperimentPanel
          title="Parameters"
          description="Shape the glow and the glass without leaving the page."
          className="lg:sticky lg:top-24"
        >
          <LabSlider
            id="gs-radius"
            label="Spotlight radius"
            value={radiusPx}
            min={280}
            max={720}
            step={10}
            onChange={(v) => {
              setRadiusPx(v)
              flashRanges(gsRadiusRange(v, falloff, glowOpacity, hue))
            }}
            format={(v) => `${Math.round(v)}px`}
          />
          <LabSlider
            id="gs-fall"
            label="Transparent edge"
            value={falloff}
            min={38}
            max={72}
            onChange={(v) => {
              setFalloff(v)
              flashRanges(gsFalloffRange(radiusPx, v, glowOpacity, hue))
            }}
            format={(v) => `${Math.round(v)}%`}
          />
          <LabSlider
            id="gs-op"
            label="Glow layer opacity"
            value={glowOpacity}
            min={35}
            max={100}
            onChange={(v) => {
              setGlowOpacity(v)
              flashRanges(gsOpacityRanges(radiusPx, falloff, v, hue))
            }}
            format={(v) => `${Math.round(v)}%`}
          />
          <LabSlider
            id="gs-blur"
            label="Card backdrop blur"
            value={blurPx}
            min={8}
            max={28}
            onChange={(v) => {
              setBlurPx(v)
              flashRanges(gsBlurRange(v))
            }}
            format={(v) => `${Math.round(v)}px`}
          />
          <p className="text-[11px] leading-snug text-muted-foreground">
            Lower blur reduces GPU cost on the frosted card (main cost after pointer handling).
          </p>
          <LabSlider
            id="gs-hue"
            label="Glow hue"
            value={hue}
            min={0}
            max={360}
            onChange={(v) => {
              setHue(v)
              flashRanges(gsHueRange(radiusPx, falloff, glowOpacity, v))
            }}
            format={(v) => `${Math.round(v)}°`}
          />
        </ExperimentPanel>
      </div>

      <CodeBlock
        title="Snippet (matches controls)"
        code={code}
        language="tsx"
        highlightRanges={highlightRanges}
      />
    </div>
  )
}
