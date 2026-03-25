import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ExperimentPanelProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function ExperimentPanel({
  title,
  description,
  children,
  className,
}: ExperimentPanelProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]',
        className,
      )}
    >
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}
