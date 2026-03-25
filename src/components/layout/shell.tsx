import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

export function Shell() {
  const { pathname } = useLocation()

  // BrowserRouter does not reset scroll; a long scroll on the previous route
  // would otherwise stay applied and show the bottom of shorter pages (e.g. home).
  // useLayoutEffect runs before paint so we don’t fight the first user scroll frame.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
