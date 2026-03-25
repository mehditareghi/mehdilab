import { Check, Copy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  applyCodeRangeHighlights,
  type CodeHighlightRange,
} from '@/lib/code-block-range-highlight'
import { mehdiCodeTheme } from '@/lib/mehdi-code-theme'
import { cn } from '@/lib/utils'

type CodeBlockProps = {
  title?: string
  code: string
  language?: string
  /** Character ranges (per source line) to flash when a lab control moves. */
  highlightRanges?: CodeHighlightRange[]
  className?: string
}

type CodeToHtmlFn = typeof import('shiki').codeToHtml

function normalizeShikiLang(lang: string): string {
  const l = lang.toLowerCase().trim()
  const map: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    tsx: 'tsx',
    json: 'json',
    md: 'markdown',
    css: 'css',
    html: 'html',
    bash: 'bash',
    shell: 'bash',
    sh: 'bash',
    yaml: 'yaml',
    yml: 'yaml',
    glsl: 'glsl',
    webgl: 'glsl',
    wgsl: 'wgsl',
  }
  return map[l] ?? l
}

async function highlightCode(
  codeToHtml: CodeToHtmlFn,
  code: string,
  lang: string,
): Promise<string> {
  const shikiLang = normalizeShikiLang(lang)
  try {
    return await codeToHtml(code, {
      lang: shikiLang,
      theme: mehdiCodeTheme,
    })
  } catch {
    return await codeToHtml(code, {
      lang: 'typescript',
      theme: mehdiCodeTheme,
    })
  }
}

export function CodeBlock({
  title,
  code,
  language = 'tsx',
  highlightRanges,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState('')

  const displayHtml = useMemo(
    () =>
      html ? applyCodeRangeHighlights(html, highlightRanges ?? []) : '',
    [html, highlightRanges],
  )

  useEffect(() => {
    let cancelled = false
    import('shiki').then(({ codeToHtml: toHtml }) => {
      if (cancelled) return
      return highlightCode(toHtml, code, language)
    }).then((h) => {
      if (!cancelled && h) setHtml(h)
    })
    return () => {
      cancelled = true
    }
  }, [code, language])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card/45 shadow-[var(--shadow-soft)] ring-1 ring-border/50 backdrop-blur-[2px] dark:bg-card/25',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/80 bg-gradient-to-r from-primary/[0.07] via-transparent to-primary/[0.04] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          {title ? <span className="truncate font-medium text-foreground">{title}</span> : null}
          <span className="shrink-0 rounded-md border border-border/70 bg-background/70 px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
            {language}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div
        className={cn(
          'code-block-shiki relative max-h-[min(70vh,480px)] overflow-auto border-t border-border/50',
          !html && 'min-h-[120px]',
        )}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: displayHtml }} />
        ) : (
          <pre className="p-4 text-left text-[13px]">
            <code className="font-mono text-muted-foreground">{code}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
