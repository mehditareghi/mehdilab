import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { nav, site } from '@/data/site'

import { GitHubStarButton } from './github-star-button'
import { SiteSettingsMenu } from './site-settings-menu'
import { ThemeToggle } from './theme-toggle'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-[var(--muted)] text-[var(--foreground)]'
      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
  ].join(' ')

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-md dark:bg-[color-mix(in_oklab,var(--background)_80%,transparent)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-baseline gap-2 font-semibold tracking-tight"
        >
          <span>{site.name}</span>
          <span className="hidden text-xs font-normal text-[var(--muted-foreground)] sm:inline">
            playground
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((item) => (
            <NavLink key={item.href} to={item.href} className={linkClass} end={item.href === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex min-w-0 items-center gap-2">
          <GitHubStarButton className="shrink-0" />
          <SiteSettingsMenu />
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[var(--border)] md:hidden"
          >
            <nav
              className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6"
              aria-label="Mobile"
            >
              {nav.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={linkClass}
                  end={item.href === '/'}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
