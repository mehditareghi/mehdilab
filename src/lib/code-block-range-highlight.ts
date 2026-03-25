/** One-based line index; start/end are 0-based character offsets within that line’s source text. */
export type CodeHighlightRange = {
  line: number
  start: number
  end: number
}

function wrapTextRange(lineEl: HTMLElement, start: number, end: number) {
  if (start >= end || start < 0) return
  const doc = lineEl.ownerDocument
  if (!doc) return

  const walker = doc.createTreeWalker(lineEl, NodeFilter.SHOW_TEXT)
  let charCount = 0
  let startNode: Text | null = null
  let startOffset = 0
  let endNode: Text | null = null
  let endOffset = 0
  let foundStart = false

  let n: Node | null
  while ((n = walker.nextNode())) {
    const t = n as Text
    const len = t.length
    if (!foundStart && charCount + len > start) {
      startNode = t
      startOffset = start - charCount
      foundStart = true
    }
    if (charCount + len >= end) {
      endNode = t
      endOffset = end - charCount
      break
    }
    charCount += len
  }
  if (!startNode || !endNode) return

  const range = doc.createRange()
  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset)

  const span = doc.createElement('span')
  span.className = 'code-range-highlight'
  try {
    range.surroundContents(span)
  } catch {
    // e.g. range partially selects a non-text node — skip
  }
}

/**
 * Wraps character ranges in Shiki output (`<span class="line">` per source line).
 * Requires `DOMParser` (browser). Ranges must match the rendered plain text of each line.
 */
export function applyCodeRangeHighlights(
  html: string,
  ranges: readonly CodeHighlightRange[],
): string {
  if (ranges.length === 0 || typeof DOMParser === 'undefined') return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div id="shiki-wrap">${html}</div>`, 'text/html')
  const wrap = doc.getElementById('shiki-wrap')
  if (!wrap) return html

  const lineEls = wrap.querySelectorAll('span.line')
  lineEls.forEach((el, i) => {
    el.setAttribute('data-line', String(i + 1))
  })

  const byLine = new Map<number, CodeHighlightRange[]>()
  for (const r of ranges) {
    if (r.line < 1 || r.start >= r.end) continue
    const list = byLine.get(r.line) ?? []
    list.push(r)
    byLine.set(r.line, list)
  }

  for (const [, list] of byLine) {
    const sorted = [...list].sort((a, b) => b.start - a.start)
    for (const r of sorted) {
      const lineEl = lineEls[r.line - 1] as HTMLElement | undefined
      if (!lineEl) continue
      wrapTextRange(lineEl, r.start, r.end)
    }
  }

  return wrap.innerHTML
}
