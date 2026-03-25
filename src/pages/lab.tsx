import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { experiments } from '@/data/experiments'
import { interactiveCardClassName } from '@/lib/interactive-card'
import { usePageTitle } from '@/hooks/use-page-title'

export function LabPage() {
  usePageTitle('Lab')

  return (
    <div className="space-y-10">
      <PageHeader
        badge={<Badge variant="lab">Lab</Badge>}
        title="Interactive pieces to poke at"
        description="Open an experiment to tune parameters live and copy the snippet that matches what you see — not just a static preview."
      />

      <ul className="grid gap-6 sm:grid-cols-2">
        {experiments.map((exp) => (
          <li key={exp.slug}>
            <Link to={`/lab/${exp.slug}`} className="group block h-full">
              <Card className={interactiveCardClassName('h-full')}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{exp.title}</CardTitle>
                    <Badge variant={exp.status === 'live' ? 'secondary' : 'outline'}>
                      {exp.status === 'live' ? 'Live' : 'WIP'}
                    </Badge>
                  </div>
                  <CardDescription>{exp.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {exp.status === 'live' ? (
                    <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                      Controls + copyable code
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
