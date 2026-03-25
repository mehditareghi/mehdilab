import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { showcaseItems } from '@/data/showcase'
import { interactiveCardClassName } from '@/lib/interactive-card'
import { usePageTitle } from '@/hooks/use-page-title'

export function ShowcasePage() {
  usePageTitle('Showcase')

  return (
    <div className="space-y-10">
      <PageHeader
        badge={<Badge variant="lab">Showcase</Badge>}
        title="Work worth showing"
        description="Polished pieces and narratives — the kind of work you’d put in a portfolio or share with a team, not just a file dump."
      />

      <div className="space-y-8">
        {showcaseItems.map((item) => (
          <Card key={item.title} className={interactiveCardClassName()}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Stack
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {item.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 py-1 text-xs"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                <span className="font-medium text-[var(--foreground)]">
                  Takeaway:
                </span>{' '}
                {item.highlight}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
