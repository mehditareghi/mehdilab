import { useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Tracks hover for the whole row so animated icons (arrows, etc.) can use
 * `animate={hovered}` and respond when the pointer is anywhere on the link/button.
 */
export function IconHoverScope({
  className,
  children,
}: {
  className?: string
  children: (hovered: boolean) => ReactNode
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      role="presentation"
      className={cn('inline-flex min-w-0 items-center gap-inherit', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children(hovered)}
    </span>
  )
}
