import { Home } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import { ArrowRight } from '@/components/animate-ui/icons/arrow-right'
import { IconHoverScope } from '@/components/animate-ui/icons/icon-hover-scope'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/use-page-title'

export function NotFoundPage() {
  usePageTitle('Not found')

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <motion.header
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Badge variant="secondary">404 · not found</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          This page isn’t on the map
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          The link might be wrong, or this route was never shipped. You’re still in the
          site — just not on a page that exists.
        </p>
      </motion.header>

      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <Button asChild>
          <Link to="/" className="gap-2">
            <Home className="size-4" aria-hidden />
            Back home
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/lab" className="inline-flex">
            <IconHoverScope className="inline-flex items-center gap-2">
              {(hover) => (
                <>
                  Open the lab
                  <ArrowRight size={16} animate={hover} />
                </>
              )}
            </IconHoverScope>
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
