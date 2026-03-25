import { Link, useParams } from 'react-router-dom'

import { ArrowLeft } from '@/components/animate-ui/icons/arrow-left'
import { IconHoverScope } from '@/components/animate-ui/icons/icon-hover-scope'
import { NoteContent } from '@/components/notes/note-body'
import { Button } from '@/components/ui/button'
import { notes } from '@/data/notes'
import { usePageTitle } from '@/hooks/use-page-title'

export function NoteDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const note = slug ? notes.find((n) => n.slug === slug) : undefined

  usePageTitle(note?.title ?? 'Note')

  if (!note) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild className="-ml-2 gap-2 px-2">
          <Link to="/notes" className="inline-flex">
            <IconHoverScope className="inline-flex items-center gap-2">
              {(hover) => (
                <>
                  <ArrowLeft size={16} animate={hover} />
                  Notes
                </>
              )}
            </IconHoverScope>
          </Link>
        </Button>
        <p className="text-[var(--muted-foreground)]">Note not found.</p>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <Button variant="ghost" asChild className="-ml-2 gap-2 px-2">
        <Link to="/notes" className="inline-flex">
          <IconHoverScope className="inline-flex items-center gap-2">
            {(hover) => (
              <>
                <ArrowLeft size={16} animate={hover} />
                Notes
              </>
            )}
          </IconHoverScope>
        </Link>
      </Button>

      <header className="space-y-2">
        <time
          dateTime={note.date}
          className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]"
        >
          {note.date}
        </time>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {note.title}
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">{note.excerpt}</p>
      </header>

      <NoteContent
        paragraphs={note.paragraphs}
        bodyMarkdown={note.bodyMarkdown}
      />
    </article>
  )
}
