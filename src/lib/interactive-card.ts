import { cn } from '@/lib/utils'

/** Hover affordance for linked or clickable cards — matches site polish (lift + tint + shadow). */
export function interactiveCardClassName(className?: string) {
  return cn(
    'transition-all duration-300 ease-out will-change-transform',
    'hover:-translate-y-0.5',
    'hover:border-[color-mix(in_oklab,var(--primary)_42%,var(--border))]',
    'hover:bg-[color-mix(in_oklab,var(--card)_93%,var(--primary))]',
    'hover:shadow-[0_12px_40px_-16px_color-mix(in_oklab,var(--foreground)_14%,transparent)]',
    'dark:hover:shadow-[0_16px_48px_-12px_rgb(0_0_0_/_0.45)]',
    className,
  )
}
