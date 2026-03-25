import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { site } from '@/data/site'
import { usePageTitle } from '@/hooks/use-page-title'

export function AboutPage() {
  usePageTitle('About')

  return (
    <div className="space-y-10">
      <PageHeader
        className="max-w-3xl space-y-3"
        badge={<Badge variant="lab">About / now</Badge>}
        title="A playground for surface, motion, and craft"
        description={
          <p className="text-lg text-[var(--muted-foreground)]">{site.tagline}</p>
        }
      />

      <div className="max-w-3xl space-y-5 text-[var(--muted-foreground)]">
        <p className="leading-relaxed">
          <strong className="font-medium text-[var(--foreground)]">{site.name}</strong> is a
          personal site built around the{' '}
          <strong className="font-medium text-[var(--foreground)]">lab</strong>: interactive
          experiments and motion studies live here as real pages, not tucked behind a generic
          portfolio grid. The{' '}
          <strong className="font-medium text-[var(--foreground)]">showcase</strong> gathers work
          worth lingering on;{' '}
          <strong className="font-medium text-[var(--foreground)]">notes</strong> hold short
          writing when there is something concrete to say about how it was built or why it felt
          right.
        </p>
        <p className="leading-relaxed">
          {site.description} I care about how interfaces move, how type and color hold together,
          and about shipping things you can actually open and use — even when they are small.
        </p>
      </div>

      <Separator />

      <section className="max-w-3xl space-y-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Now</h2>
        <p className="leading-relaxed text-[var(--muted-foreground)]">
          I am still finding my way with this place: no fixed roadmap, just a direction. For now
          I am shipping{' '}
          <strong className="font-medium text-[var(--foreground)]">small experiments</strong>{' '}
          to the lab, adding{' '}
          <strong className="font-medium text-[var(--foreground)]">notes and other content</strong>{' '}
          when I have drafts worth publishing, and iterating on the site itself as I learn what
          feels useful to keep public. If you come back later, there should be a little more to
          explore — that is the point.
        </p>
      </section>

      <Separator />

      <section className="max-w-3xl space-y-3">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Contact</h2>
        <p className="leading-relaxed text-[var(--muted-foreground)]">
          <span className="text-[var(--foreground)]">{site.author}</span>
          {' · '}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
        </p>
      </section>
    </div>
  )
}
