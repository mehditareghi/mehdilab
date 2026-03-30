import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import { ArrowRight } from '@/components/animate-ui/icons/arrow-right'
import { IconHoverScope } from '@/components/animate-ui/icons/icon-hover-scope'
import { PillarFlask } from '@/components/animate-ui/icons/pillar-flask'
import { PillarLayers } from '@/components/animate-ui/icons/pillar-layers'
import { PillarNotebook } from '@/components/animate-ui/icons/pillar-notebook'
import { GradientField } from '@/components/experiments/gradient-field'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { site } from '@/data/site'
import { interactiveCardClassName } from '@/lib/interactive-card'
import { usePageTitle } from '@/hooks/use-page-title'

const pillars: {
  title: string
  body: string
  PillarIcon: typeof PillarFlask
}[] = [
  {
    title: 'Things to play with',
    body: 'Hands-on pieces in the browser — motion, light, and small details you can actually try instead of only scrolling past.',
    PillarIcon: PillarFlask,
  },
  {
    title: 'Lab and showcase',
    body: 'Rough experiments sit next to work that is more finished, so you can see what is cooking and what already landed.',
    PillarIcon: PillarLayers,
  },
  {
    title: 'Notes',
    body: 'Short reads on how something was made or why a choice mattered — the story behind the work, without the noise.',
    PillarIcon: PillarNotebook,
  },
]

export function HomePage() {
  usePageTitle('Home')
  const [pillarHover, setPillarHover] = useState<string | null>(null)

  return (
    <div className="space-y-16">
      <section className="space-y-8">
        <PageHeader
          className="max-w-3xl space-y-4"
          badge={<Badge variant="lab">Creative playground</Badge>}
          meta="Stack in this site — Animate UI icons · Tailwind v4 · Motion · Radix"
          title={
            <motion.h1
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              Explore a world built from{' '}
              <span className="text-[var(--primary)]">motion</span>, light, and
              tinkering.
            </motion.h1>
          }
          description={
            <p className="text-lg leading-relaxed text-[var(--muted-foreground)]">
              {site.description}
            </p>
          }
        />

        <div className="max-w-3xl space-y-4 pt-0">
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
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
            <Button variant="secondary" asChild>
              <Link to="/showcase">Curated showcase</Link>
            </Button>
          </div>
        </div>

        <GradientField />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {pillars.map((p, i) => {
          const PillarIcon = p.PillarIcon
          const active = pillarHover === p.title
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: '0px 0px -12% 0px' }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Card
                className={interactiveCardClassName(
                  'h-full border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_92%,transparent)]',
                )}
                onMouseEnter={() => setPillarHover(p.title)}
                onMouseLeave={() => setPillarHover(null)}
              >
                <CardHeader>
                  <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <PillarIcon
                      size={16}
                      className="text-[var(--primary)]"
                      animate={active}
                      aria-hidden
                    />
                  </div>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <CardDescription className="text-[var(--muted-foreground)]">
                    {p.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          )
        })}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--muted)]/40 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              What you'll find here
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">
              The Lab is for interactive experiments; the Showcase gathers work
              worth lingering on; Notes are short reads; About tells the story
              behind the site. Experiments sit beside everything else — meant to
              be tried, not tucked away.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/about">Read the angle</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
