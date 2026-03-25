import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { CodeBlock } from '@/components/lab/code-block'
import { cn } from '@/lib/utils'

const inlineCode =
  'rounded-md border border-border/60 bg-muted/80 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground'

type NoteBodyProps = {
  markdown: string
  className?: string
}

export function NoteBody({ markdown, className }: NoteBodyProps) {
  return (
    <div className={cn('prose-note max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            return <p className="leading-relaxed text-[var(--muted-foreground)]">{children}</p>
          },
          strong({ children }) {
            return <strong className="font-semibold text-[var(--foreground)]">{children}</strong>
          },
          ul({ children }) {
            return (
              <ul className="my-4 list-inside list-disc space-y-2 text-[var(--muted-foreground)]">
                {children}
              </ul>
            )
          },
          ol({ children }) {
            return (
              <ol className="my-4 list-inside list-decimal space-y-2 text-[var(--muted-foreground)]">
                {children}
              </ol>
            )
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>
          },
          h2({ children }) {
            return (
              <h2 className="mt-8 mb-3 text-lg font-semibold text-[var(--foreground)] first:mt-0">
                {children}
              </h2>
            )
          },
          h3({ children }) {
            return (
              <h3 className="mt-6 mb-2 text-base font-semibold text-[var(--foreground)]">
                {children}
              </h3>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                className="font-medium text-primary underline-offset-4 hover:underline"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noreferrer noopener' : undefined}
              >
                {children}
              </a>
            )
          },
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className ?? '')
            const text = String(children).replace(/\n$/, '')
            const isBlock = Boolean(match) || text.includes('\n')
            if (!isBlock) {
              return <code className={inlineCode}>{children}</code>
            }
            const lang = match?.[1] ?? 'tsx'
            return (
              <div className="my-6">
                <CodeBlock code={text} language={lang} />
              </div>
            )
          },
          pre({ children }) {
            return <>{children}</>
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-4 border-l-2 border-primary/40 pl-4 text-[var(--muted-foreground)] italic">
                {children}
              </blockquote>
            )
          },
          hr() {
            return <hr className="my-8 border-[var(--border)]" />
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

type NoteContentProps = {
  paragraphs?: string[]
  bodyMarkdown?: string
  fallback?: ReactNode
}

export function NoteContent({ paragraphs, bodyMarkdown, fallback }: NoteContentProps) {
  if (bodyMarkdown?.trim()) {
    return <NoteBody markdown={bodyMarkdown} />
  }
  if (paragraphs?.length) {
    return (
      <div className="max-w-none space-y-4 leading-relaxed text-[var(--muted-foreground)]">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    )
  }
  return (
    <p className="text-[var(--muted-foreground)]">
      {fallback ??
        'This is a placeholder detail view. Wire this route to MDX files or your CMS, and keep entries short: what you built, why it mattered, what you would tweak next.'}
    </p>
  )
}
