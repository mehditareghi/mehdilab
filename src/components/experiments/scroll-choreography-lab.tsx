import { useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { CodeBlock } from '@/components/lab/code-block'
import { ExperimentPanel } from '@/components/lab/experiment-panel'
import { LabSlider } from '@/components/lab/lab-slider'
import { useCodeRangeFlash } from '@/hooks/use-code-range-flash'
import type { CodeHighlightRange } from '@/lib/code-block-range-highlight'
import { cn } from '@/lib/utils'

const VIEWPORT_H = 520

type ChoreographyParams = {
  scrollDistance: number
  backShift: number
  midShift: number
  frontShift: number
  rotateMax: number
  scaleRange: number
}

function buildScrollChoreographyCodeLines(p: ChoreographyParams): string[] {
  const { scrollDistance, backShift, midShift, frontShift, rotateMax, scaleRange } = p
  const sd = String(scrollDistance)
  const scaleEnd = (1 + scaleRange).toFixed(2)
  return [
    "import { useRef } from 'react'",
    "import { motion, useScroll, useTransform } from 'motion/react'",
    '',
    `const VIEWPORT_H = ${VIEWPORT_H}`,
    '',
    'export function ScrollChoreographyExample() {',
    '  const scrollRef = useRef<HTMLDivElement>(null)',
    '  const trackRef = useRef<HTMLDivElement>(null)',
    '',
    `  const scrollDistance = ${sd}`,
    `  const trackMinHeight = VIEWPORT_H + scrollDistance`,
    '',
    '  const { scrollYProgress } = useScroll({',
    '    target: trackRef,',
    '    container: scrollRef,',
    "    offset: ['start start', 'end end'],",
    '  })',
    '',
    `  const yBack = useTransform(scrollYProgress, [0, 1], [0, ${backShift}])`,
    `  const yMid = useTransform(scrollYProgress, [0, 1], [0, ${midShift}])`,
    `  const yFront = useTransform(scrollYProgress, [0, 1], [0, ${frontShift}])`,
    `  const rotate = useTransform(scrollYProgress, [0, 1], [0, ${rotateMax}])`,
    `  const scale = useTransform(scrollYProgress, [0, 1], [1, ${scaleEnd}])`,
    '  const fadeMid = useTransform(scrollYProgress, [0, 0.45, 1], [0.35, 0.75, 1])',
    '',
    '  return (',
    '    <motion.div',
    '      ref={scrollRef}',
    '      layoutScroll',
    `      style={{ height: VIEWPORT_H }}`,
    '      className="overflow-y-auto rounded-xl border"',
    '    >',
    '      <div ref={trackRef} style={{ minHeight: trackMinHeight }} className="relative">',
    '        <div',
    '          className="sticky top-0 overflow-hidden rounded-[inherit] bg-background/90"',
    `          style={{ height: VIEWPORT_H }}`,
    '        >',
    '          <motion.div style={{ y: yBack }} className="absolute inset-0 blur-3xl" />',
    '          <motion.div style={{ y: yMid, opacity: fadeMid }} className="absolute blur-2xl" />',
    '          <motion.div',
    '            style={{ y: yFront, rotate, scale }}',
    '            className="relative z-10 rounded-xl border bg-card p-4"',
    '          >',
    '            Focus card',
    '          </motion.div>',
    '        </div>',
    '      </div>',
    '    </motion.div>',
    '  )',
    '}',
  ]
}

function flashValueInLine(
  lines: string[],
  linePredicate: (line: string) => boolean,
  valueText: string,
): CodeHighlightRange[] {
  const idx = lines.findIndex(linePredicate)
  if (idx < 0) return []
  const line = lines[idx]
  const start = line.indexOf(valueText)
  if (start < 0) return []
  return [{ line: idx + 1, start, end: start + valueText.length }]
}

export function ScrollChoreographyLab() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { highlightRanges, flashRanges } = useCodeRangeFlash()

  const [scrollDistance, setScrollDistance] = useState(1600)
  const [backShift, setBackShift] = useState(-140)
  const [midShift, setMidShift] = useState(-72)
  const [frontShift, setFrontShift] = useState(-28)
  const [rotateMax, setRotateMax] = useState(12)
  const [scaleRange, setScaleRange] = useState(0.08)

  const trackMinHeight = VIEWPORT_H + scrollDistance

  const { scrollYProgress } = useScroll({
    target: trackRef,
    container: scrollRef,
    offset: ['start start', 'end end'],
  })

  const yBack = useTransform(scrollYProgress, [0, 1], [0, backShift])
  const yMid = useTransform(scrollYProgress, [0, 1], [0, midShift])
  const yFront = useTransform(scrollYProgress, [0, 1], [0, frontShift])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, rotateMax])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 + scaleRange])
  const fadeMid = useTransform(scrollYProgress, [0, 0.45, 1], [0.35, 0.75, 1])

  const params: ChoreographyParams = {
    scrollDistance,
    backShift,
    midShift,
    frontShift,
    rotateMax,
    scaleRange,
  }

  const codeLines = useMemo(
    () =>
      buildScrollChoreographyCodeLines({
        scrollDistance,
        backShift,
        midShift,
        frontShift,
        rotateMax,
        scaleRange,
      }),
    [scrollDistance, backShift, midShift, frontShift, rotateMax, scaleRange],
  )

  const code = codeLines.join('\n')

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-[1fr_300px] lg:items-start">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground lg:col-start-1 lg:row-start-1">
          Preview — scroll inside the frame
        </p>
        <motion.div
          ref={scrollRef}
          layoutScroll
          className={cn(
            'touch-pan-y overflow-y-auto overscroll-contain rounded-[var(--radius-lg)] border border-border bg-muted/30',
            'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]',
            'lg:col-start-1 lg:row-start-2',
          )}
          style={{ height: VIEWPORT_H }}
        >
            <div
              ref={trackRef}
              className="relative"
              style={{ minHeight: trackMinHeight }}
            >
              <div
                className="sticky top-0 flex flex-col overflow-hidden rounded-[inherit] bg-[color-mix(in_oklab,var(--background)_88%,transparent)]"
                style={{ height: VIEWPORT_H }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--primary)_0%,transparent_55%)] opacity-40" />

                <motion.div
                  className="absolute -left-[20%] top-[8%] h-[70%] w-[70%] rounded-full bg-[color-mix(in_oklab,var(--primary)_35%,transparent)] blur-3xl"
                  style={{ y: yBack }}
                />
                <motion.div
                  className="absolute -right-[15%] bottom-[5%] h-[55%] w-[55%] rounded-full bg-[color-mix(in_oklab,var(--accent)_40%,transparent)] blur-2xl"
                  style={{ y: yMid, opacity: fadeMid }}
                />

                <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Scroll progress → motion
                    </p>
                    <h2 className="mt-2 max-w-md text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      Layered depth without keyframes
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                      Same timeline drives parallax, tilt, and scale — useful for hero sections and
                      product storytelling. Tune the panel, then copy the pattern.
                    </p>
                  </div>

                  <motion.div
                    className="mt-6 rounded-xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5"
                    style={{ y: yFront, rotate, scale }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-foreground">Focus card</span>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        scrollYProgress
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Moves on a slower curve than the background — that separation reads as depth.
                    </p>
                  </motion.div>
                </div>

                <div
                  className="pointer-events-none absolute bottom-4 left-1/2 h-8 w-px -translate-x-1/2 bg-gradient-to-t from-transparent via-border to-transparent"
                  aria-hidden
                />
              </div>
            </div>
        </motion.div>
        <p className="text-[11px] text-muted-foreground lg:col-start-1 lg:row-start-3">
          Tip: use a tall track + sticky stage so motion plays across a long scroll range without
          stretching the whole page.
        </p>

        <ExperimentPanel
          title="Choreography"
          description="Parallax depth, rotation, and scale — all from one scroll timeline."
          className="lg:sticky lg:top-24 lg:col-start-2 lg:row-start-2"
        >
          <LabSlider
            id="sc-scroll-distance"
            label="Scroll runway (px)"
            value={scrollDistance}
            min={600}
            max={3200}
            step={50}
            onChange={(v) => {
              const next = Math.round(v)
              setScrollDistance(next)
              const fresh = buildScrollChoreographyCodeLines({ ...params, scrollDistance: next })
              flashRanges(
                flashValueInLine(fresh, (l) => l.includes('const scrollDistance ='), String(next)),
              )
            }}
            format={(v) => `${Math.round(v)}px`}
          />
          <p className="text-[11px] leading-snug text-muted-foreground">
            More runway = slower, more controllable motion for the same visual travel.
          </p>

          <LabSlider
            id="sc-back"
            label="Background drift (px)"
            value={backShift}
            min={-220}
            max={0}
            onChange={(v) => {
              const next = Math.round(v)
              setBackShift(next)
              const fresh = buildScrollChoreographyCodeLines({ ...params, backShift: next })
              flashRanges(flashValueInLine(fresh, (l) => l.includes('const yBack'), String(next)))
            }}
            format={(v) => `${Math.round(v)}px`}
          />
          <LabSlider
            id="sc-mid"
            label="Mid layer drift (px)"
            value={midShift}
            min={-180}
            max={0}
            onChange={(v) => {
              const next = Math.round(v)
              setMidShift(next)
              const fresh = buildScrollChoreographyCodeLines({ ...params, midShift: next })
              flashRanges(flashValueInLine(fresh, (l) => l.includes('const yMid'), String(next)))
            }}
            format={(v) => `${Math.round(v)}px`}
          />
          <LabSlider
            id="sc-front"
            label="Card lift (px)"
            value={frontShift}
            min={-80}
            max={0}
            onChange={(v) => {
              const next = Math.round(v)
              setFrontShift(next)
              const fresh = buildScrollChoreographyCodeLines({ ...params, frontShift: next })
              flashRanges(flashValueInLine(fresh, (l) => l.includes('const yFront'), String(next)))
            }}
            format={(v) => `${Math.round(v)}px`}
          />
          <LabSlider
            id="sc-rotate"
            label="Card max tilt (deg)"
            value={rotateMax}
            min={0}
            max={24}
            onChange={(v) => {
              const next = Math.round(v)
              setRotateMax(next)
              const fresh = buildScrollChoreographyCodeLines({ ...params, rotateMax: next })
              flashRanges(flashValueInLine(fresh, (l) => l.includes('const rotate ='), String(next)))
            }}
            format={(v) => `${Math.round(v)}°`}
          />
          <LabSlider
            id="sc-scale"
            label="Card scale bump"
            value={scaleRange}
            min={0}
            max={0.2}
            step={0.01}
            onChange={(v) => {
              setScaleRange(v)
              const end = (1 + v).toFixed(2)
              const fresh = buildScrollChoreographyCodeLines({ ...params, scaleRange: v })
              flashRanges(flashValueInLine(fresh, (l) => l.includes('const scale ='), end))
            }}
            format={(v) => `+${(v * 100).toFixed(0)}%`}
          />
        </ExperimentPanel>
      </div>

      <CodeBlock
        title="Copy-paste pattern (matches preview + controls)"
        code={code}
        language="tsx"
        highlightRanges={highlightRanges}
      />
    </div>
  )
}
