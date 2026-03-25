import { motion } from 'motion/react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

type GlassSpotlightProps = {
  className?: string
}

export function GlassSpotlight({ className }: GlassSpotlightProps) {
  const [pos, setPos] = useState({ x: 50, y: 50 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  function handleLeave() {
    setPos({ x: 50, y: 50 })
  }

  return (
    <div
      className={cn(
        'relative flex min-h-[min(70vh,560px)] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]',
        className,
      )}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80 transition-[background] duration-300 dark:opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, var(--glow-spotlight), transparent 55%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,var(--slate-2),transparent_55%)] dark:bg-[linear-gradient(145deg,var(--slate-3),transparent_60%)]"
      />
      <motion.div
        layout
        className="relative z-10 w-[min(100%,420px)] rounded-2xl border border-white/40 bg-white/25 p-8 shadow-[var(--shadow-soft)] backdrop-blur-xl dark:border-white/10 dark:bg-[color-mix(in_oklab,var(--slate-3)_75%,transparent)]"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Lab / interaction
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Glass + light follow
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
          Move the pointer over the canvas. The glow is a radial tied to pointer
          position — a good base for cards, nav shells, or hero panels.
        </p>
      </motion.div>
    </div>
  )
}
