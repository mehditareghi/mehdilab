import { motion, useReducedMotion } from 'motion/react'

import { useSitePreferences } from '@/hooks/use-site-preferences'
import { ACCENT_HUE_DEFAULTS } from '@/lib/site-preferences'
import { cn } from '@/lib/utils'

type GradientFieldProps = {
  className?: string
}

export function GradientField({ className }: GradientFieldProps) {
  const { preferences } = useSitePreferences()
  const reduceMotion = useReducedMotion()
  const still = reduceMotion === true
  const defaults = ACCENT_HUE_DEFAULTS[preferences.accent]

  return (
    <div
      className={cn(
        'relative isolate min-h-[min(70vh,560px)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] contain-[layout]',
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="absolute -left-[20%] top-[-30%] h-[90%] w-[90%] will-change-transform rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, hsl(${defaults.orbA} 65% 58%) 0%, transparent 62%)`,
        }}
        animate={
          still
            ? { x: 0, y: 0, scale: 1 }
            : { x: [0, 48, 0], y: [0, 36, 0], scale: [1, 1.06, 1] }
        }
        transition={{
          duration: 6,
          repeat: still ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-[25%] -right-[15%] h-[85%] w-[85%] will-change-transform rounded-full opacity-90 blur-3xl dark:opacity-75"
        style={{
          background: `radial-gradient(circle, hsl(${defaults.orbB} 55% 52%) 0%, transparent 60%)`,
        }}
        animate={
          still
            ? { x: 0, y: 0, scale: 1 }
            : { x: [0, -40, 0], y: [0, -28, 0], scale: [1, 1.05, 1] }
        }
        transition={{
          duration: 7,
          repeat: still ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--slate-1),transparent_40%,var(--slate-1))] opacity-82"
      />
      <div className="relative z-10 flex min-h-[min(70vh,560px)] flex-col justify-end p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Ambient / motion
        </p>
        <h2 className="mt-2 max-w-lg text-2xl font-semibold tracking-tight">
          Gradient drift
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          Layered blurs loop on soft paths (Motion). The lab version adds sliders — same
          idea, no WebGL required.
        </p>
      </div>
    </div>
  )
}
