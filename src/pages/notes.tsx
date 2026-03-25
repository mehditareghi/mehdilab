import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { notes } from '@/data/notes'
import { interactiveCardClassName } from '@/lib/interactive-card'
import { usePageTitle } from '@/hooks/use-page-title'

export function NotesPage() {
  usePageTitle('Notes')

  return (
    <div className="space-y-10">
      <PageHeader
        badge={<Badge variant="lab">Notes</Badge>}
        title="Notes & short essays"
        description="Articles on motion, UI craft, and how things here are built — for anyone who wants the details behind the demos."
      />

      <ul className="space-y-4">
        {notes.map((n) => (
          <li key={n.slug}>
            <Link to={`/notes/${n.slug}`} className="group block">
              <Card className={interactiveCardClassName()}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-lg">{n.title}</CardTitle>
                    <time
                      dateTime={n.date}
                      className="text-xs text-[var(--muted-foreground)]"
                    >
                      {n.date}
                    </time>
                  </div>
                  <CardDescription>{n.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
