import { Home } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, useParams } from 'react-router-dom'

import { ArrowLeft } from '@/components/animate-ui/icons/arrow-left'
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right'
import { IconHoverScope } from '@/components/animate-ui/icons/icon-hover-scope'
import { CursorDistortionLab } from '@/components/experiments/cursor-distortion-lab'
import { GlassSpotlightLab } from '@/components/experiments/glass-spotlight-lab'
import { GradientFieldLab } from '@/components/experiments/gradient-field-lab'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { experiments, getExperiment } from '@/data/experiments'
import { usePageTitle } from '@/hooks/use-page-title'

export function ExperimentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const exp = slug ? getExperiment(slug) : undefined

  usePageTitle(exp?.title ?? 'Experiment not found')

  if (!exp) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <Button variant="ghost" asChild className="-ml-2 gap-2 px-2">
          <Link to="/lab" className="gap-2">
            <ArrowLeft size={16} animateOnHover="default" />
            Back to lab
          </Link>
        </Button>

        <motion.header
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge variant="secondary">Lab · not found</Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            No experiment at this path
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            That slug isn’t in the catalog yet — typo, old link, or something still on the
            bench. Pick a live experiment below or head back to the lab index.
          </p>
          {slug ? (
            <p className="font-mono text-sm text-[var(--muted-foreground)]">
              <span className="text-[var(--muted-foreground)]/80">Requested</span>{' '}
              /lab/{slug}
            </p>
          ) : null}
        </motion.header>

        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button asChild>
            <Link to="/lab" className="inline-flex">
              <IconHoverScope className="inline-flex items-center gap-2">
                {(hover) => (
                  <>
                    All experiments
                    <ArrowRight size={16} animate={hover} />
                  </>
                )}
              </IconHoverScope>
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/" className="gap-2">
              <Home className="size-4" aria-hidden />
              Home
            </Link>
          </Button>
        </motion.div>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Available now
          </h2>
          <ul className="space-y-3">
            {experiments.map((e) => (
              <li key={e.slug}>
                <Link
                  to={`/lab/${e.slug}`}
                  className="group block rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_90%,transparent)] px-4 py-3 transition-colors hover:border-[var(--primary)]/40 hover:bg-[color-mix(in_oklab,var(--card)_100%,transparent)]"
                >
                  <span className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                    {e.title}
                  </span>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{e.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" asChild className="-ml-2 gap-2 px-2">
            <Link to="/lab" className="inline-flex">
              <IconHoverScope className="inline-flex items-center gap-2">
                {(hover) => (
                  <>
                    <ArrowLeft size={16} animate={hover} />
                    Lab
                  </>
                )}
              </IconHoverScope>
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {exp.title}
          </h1>
          <p className="max-w-2xl text-[var(--muted-foreground)]">{exp.summary}</p>
          {exp.status === 'live' ? (
            <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
              Use the controls to change the look; the code panel tracks your settings so you
              can copy a starting point into your own project.
            </p>
          ) : null}
        </div>
      </div>

      {exp.slug === 'glass-spotlight' ? <GlassSpotlightLab /> : null}
      {exp.slug === 'gradient-field' ? <GradientFieldLab /> : null}
      {exp.slug === 'cursor-distortion' ? <CursorDistortionLab /> : null}
    </div>
  )
}
