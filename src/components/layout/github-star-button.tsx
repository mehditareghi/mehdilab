import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { SVGProps } from 'react'

import { Button } from '@/components/ui/button'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

function GitHubMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('shrink-0', className)}
      aria-hidden
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
      />
    </svg>
  )
}

function formatStarCount(n: number) {
  if (n >= 10_000) return `${Math.round(n / 1000)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

/**
 * GitHub star CTA aligned with header outline controls.
 * Hover: quick playful wiggle on the mark + soft primary lift/glow.
 * Configure `site.github` in `src/data/site.ts`.
 */
export function GitHubStarButton({ className }: { className?: string }) {
  const github = site.github
  const [stars, setStars] = useState<number | null>(null)
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!github) return
    const { user, repo } = github
    let cancelled = false
    fetch(`https://api.github.com/repos/${user}/${repo}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('stars'))))
      .then((data: { stargazers_count?: number }) => {
        if (
          cancelled ||
          typeof data.stargazers_count !== 'number'
        ) {
          return
        }
        setStars(data.stargazers_count)
      })
      .catch(() => {
        /* optional count */
      })
    return () => {
      cancelled = true
    }
  }, [github])

  if (!github) return null

  const { user, repo } = github
  const href = `https://github.com/${user}/${repo}`

  const iconAnimate =
    hovered && !reduceMotion
      ? { rotate: [0, -22, 16, -10, 0] }
      : { rotate: 0 }

  return (
    <Button
      variant="outline"
      size="default"
      className={cn(
        'h-8 gap-1.5 px-2.5 text-xs font-medium',
        'transition-[border-color,box-shadow,transform,background-color] duration-200',
        'hover:-translate-y-px motion-reduce:hover:translate-y-0',
        'hover:border-[color-mix(in_oklab,var(--primary)_40%,var(--border))]',
        'hover:bg-[color-mix(in_oklab,var(--primary)_6%,var(--background))]',
        'hover:shadow-[0_8px_28px_-12px_color-mix(in_oklab,var(--primary)_35%,transparent),var(--shadow-soft)]',
        'dark:hover:border-[color-mix(in_oklab,var(--primary)_35%,var(--border))]',
        'dark:hover:bg-[color-mix(in_oklab,var(--primary)_10%,var(--background))]',
        className,
      )}
      asChild
    >
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[var(--foreground)]"
        aria-label={`Star ${user}/${repo} on GitHub`}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <motion.span
          className="inline-flex shrink-0 will-change-transform"
          animate={iconAnimate}
          transition={{
            duration: 0.62,
            ease: [0.34, 1.25, 0.64, 1],
            times: [0, 0.22, 0.5, 0.78, 1],
          }}
        >
          <GitHubMark className="size-3.5 text-[var(--primary)]" />
        </motion.span>
        <span className="font-medium">Star</span>
        {stars != null ? (
          <span className="tabular-nums text-[var(--muted-foreground)]">{formatStarCount(stars)}</span>
        ) : null}
      </motion.a>
    </Button>
  )
}
