import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { experiments } from '@/data/experiments'
import { interactiveCardClassName } from '@/lib/interactive-card'
import { usePageTitle } from '@/hooks/use-page-title'
import { cn } from '@/lib/utils'

export function LabPage() {
  usePageTitle('Lab')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tagOptions = useMemo(
    () => [...new Set(experiments.flatMap((exp) => exp.tags.map((tag) => tag.toLowerCase())))].sort(),
    [],
  )

  const filteredExperiments = useMemo(() => {
    if (!selectedTags.length) return experiments
    return experiments.filter((exp) => {
      const expTags = exp.tags.map((tag) => tag.toLowerCase())
      return selectedTags.every((tag) => expTags.includes(tag))
    })
  }, [selectedTags])

  const visibleTagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const exp of filteredExperiments) {
      for (const tag of exp.tags.map((value) => value.toLowerCase())) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    return counts
  }, [filteredExperiments])

  const visibleTags = useMemo(
    () => tagOptions.filter((tag) => selectedTags.includes(tag) || visibleTagCounts.has(tag)),
    [tagOptions, selectedTags, visibleTagCounts],
  )

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((selected) => selected !== tag) : [...prev, tag],
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        badge={<Badge variant="lab">Lab</Badge>}
        title="Interactive pieces to poke at"
        description="Open an experiment to tune parameters live and copy the snippet that matches what you see — not just a static preview."
      />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={selectedTags.length ? 'outline' : 'default'}
            className={cn(
              selectedTags.length
                ? 'border-[var(--border)] text-[var(--foreground)]'
                : 'border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm',
            )}
            onClick={() => setSelectedTags([])}
          >
            All
          </Button>
          {visibleTags.map((tag) => {
            const active = selectedTags.includes(tag)
            const count = visibleTagCounts.get(tag) ?? 0
            return (
              <Button
                key={tag}
                type="button"
                size="sm"
                variant={active ? 'default' : 'outline'}
                className={cn(
                  active
                    ? 'border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
                    : 'border-[var(--border)] bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
                )}
                onClick={() => toggleTag(tag)}
              >
                {tag} {count ? `(${count})` : ''}
              </Button>
            )
          })}
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          {selectedTags.length
            ? `${filteredExperiments.length} match${filteredExperiments.length === 1 ? '' : 'es'} for ${selectedTags.join(', ')}`
            : `${experiments.length} experiment${experiments.length === 1 ? '' : 's'} total`}
        </p>
      </section>

      <ul className="grid gap-6 sm:grid-cols-2">
        {filteredExperiments.map((exp) => (
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
      {!filteredExperiments.length ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">No experiments match these tags</CardTitle>
            <CardDescription>
              Try removing one or more filters to see more experiments.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  )
}
