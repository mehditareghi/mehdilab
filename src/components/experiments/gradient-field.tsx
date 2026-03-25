import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

type GradientFieldProps = {
  className?: string
}

export function GradientField({ className }: GradientFieldProps) {
  const reduceMotion = useReducedMotion()
  const still = reduceMotion === true

  return (
    <div
      className={cn(
        'relative isolate min-h-[min(70vh,560px)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] contain-[layout]',
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="absolute -left-[20%] top-[-30%] h-[90%] w-[90%] will-change-transform rounded-full bg-[radial-gradient(circle,var(--glow-orb-a)_0%,transparent_65%)] opacity-95 blur-3xl dark:opacity-85"
        animate={
          still
            ? { x: 0, y: 0, scale: 1 }
            : { x: [0, 64, 0], y: [0, 44, 0], scale: [1, 1.08, 1] }
        }
        transition={{
          duration: 5.2,
          repeat: still ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-[25%] -right-[15%] h-[85%] w-[85%] will-change-transform rounded-full bg-[radial-gradient(circle,var(--glow-orb-b)_0%,transparent_60%)] opacity-90 blur-3xl dark:opacity-75"
        animate={
          still
            ? { x: 0, y: 0, scale: 1 }
            : { x: [0, -54, 0], y: [0, -36, 0], scale: [1, 1.07, 1] }
        }
        transition={{
          duration: 6.1,
          repeat: still ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--slate-1),transparent_38%,var(--slate-1))] opacity-70 dark:opacity-62"
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
