import { motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import { CodeBlock } from '@/components/lab/code-block'
import { ExperimentPanel } from '@/components/lab/experiment-panel'
import { LabSlider } from '@/components/lab/lab-slider'
import { useCodeRangeFlash } from '@/hooks/use-code-range-flash'
import { useSitePreferences } from '@/hooks/use-site-preferences'
import type { CodeHighlightRange } from '@/lib/code-block-range-highlight'
import { ACCENT_HUE_DEFAULTS } from '@/lib/site-preferences'
import { cn } from '@/lib/utils'

/** Ranges must match the `code` lines built in this file (1-based line, 0-based columns). */
function gfSpeedRanges(speed: number): CodeHighlightRange[] {
  const da = (6 / speed).toFixed(2)
  const db = (7 / speed).toFixed(2)
  const l2 = `const durationA = ${da}`
  const l3 = `const durationB = ${db}`
  const i2 = l2.indexOf(da)
  const i3 = l3.indexOf(db)
  return [
    { line: 2, start: i2, end: i2 + da.length },
    { line: 3, start: i3, end: i3 + db.length },
  ]
}

function gfHueARanges(hueA: number, orbSpread: number): CodeHighlightRange[] {
  const line = `    background: \`radial-gradient(circle, hsl(${hueA} 65% 58%) 0%, transparent ${orbSpread}%)\`,`
  const num = String(hueA)
  const s = line.indexOf(num)
  if (s < 0) return []
  return [{ line: 8, start: s, end: s + num.length }]
}

function gfHueBRanges(hueB: number): CodeHighlightRange[] {
  const line = `    background: \`radial-gradient(circle, hsl(${hueB} 55% 52%) 0%, transparent 60%)\`,`
  const num = String(hueB)
  const s = line.indexOf(num)
  if (s < 0) return []
  return [{ line: 17, start: s, end: s + num.length }]
}

function gfOrbSpreadRanges(hueA: number, orbSpread: number): CodeHighlightRange[] {
  const line = `    background: \`radial-gradient(circle, hsl(${hueA} 65% 58%) 0%, transparent ${orbSpread}%)\`,`
  const pct = String(Math.round(orbSpread))
  const needle = `transparent ${pct}%`
  const i = line.indexOf(needle)
  if (i < 0) return []
  const start = i + 'transparent '.length
  return [{ line: 8, start, end: start + pct.length }]
}

function gfVignetteRanges(vignette: number): CodeHighlightRange[] {
  const op = (vignette / 100).toFixed(2)
  const line = `  style={{ opacity: ${op} }}`
  const needle = `opacity: ${op}`
  const i = line.indexOf(needle)
  if (i < 0) return []
  const start = i + 'opacity: '.length
  return [{ line: 27, start, end: start + op.length }]
}

function hsl(h: number, s: number, l: number) {
  return `hsl(${h} ${s}% ${l}%)`
}

export function GradientFieldLab() {
  const { preferences } = useSitePreferences()
  const defaults = ACCENT_HUE_DEFAULTS[preferences.accent]
  const { highlightRanges, flashRanges } = useCodeRangeFlash()
  const [hueA, setHueA] = useState(defaults.orbA)
  const [hueB, setHueB] = useState(defaults.orbB)
  const [speed, setSpeed] = useState(1)
  const [orbSpread, setOrbSpread] = useState(62)
  const [vignette, setVignette] = useState(82)

  useEffect(() => {
    const d = ACCENT_HUE_DEFAULTS[preferences.accent]
    const id = requestAnimationFrame(() => {
      setHueA(d.orbA)
      setHueB(d.orbB)
    })
    return () => cancelAnimationFrame(id)
  }, [preferences.accent])

  /** Seconds per drift cycle at 1× — kept short so motion reads as “live”, not static. */
  const durationA = 6 / speed
  const durationB = 7 / speed

  const code = useMemo(() => {
    const lines = [
      '// Motion — layered radial orbs (values match sliders above)',
      `const durationA = ${durationA.toFixed(2)}`,
      `const durationB = ${durationB.toFixed(2)}`,
      '',
      '<motion.div',
      '  className="absolute -left-[20%] top-[-30%] h-[90%] w-[90%] rounded-full blur-3xl"',
      '  style={{',
      `    background: \`radial-gradient(circle, hsl(${hueA} 65% 58%) 0%, transparent ${orbSpread}%)\`,`,
      '  }}',
      '  animate={{ x: [0, 48, 0], y: [0, 36, 0], scale: [1, 1.06, 1] }}',
      "  transition={{ duration: durationA, repeat: Infinity, ease: 'easeInOut' }}",
      '/>',
      '',
      '<motion.div',
      '  className="absolute -bottom-[25%] -right-[15%] h-[85%] w-[85%] rounded-full blur-3xl opacity-90"',
      '  style={{',
      `    background: \`radial-gradient(circle, hsl(${hueB} 55% 52%) 0%, transparent 60%)\`,`,
      '  }}',
      '  animate={{ x: [0, -40, 0], y: [0, -28, 0], scale: [1, 1.05, 1] }}',
      "  transition={{ duration: durationB, repeat: Infinity, ease: 'easeInOut' }}",
      '/>',
      '',
      '// Vignette — darkens edges (opacity = strength / 100)',
      '<div',
      '  aria-hidden',
      '  className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--slate-1),transparent_40%,var(--slate-1))]"',
      `  style={{ opacity: ${(vignette / 100).toFixed(2)} }}`,
      '/>',
    ]
    return lines.join('\n')
  }, [hueA, hueB, orbSpread, vignette, durationA, durationB])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <div
          className={cn(
            'relative min-h-[min(55vh,480px)] overflow-hidden rounded-[var(--radius-lg)] border border-border',
          )}
        >
          <motion.div
            key={`orb-a-${speed}`}
            aria-hidden
            className="absolute -left-[20%] top-[-30%] h-[90%] w-[90%] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${hsl(hueA, 65, 58)} 0%, transparent ${orbSpread}%)`,
            }}
            animate={{ x: [0, 48, 0], y: [0, 36, 0], scale: [1, 1.06, 1] }}
            transition={{
              duration: durationA,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            key={`orb-b-${speed}`}
            aria-hidden
            className="absolute -bottom-[25%] -right-[15%] h-[85%] w-[85%] rounded-full opacity-90 blur-3xl dark:opacity-75"
            style={{
              background: `radial-gradient(circle, ${hsl(hueB, 55, 52)} 0%, transparent 60%)`,
            }}
            animate={{ x: [0, -40, 0], y: [0, -28, 0], scale: [1, 1.05, 1] }}
            transition={{
              duration: durationB,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--slate-1),transparent_40%,var(--slate-1))]"
            style={{ opacity: vignette / 100 }}
          />
          <div className="relative z-10 flex min-h-[min(55vh,480px)] flex-col justify-end p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Live preview
            </p>
            <h2 className="mt-2 max-w-lg text-xl font-semibold tracking-tight sm:text-2xl">
              Gradient field
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The orbs loop on slow, soft paths — motion speed shortens that loop (higher is
              faster). Hues, falloff, and vignette update live; the snippet below matches the
              preview.
            </p>
          </div>
        </div>

        <ExperimentPanel
          title="Parameters"
          description="Tweak the scene; preview updates immediately."
          className="lg:sticky lg:top-24"
        >
          <LabSlider
            id="gf-hue-a"
            label="Hue A (front orb)"
            value={hueA}
            min={0}
            max={360}
            onChange={(v) => {
              setHueA(v)
              flashRanges(gfHueARanges(v, orbSpread))
            }}
          />
          <LabSlider
            id="gf-hue-b"
            label="Hue B (back orb)"
            value={hueB}
            min={0}
            max={360}
            onChange={(v) => {
              setHueB(v)
              flashRanges(gfHueBRanges(v))
            }}
          />
          <LabSlider
            id="gf-speed"
            label="Motion speed"
            value={speed}
            min={0.35}
            max={2.2}
            step={0.05}
            onChange={(v) => {
              setSpeed(v)
              flashRanges(gfSpeedRanges(v))
            }}
            format={(v) => `${v.toFixed(2)}×`}
          />
          <LabSlider
            id="gf-spread"
            label="Gradient falloff"
            value={orbSpread}
            min={45}
            max={78}
            onChange={(v) => {
              setOrbSpread(v)
              flashRanges(gfOrbSpreadRanges(hueA, v))
            }}
            format={(v) => `${Math.round(v)}%`}
          />
          <LabSlider
            id="gf-vig"
            label="Vignette strength"
            value={vignette}
            min={55}
            max={95}
            onChange={(v) => {
              setVignette(v)
              flashRanges(gfVignetteRanges(v))
            }}
            format={(v) => `${Math.round(v)}%`}
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
