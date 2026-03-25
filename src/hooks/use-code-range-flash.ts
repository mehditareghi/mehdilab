import { useCallback, useEffect, useRef, useState } from 'react'

import type { CodeHighlightRange } from '@/lib/code-block-range-highlight'

/**
 * Temporary sub-line highlights for lab code blocks while sliders move.
 * Clears after `clearAfterMs` of inactivity.
 */
export function useCodeRangeFlash(clearAfterMs = 900) {
  const [highlightRanges, setHighlightRanges] = useState<CodeHighlightRange[]>([])
  const clearT = useRef<ReturnType<typeof setTimeout>>(undefined)

  const flashRanges = useCallback(
    (ranges: CodeHighlightRange[]) => {
      setHighlightRanges(ranges)
      if (clearT.current) clearTimeout(clearT.current)
      clearT.current = setTimeout(() => setHighlightRanges([]), clearAfterMs)
    },
    [clearAfterMs],
  )

  useEffect(
    () => () => {
      if (clearT.current) clearTimeout(clearT.current)
    },
    [],
  )

  return { highlightRanges, flashRanges }
}
