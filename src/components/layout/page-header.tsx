import type { ReactNode } from 'react'

type PageHeaderProps = {
  badge?: ReactNode
  /** Small muted line next to the badge (e.g. stack / context). */
  meta?: string
  title: ReactNode
  description?: ReactNode
  /** Default matches lab/showcase/notes heading width; widen for dense pages. */
  className?: string
}

/**
 * Shared top-of-page pattern: optional badge + meta, title, description.
 * Pass a custom element as `title` (e.g. motion.h1) when you need animation.
 */
export function PageHeader({
  badge,
  meta,
  title,
  description,
  className = 'max-w-2xl space-y-3',
}: PageHeaderProps) {
  return (
    <header className={className}>
      {(badge != null || meta) && (
        <div className="flex flex-wrap items-center gap-2">
          {badge}
          {meta ? (
            <span className="text-xs text-[var(--muted-foreground)]">{meta}</span>
          ) : null}
        </div>
      )}
      {typeof title === 'string' ? (
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      ) : (
        title
      )}
      {description != null ? (
        typeof description === 'string' ? (
          <p className="text-[var(--muted-foreground)]">{description}</p>
        ) : (
          description
        )
      ) : null}
    </header>
  )
}
